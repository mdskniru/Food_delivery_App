import { useEffect, useState } from 'react';

const FALLBACK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff7ed"/>
        <stop offset="1" stop-color="#fed7aa"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="72" font-weight="bold"
      fill="#ea580c" text-anchor="middle" dominant-baseline="middle">Tripti</text>
  </svg>`
)}`;

export default function SmartImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={failed ? FALLBACK : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
