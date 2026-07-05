import type { DailyMeal, Lens } from './types';

// ============================================================
//  lenses — config that drives EVERYTHING per lens: theme,
//  bottom tabs, screen content, copy, disclaimers, mock data.
//  Each lens is effectively its own mini-app inside Prismiq.
//  (Ported 1:1 from the web app; CSS gradients become color
//   arrays consumed by expo-linear-gradient.)
// ============================================================
export const lenses: Lens[] = [
  {
    id: 'plate',
    name: 'PlateLens',
    shortName: 'Food',
    lensType: 'Food & Meal Lens',
    subjectWord: 'meal',
    dailyLimit: 5,
    tagline: 'Scan meals. Track nutrition. Eat smarter.',
    cta: 'Scan Meal',
    description: 'Analyze meals, estimate nutrition, and track your daily intake.',
    accent: '#22A45D',
    glow: 'rgba(40,190,110,.5)',
    bgTint: '#f3faf5',
    btnColors: ['#2FBE6E', '#1E9B54'],
    glassTint: 'rgba(247,252,249,.62)',
    softTint: 'rgba(240,249,243,.62)',
    scanInstruction: 'Place your full meal in frame with even lighting for the best estimate.',
    disclaimer:
      'Nutrition values are AI-generated estimates and may not be fully accurate. For medical, allergy-related, fitness, or strict diet needs, verify with official nutrition labels or a qualified professional.',
    tabs: [
      { id: 'today', label: 'Today' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'scan', label: 'Scan', center: true },
      { id: 'history', label: 'History' },
      { id: 'goal', label: 'Goal' },
    ],
    result: {
      title: 'Avocado Toast with Poached Egg',
      subtitle: 'Breakfast · 1 serving',
      description: 'Sourdough toast topped with mashed avocado, a poached egg and fresh arugula.',
      confidence: 95,
      caution:
        'Contains egg and gluten (common allergens). Calorie and fat content can vary with portion size and added ingredients.',
      fields: [
        { label: 'Calories', value: '330 kcal' },
        { label: 'Protein', value: '12 g' },
        { label: 'Carbs', value: '27 g' },
        { label: 'Fat', value: '21 g' },
      ],
      lists: [
        {
          title: 'Benefits',
          items: [
            'Rich in healthy fats from avocado',
            'Good source of protein from the poached egg',
            'Fiber from avocado, sourdough and arugula',
            'Provides various vitamins and minerals',
          ],
        },
      ],
      portionQs: [
        'What type of bread was used?',
        'Was any oil or butter added?',
        'How much avocado was used?',
        'How many eggs?',
        'What was the serving size?',
      ],
      chat: [
        { ai: 'Nice pick! 🥑 What kind of bread was the base?', options: ['Sourdough', 'Whole wheat', 'White', 'Rye'] },
        { ai: 'Got it. Any oil or butter added?', options: ['A little butter', 'Olive oil', 'None'] },
        { ai: 'How much avocado would you say?', options: ['Half', 'A whole one', 'Just a smear'] },
        { ai: 'And how many eggs?', options: ['One', 'Two', 'None'] },
        { ai: 'Last one — what serving size felt right?', options: ['Small', 'Regular', 'Large'] },
      ],
    },
    history: [
      { name: 'Avocado Toast with Poached Egg', meta: '330 kcal · Breakfast', time: 'Today', cal: '330', day: 3 },
      { name: 'Grilled Chicken Bowl', meta: '540 kcal · Lunch', time: 'Yesterday', cal: '540', day: 2 },
      { name: 'Greek Salad', meta: '280 kcal · Lunch', time: '2d ago', cal: '280', day: 1 },
    ],
  },
  {
    id: 'fresh',
    name: 'FreshLens',
    shortName: 'Produce',
    subjectWord: 'produce',
    dailyLimit: 10,
    tagline: 'Pick the ripe one',
    cta: 'Scan produce',
    description: 'Identify fruits and vegetables, check freshness and learn how to store them.',
    accent: '#5C9E2E',
    glow: 'rgba(120,200,70,.5)',
    bgTint: '#f7fbee',
    btnColors: ['#8DC63F', '#5C9E2E'],
    glassTint: 'rgba(249,253,242,.62)',
    softTint: 'rgba(244,251,231,.62)',
    scanInstruction: 'Frame a single fruit or vegetable up close so we can read its color and skin.',
    disclaimer: 'Produce identification and freshness are AI estimates. Always inspect produce before eating.',
    tabs: [
      { id: 'discover', label: 'Discover' },
      { id: 'history', label: 'History' },
      { id: 'scan', label: 'Scan', center: true },
      { id: 'saved', label: 'Saved' },
      { id: 'guide', label: 'Guide' },
    ],
    result: {
      title: 'Sayote',
      aka: 'Chayote',
      subtitle: 'Vegetable · Gourd',
      description: 'A mild green gourd with crisp flesh, common in home cooking and soups.',
      confidence: 88,
      caution: 'Freshness is a visual estimate. Always inspect produce before eating.',
      fields: [
        { label: 'Category', value: 'Gourd' },
        { label: 'Freshness', value: 'Looks fresh' },
        { label: 'Calories', value: 'Low' },
        { label: 'Storage', value: 'Fridge 1–2 wk' },
      ],
      lists: [
        {
          title: 'Benefits & nutrients',
          items: [
            'Low in calories',
            'Good source of dietary fiber',
            'Contains vitamin C and folate',
            'Hydrating with a mild flavor',
          ],
        },
        {
          title: 'How to eat & cook',
          items: [
            'Sauté with garlic and onion',
            'Add to soups and stews',
            'Steam and season lightly',
            'Grate raw into fresh salads',
          ],
        },
        {
          title: 'Storage tips',
          items: [
            'Refrigerate in the crisper drawer',
            'Keeps fresh for 1–2 weeks',
            'Do not wash until ready to use',
          ],
        },
      ],
    },
    history: [
      { name: 'Banana', meta: 'Fruit · Ripe', time: 'Today' },
      { name: 'Spinach', meta: 'Vegetable · Fresh', time: 'Yesterday' },
      { name: 'Avocado', meta: 'Fruit · Firm', time: '3d ago' },
    ],
    content: {
      heroTitle: 'Identify unfamiliar produce instantly',
      heroSub: 'Point your camera at any fruit or vegetable to learn what it is, how fresh it is, and how to use it.',
      cardsTitle: 'Featured produce',
      cards: [
        { name: 'Mango', tag: 'In season' },
        { name: 'Kale', tag: 'Superfood' },
        { name: 'Dragon Fruit', tag: 'Exotic' },
        { name: 'Beetroot', tag: 'Root crop' },
      ],
      grid: [
        { name: 'Fruits', sub: '6 saved' },
        { name: 'Vegetables', sub: '4 saved' },
        { name: 'Herbs', sub: '2 saved' },
        { name: 'Root Crops', sub: '3 saved' },
      ],
      items: [
        { name: 'Banana', meta: 'Fruit · Ripe' },
        { name: 'Spinach', meta: 'Vegetable · Fresh' },
        { name: 'Avocado', meta: 'Fruit · Firm' },
      ],
      guide: [
        { title: 'Ripeness guide', body: 'Tell when fruit is ready to eat by color and firmness.' },
        { title: 'Storage tips', body: 'Keep produce fresh longer at the right temperature.' },
        { title: 'Local names', body: 'Common and regional names for the same produce.' },
        { title: 'How to cook', body: 'Simple prep ideas for everyday vegetables.' },
      ],
    },
  },
  {
    id: 'plant',
    name: 'PlantLens',
    shortName: 'Plants',
    subjectWord: 'plant',
    dailyLimit: 5,
    tagline: 'Meet your plant',
    cta: 'Scan a plant',
    description: 'Identify plants and flowers, then keep every leaf thriving.',
    accent: '#158A5A',
    glow: 'rgba(30,170,110,.5)',
    bgTint: '#f2faf6',
    btnColors: ['#2FB37C', '#158A5A'],
    glassTint: 'rgba(244,252,248,.62)',
    softTint: 'rgba(238,250,244,.62)',
    scanInstruction: 'Capture a clear leaf, flower or stem. A well-lit close-up improves the match.',
    disclaimer: 'Do not eat or handle a wild plant based only on AI identification. Verify toxicity with a professional.',
    tabs: [
      { id: 'care', label: 'Care' },
      { id: 'myplants', label: 'My Plants' },
      { id: 'scan', label: 'Scan', center: true },
      { id: 'reminders', label: 'Reminders' },
      { id: 'guide', label: 'Guide' },
    ],
    result: {
      title: 'Monstera Deliciosa',
      sci: 'Monstera deliciosa',
      subtitle: 'Houseplant · Tropical',
      description: 'A popular tropical houseplant known for its large, glossy split leaves.',
      confidence: 84,
      caution: 'Do not eat wild plants based only on AI identification. Verify toxicity with a professional.',
      fields: [
        { label: 'Type', value: 'Tropical' },
        { label: 'Difficulty', value: 'Easy' },
        { label: 'Water', value: 'Weekly' },
        { label: 'Sunlight', value: 'Bright indirect' },
        { label: 'Soil', value: 'Well-draining' },
        { label: 'Safety', value: 'Toxic to pets' },
      ],
      lists: [
        {
          title: 'Common issues',
          items: [
            'Yellowing leaves often mean overwatering',
            'Brown edges suggest low humidity',
            'Leggy growth means it needs more light',
          ],
        },
      ],
    },
    history: [
      { name: 'Snake Plant', meta: 'Easy care', time: '2d ago' },
      { name: 'Pothos', meta: 'Low light', time: 'Last week' },
      { name: 'Fiddle Leaf Fig', meta: 'Bright light', time: '2 wk ago' },
    ],
    content: {
      heroTitle: 'Your plant care companion',
      heroSub: 'Identify plants, track watering, and keep every leaf thriving in one calm dashboard.',
      careTip: 'Rotate plants a quarter turn each week so every side gets even light.',
      cardsTitle: 'Your garden at a glance',
      cards: [
        { name: 'Water today', tag: '1 plant' },
        { name: 'Needs light', tag: '2 plants' },
        { name: 'Healthy', tag: '4 plants' },
        { name: 'New', tag: 'Add a plant' },
      ],
      items: [
        { name: 'Monstera Deliciosa', meta: 'Easy · Weekly water' },
        { name: 'Snake Plant', meta: 'Easy · Biweekly water' },
        { name: 'Pothos', meta: 'Easy · Weekly water' },
        { name: 'Fiddle Leaf Fig', meta: 'Medium · Weekly water' },
      ],
      reminders: [
        { plant: 'Monstera Deliciosa', note: 'Water ~250 ml', when: 'Today, 6 PM' },
        { plant: 'Snake Plant', note: 'Check soil moisture', when: 'Saturday' },
        { plant: 'Pothos', note: 'Mist the leaves', when: 'Sunday' },
      ],
      guide: [
        { title: 'Watering guide', body: 'How much and how often for common houseplants.' },
        { title: 'Sunlight guide', body: 'Match each plant to the right light level.' },
        { title: 'Pet toxicity', body: 'Which plants to keep away from pets and kids.' },
        { title: 'Repotting', body: 'When and how to give roots more room.' },
      ],
    },
  },
  {
    id: 'rock',
    name: 'RockLens',
    shortName: 'Stones',
    subjectWord: 'stone',
    dailyLimit: 5,
    tagline: 'Read the stone',
    cta: 'Scan a stone',
    description: 'Get a visual best-guess at rocks, minerals and gems from a photo.',
    accent: '#6B6FB2',
    glow: 'rgba(120,120,200,.5)',
    bgTint: '#f4f5fb',
    btnColors: ['#8A8ED6', '#6B6FB2'],
    glassTint: 'rgba(247,248,253,.62)',
    softTint: 'rgba(242,244,251,.62)',
    scanInstruction: 'Photograph the stone in natural light and capture its color, shine and texture.',
    disclaimer: 'Stone results are visual guesses only — not certified geological, gemstone or value testing.',
    tabs: [
      { id: 'explore', label: 'Explore' },
      { id: 'collection', label: 'Collection' },
      { id: 'scan', label: 'Scan', center: true },
      { id: 'compare', label: 'Compare' },
      { id: 'guide', label: 'Guide' },
    ],
    result: {
      title: 'Amethyst (possible)',
      subtitle: 'Quartz family',
      description: 'A purple variety of quartz. This is a visual best-guess only.',
      confidence: 76,
      caution: 'Image-based result only. Not a certified mineral, gemstone, or value test.',
      fields: [
        { label: 'Category', value: 'Mineral · Quartz' },
        { label: 'Color', value: 'Purple, glassy' },
        { label: 'Texture', value: 'Crystalline' },
        { label: 'Hardness', value: '≈ 7 Mohs' },
        { label: 'Appearance', value: 'Translucent' },
        { label: 'Uses', value: 'Jewelry, decor' },
      ],
      lists: [
        {
          title: 'Similar-looking stones',
          items: ['Fluorite', 'Purple sapphire', 'Lepidolite', 'Charoite'],
        },
      ],
    },
    history: [
      { name: 'Rose Quartz', meta: 'Quartz · Pink', time: '3d ago' },
      { name: 'Obsidian', meta: 'Volcanic glass', time: 'Last week' },
      { name: 'Pyrite', meta: 'Metallic gold', time: '2 wk ago' },
    ],
    content: {
      heroTitle: 'Explore rocks, minerals & gems',
      heroSub: 'Get a visual best-guess at any stone from a single photo, then build your collection.',
      cardsTitle: 'Discover geology',
      cards: [
        { name: 'Quartz family', tag: 'Common' },
        { name: 'Igneous rocks', tag: 'Volcanic' },
        { name: 'Gemstones', tag: 'Precious' },
        { name: 'Crystals', tag: 'Collectible' },
      ],
      items: [
        { name: 'Rose Quartz', meta: 'Quartz · 78% match' },
        { name: 'Obsidian', meta: 'Volcanic glass · 85%' },
        { name: 'Pyrite', meta: 'Sulfide · 72%' },
        { name: 'Amethyst', meta: 'Quartz · 76%' },
      ],
      compare: [
        { a: 'Purple, glassy', label: 'Appearance', b: '—' },
        { a: '≈ 7 Mohs', label: 'Hardness', b: '—' },
        { a: 'Jewelry, decor', label: 'Uses', b: '—' },
      ],
      guide: [
        { title: 'Hardness (Mohs)', body: 'Scratch tests to estimate a mineral’s hardness.' },
        { title: 'Streak test', body: 'The color a mineral leaves on unglazed tile.' },
        { title: 'Luster & texture', body: 'How light reflects off the surface.' },
        { title: 'Safety & certification', body: 'Why lab testing is needed for real value.' },
      ],
    },
  },
];

