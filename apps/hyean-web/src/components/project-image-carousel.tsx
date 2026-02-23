'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';

type ProjectImageCarouselProps = {
  images: string[];
  alt: string;
  priority?: boolean;
  sizes?: string;
  variant?: 'card' | 'detail' | 'archive';
  fit?: 'cover' | 'contain';
  backdropColor?: string;
};

export function ProjectImageCarousel({
  images,
  alt,
  priority = false,
  sizes = '(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 33vw',
  variant = 'card',
  fit = 'cover',
  backdropColor,
}: ProjectImageCarouselProps) {
  const sourceImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselStyle = backdropColor
    ? ({ '--project-carousel-backdrop': backdropColor } as CSSProperties)
    : undefined;

  useEffect(() => {
    setActiveIndex(0);
    if (sourceImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sourceImages.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [sourceImages.length]);

  if (sourceImages.length === 0) return null;

  return (
    <div className={`project-carousel project-carousel-${variant}`} style={carouselStyle}>
      {sourceImages.map((src, index) => (
        <Image
          key={`${src}-${index}`}
          src={src}
          alt={`${alt} 이미지 ${index + 1}`}
          fill
          sizes={sizes}
          className={`project-carousel-image project-carousel-image-fit-${fit} ${index === activeIndex ? 'is-active' : ''}`}
          priority={priority && index === 0}
        />
      ))}
      {sourceImages.length > 1 ? (
        <div className="project-carousel-indicators" aria-hidden="true">
          {sourceImages.map((_, index) => (
            <span
              key={`dot-${index}`}
              className={`project-carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
