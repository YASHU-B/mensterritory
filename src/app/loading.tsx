import React from 'react';
import BrandLoader from '@/components/ui/BrandLoader';

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <BrandLoader
        size="md"
        label="MEN'S TERRITORY"
        sublabel="Loading haute streetwear & essentials..."
      />
    </div>
  );
}