// Mock July-2026 daily meal log for PlateLens calendar (name, time, cal + macros in g)
export const plateLog: Record<number, DailyMeal[]> = {
  1: [
    { name: 'Overnight Oats', time: '8:10 AM', cal: 320, carbs: 54, protein: 12, fat: 8 },
    { name: 'Grilled Salmon & Greens', time: '1:20 PM', cal: 480, carbs: 6, protein: 42, fat: 30 },
  ],
  2: [
    { name: 'Greek Yogurt Bowl', time: '8:30 AM', cal: 240, carbs: 30, protein: 18, fat: 6 },
    { name: 'Chicken Wrap', time: '12:45 PM', cal: 520, carbs: 48, protein: 34, fat: 20 },
    { name: 'Apple', time: '4:00 PM', cal: 95, carbs: 25, protein: 0, fat: 0 },
  ],
  3: [
    { name: 'Avocado Toast with Poached Egg', time: '8:15 AM', cal: 330, carbs: 27, protein: 12, fat: 21 },
    { name: 'Grilled Chicken Bowl', time: '1:00 PM', cal: 540, carbs: 45, protein: 46, fat: 18 },
    { name: 'Greek Salad', time: '7:30 PM', cal: 280, carbs: 18, protein: 9, fat: 22 },
  ],
  4: [
    { name: 'Berry Smoothie', time: '9:00 AM', cal: 210, carbs: 38, protein: 8, fat: 4 },
    { name: 'Turkey Sandwich', time: '1:15 PM', cal: 430, carbs: 44, protein: 28, fat: 16 },
  ],
  5: [
    { name: 'Buttermilk Pancakes', time: '8:45 AM', cal: 520, carbs: 72, protein: 12, fat: 18 },
    { name: 'Caesar Salad', time: '12:30 PM', cal: 360, carbs: 14, protein: 20, fat: 26 },
  ],
  8: [{ name: 'Eggs & Sourdough', time: '8:20 AM', cal: 380, carbs: 32, protein: 20, fat: 19 }],
  10: [{ name: 'Burrito Bowl', time: '1:10 PM', cal: 720, carbs: 78, protein: 34, fat: 28 }],
  12: [{ name: 'Pesto Pasta', time: '7:45 PM', cal: 640, carbs: 82, protein: 22, fat: 24 }],
};

export const macroColor: Record<string, string> = {
  Calories: '#22A45D',
  Carbs: '#FF9F0A',
  Protein: '#FF375F',
  Fat: '#0A84FF',
};
