'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Filter out any undefined, null, or empty string values
  const validImages = (Array.isArray(images) ? images : [])
    .filter((img): img is string => typeof img === 'string' && img.trim().length > 0);

  const displayImages = validImages.length > 0 ? validImages : [FALLBACK_IMAGE];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  const safeActiveIndex =
    activeImageIndex >= 0 && activeImageIndex < displayImages.length ? activeImageIndex : 0;
  const currentImageSrc = displayImages[safeActiveIndex] || FALLBACK_IMAGE;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-2.5 sm:gap-4 max-w-[270px] sm:max-w-md lg:max-w-none mx-auto lg:mx-0">
      {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar pb-1 lg:pb-0 shrink-0 justify-center lg:justify-start">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              onMouseEnter={() => setActiveImageIndex(idx)}
              className={`relative w-12 h-16 sm:w-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all shrink-0 cursor-pointer ${
                safeActiveIndex === idx
                  ? 'border-zinc-950 scale-105 shadow-xs'
                  : 'border-zinc-200 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img || FALLBACK_IMAGE}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Image Viewer with Interactive Hover Zoom */}
      <div
        className="relative flex-1 aspect-[3/4] w-full max-h-[300px] sm:max-h-[460px] lg:max-h-none rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 cursor-crosshair group shadow-xs"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={currentImageSrc}
          alt={productName || "Men's Territory Product"}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className={`object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                }
              : undefined
          }
        />

        {/* Zoom Hint Icon */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-zinc-700 font-medium pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity border border-zinc-200 shadow-xs">
          Hover to zoom
        </div>
      </div>
    </div>
  );
}
