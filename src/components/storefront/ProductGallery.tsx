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
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (vertical on desktop, horizontal on mobile) */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 border-2 transition-all shrink-0 ${
                safeActiveIndex === idx
                  ? 'border-zinc-950 scale-105 shadow-sm'
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

      {/* Main Large Image Viewer with Interactive Zoom */}
      <div
        className="relative flex-1 aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 cursor-crosshair group shadow-xs"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={currentImageSrc}
          alt={productName || "Men's Territory Product"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
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
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-zinc-700 font-medium pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity border border-zinc-200 shadow-xs">
          Hover to zoom
        </div>
      </div>
    </div>
  );
}
