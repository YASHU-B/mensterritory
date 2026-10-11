import React from 'react';

export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Shop Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded animatic-shimmer" />
          <div className="h-10 w-64 rounded-xl animatic-shimmer" />
        </div>
        <div className="h-10 w-44 rounded-xl animatic-shimmer" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden p-3 sm:p-4 space-y-3.5 shadow-xs"
          >
            <div className="aspect-[3/4] w-full rounded-xl animatic-shimmer" />
            <div className="space-y-2">
              <div className="h-3 rounded animatic-shimmer w-1/3" />
              <div className="h-4 rounded-md animatic-shimmer w-4/5" />
              <div className="h-4 rounded animatic-shimmer w-1/4" />
            </div>
            <div className="h-9 rounded-xl animatic-shimmer w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
