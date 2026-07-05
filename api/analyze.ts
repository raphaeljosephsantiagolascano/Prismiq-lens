import { GoogleGenAI, Type, type Schema } from '@google/genai';

type LensId = 'plate' | 'fresh' | 'plant' | 'rock';

type VercelRequest = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

interface LensPrompt {
  subjectWord: string;
  system: string;
  refineChat: boolean;
}

const SHARED = `You are Prismiq, a premium AI scanner. You are given a single photo and must identify the subject and return a concise, structured result.

Rules:
- Base every field ONLY on what is visible in the photo. Never invent details you cannot see.
- "confidence" is your visual confidence as an integer 0-100.
- Keep "title" short (the item's name). "subtitle" is a short category line.
- "description" is one or two calm sentences.
- "caution" is a short, honest safety/accuracy note appropriate to this lens.
- "fields" are 4-6 short label/value chips (label is 1-2 words, value is short).
- "lists" are 1-3 titled bullet groups, each 3-4 short bullets.
- If you genuinely cannot tell what the subject is, still return your best guess with a low confidence and say so in the description.
- Return ONLY the structured object requested — no extra commentary.`;

const LENS_PROMPTS: Record<LensId, LensPrompt> = {
  plate: {
    subjectWord: 'meal',
    refineChat: true,
    system: `${SHARED}

This is the FOOD & MEAL lens. Identify the meal and estimate its nutrition.
- "fields" MUST be exactly these four, in this order, with these labels: "Calories" (e.g. "330 kcal"), "Protein" (e.g. "12 g"), "Carbs" (e.g. "27 g"), "Fat" (e.g. "21 g"). Estimate for a single typical serving shown.
- "lists": include a "Benefits" group.
- "caution": note that values are AI estimates and to verify allergens / labels for medical or dietary needs.
- Also return "portionQs": 3-5 short questions whose answers would sharpen the estimate (bread type, oil added, portion size, etc.).
- Also return "chat": 3-5 turns; each turn is a friendly one-sentence question ("ai") plus 3-4 short answer "options".`,
  },
  fresh: {
    subjectWord: 'produce',
    refineChat: false,
    system: `${SHARED}

This is the FRESH PRODUCE lens. Identify the fruit/vegetable, judge freshness, and give storage/use tips.
- Use "aka" for a common alternate/local name if there is one.
- "fields" should cover things like Category, Freshness, Calories (Low/Med/High), Storage.
- "lists": include groups like "Benefits & nutrients", "How to eat & cook", and "Storage tips".
- "caution": freshness is a visual estimate; always inspect produce before eating.`,
  },
  plant: {
    subjectWord: 'plant',
    refineChat: false,
    system: `${SHARED}

This is the PLANT lens. Identify the plant/flower and give care guidance.
- Use "sci" for the scientific (Latin) name if you can.
- "fields" should cover Type, Difficulty, Water, Sunlight, Soil, Safety (pet toxicity).
- "lists": include a "Common issues" group.
- "caution": do NOT eat or handle wild plants based only on AI identification; verify toxicity with a professional.`,
  },
  rock: {
    subjectWord: 'stone',
    refineChat: false,
    system: `${SHARED}

This is the ROCK/MINERAL/GEM lens. Give a visual best-guess identification only.
- "title" should hedge appropriately (e.g. "Amethyst (possible)").
- "fields" should cover Category, Color, Texture, Hardness (approx Mohs), Appearance, Uses.
- "lists": include a "Similar-looking stones" group.
- "caution": image-based result only — not a certified mineral, gemstone, or value test.`,
  },
};

const FIELD_ITEM: Schema = {
  type: Type.OBJECT,
  properties: { label: { type: Type.STRING }, value: { type: Type.STRING } },
  required: ['label', 'value'],
};
const LIST_ITEM: Schema = {
  type: Type.OBJECT,
  properties: { title: { type: Type.STRING }, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
  required: ['title', 'items'],
};
const CHAT_ITEM: Schema = {
  type: Type.OBJECT,
  properties: { ai: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } } },
  required: ['ai', 'options'],
};

function responseSchema(lensId: LensId): Schema {
  const wantChat = LENS_PROMPTS[lensId].refineChat;
  const properties: Record<string, Schema> = {
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    description: { type: Type.STRING },
    confidence: { type: Type.INTEGER },
    caution: { type: Type.STRING },
    fields: { type: Type.ARRAY, items: FIELD_ITEM },
    lists: { type: Type.ARRAY, items: LIST_ITEM },
  };
  if (lensId === 'fresh') properties.aka = { type: Type.STRING };
  if (lensId === 'plant') properties.sci = { type: Type.STRING };
  const required = ['title', 'subtitle', 'description', 'confidence', 'caution', 'fields', 'lists'];
  if (wantChat) {
    properties.portionQs = { type: Type.ARRAY, items: { type: Type.STRING } };
    properties.chat = { type: Type.ARRAY, items: CHAT_ITEM };
  }
  return { type: Type.OBJECT, properties, required };
}

