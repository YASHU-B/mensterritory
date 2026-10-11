import React from 'react';

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-40 rounded-md animatic-shimmer" />

      {/* Product Detail Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-14">
        {/* Left: Gallery Skeleton (Ultra Compact on mobile) */}
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-2.5 sm:gap-4 max-w-[270px] sm:max-w-md lg:max-w-none mx-auto lg:mx-0 w-full">
          <div className="flex lg:flex-col gap-2 shrink-0 justify-center lg:justify-start">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-16 sm:w-20 sm:h-24 rounded-lg sm:rounded-xl animatic-shimmer"
              />
            ))}
          </div>
          <div className="flex-1 w-full aspect-[3/4] max-h-[300px] sm:max-h-[460px] lg:max-h-none rounded-2xl sm:rounded-3xl animatic-shimmer" />
        </div>

        {/* Right: Info Skeleton (Compact on mobile) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-5">
          <div className="space-y-1.5">
            <div className="h-3 w-28 rounded animatic-shimmer" />
            <div className="h-7 sm:h-8 w-4/5 rounded-xl animatic-shimmer" />
            <div className="h-3.5 w-36 rounded animatic-shimmer" />
          </div>

          {/* Pricing Row */}
          <div className="h-14 sm:h-16 w-full rounded-xl sm:rounded-2xl animatic-shimmer" />

          {/* Sizes Row */}
          <div className="space-y-1.5">
            <div className="h-3 w-20 rounded animatic-shimmer" />
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-11 sm:w-12 h-8 sm:h-9 rounded-lg sm:rounded-xl animatic-shimmer" />
              ))}
            </div>
          </div>

          {/* Quantity + Buttons Row */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2 sm:gap-3">
              <div className="w-24 h-11 sm:h-12 rounded-xl animatic-shimmer shrink-0" />
              <div className="flex-1 h-11 sm:h-12 rounded-xl sm:rounded-2xl animatic-shimmer" />
            </div>
            <div className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl animatic-shimmer" />
          </div>

          {/* Guarantees Box */}
          <div className="h-20 w-full rounded-xl sm:rounded-2xl animatic-shimmer" />
        </div>
      </div>
    </div>
  );
}
