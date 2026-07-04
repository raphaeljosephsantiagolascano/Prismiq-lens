interface IconProps {
  html: string;
  size?: number | string;
  color?: string;
  style?: React.CSSProperties;
}

export function Icon({ html, size = '100%', color, style }: IconProps) {
  return (
    <div
      style={{ width: size, height: size, color, lineHeight: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