interface RateWindow {
  start: number;
  count: number;
}

interface TokenBucket {
  day: string;
  tokens: number;
}

const windows = new Map<string, RateWindow>();
const tokenBuckets = new Map<string, TokenBucket>();

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const _rawLimit = Number(process.env.DAILY_TOKEN_LIMIT);
const DAILY_TOKEN_LIMIT = Number.isFinite(_rawLimit) ? _rawLimit : 50_000;
const APP_SECRET = process.env.APP_SECRET || '';
const RATE_LIMIT_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN) || 20;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

let ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return ai;
}

function headerValue(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] || '' : v || '';
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function tokensUsed(userId: string): number {
  const existing = tokenBuckets.get(userId);
  if (existing && existing.day === today()) return existing.tokens;
  tokenBuckets.set(userId, { day: today(), tokens: 0 });
  return 0;
}

function addTokens(userId: string, count: number): void {
  const bucket = tokenBuckets.get(userId);
  if (bucket && bucket.day === today()) {
    bucket.tokens += Math.max(0, Math.round(count) || 0);
    return;
  }
  tokenBuckets.set(userId, { day: today(), tokens: Math.max(0, Math.round(count) || 0) });
}

function rateLimited(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  const existing = windows.get(key);
  if (!existing || now - existing.start >= windowMs) {
    windows.set(key, { start: now, count: 1 });
    return false;
  }
  existing.count += 1;
  return existing.count > limit;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function statusOf(error: unknown): number {
  const match = String((error as { message?: string })?.message ?? error ?? '').match(/status:\s*(\d+)/);
  return match ? Number(match[1]) : 0;
}

function isTransient(error: unknown): boolean {
  const status = statusOf(error);
  if ([429, 500, 502, 503, 504, 529].includes(status)) return true;
  return /UNAVAILABLE|overloaded|high demand|deadline exceeded/i.test(String((error as { message?: string })?.message ?? ''));
}

async function generateWithRetry(params: Parameters<GoogleGenAI['models']['generateContent']>[0]) {
  const delays = [0, 700, 2000];
  let lastError: unknown;
  for (let i = 0; i < delays.length; i += 1) {
    if (delays[i]) await sleep(delays[i]);
    try {
      return await getAI().models.generateContent(params);
    } catch (error) {
      lastError = error;
      if (!isTransient(error) || i === delays.length - 1) throw error;
      console.warn(`[analyze] transient error (status ${statusOf(error)}), retry ${i + 1}/${delays.length - 1}`);
    }
  }
  throw lastError;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id, x-app-key');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (APP_SECRET && headerValue(req.headers['x-app-key']) !== APP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const forwarded = headerValue(req.headers['x-forwarded-for']);
  const ip = forwarded.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(`ip:${ip}`, RATE_LIMIT_PER_MIN)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  const body = (req.body ?? {}) as { image?: unknown; mimeType?: unknown; lensId?: unknown };
  const { image, mimeType, lensId } = body;

  if (typeof image !== 'string' || !image) {
    return res.status(400).json({ error: 'Missing "image" (base64 string).' });
  }
  if (!['plate', 'fresh', 'plant', 'rock'].includes(String(lensId))) {
    return res.status(400).json({ error: 'Invalid "lensId". Expected one of plate, fresh, plant, rock.' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
  }

  const safeLensId = lensId as LensId;
  const media = typeof mimeType === 'string' && ALLOWED_MIME.has(mimeType) ? mimeType : 'image/jpeg';
  const lens = LENS_PROMPTS[safeLensId];
  const userId = headerValue(req.headers['x-user-id']).slice(0, 128) || 'anonymous';

  if (tokensUsed(userId) >= DAILY_TOKEN_LIMIT) {
    return res.status(429).json({ error: 'Daily scan limit reached. Resets tomorrow.', tokensRemaining: 0 });
  }

  try {
    const response = await generateWithRetry({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: media, data: image } },
            { text: `Analyze this ${lens.subjectWord} photo and return the structured result.` },
          ],
        },
      ],
      config: {
        systemInstruction: lens.system,
        responseMimeType: 'application/json',
        responseSchema: responseSchema(safeLensId),
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    });

    addTokens(userId, response.usageMetadata?.totalTokenCount ?? 0);
    const tokensRemaining = Math.max(0, DAILY_TOKEN_LIMIT - tokensUsed(userId));
    res.setHeader('X-Tokens-Remaining', String(tokensRemaining));

    const text = response.text;
    if (!text) {
      const finish = response.candidates?.[0]?.finishReason;
      const message =
        finish === 'MAX_TOKENS'
          ? 'The result was too long — try a clearer, simpler photo.'
          : 'The model returned an empty result. Try another photo.';
      return res.status(502).json({ error: message });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'The model returned an unreadable result. Try again.' });
    }

    const confidence = Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 0)));
    return res.status(200).json({ ...parsed, confidence, tokensRemaining });
  } catch (error) {
    console.error('[api/analyze] error:', error);
    return res.status(502).json({ error: 'Analysis failed. Please try again.' });
  }
}
