'use client';

import React from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ArrowUpRight } from 'lucide-react';
import InstagramIcon from '@/components/ui/InstagramIcon';

export default function InstagramSection() {
  const { settings } = useStore();
  const handle = settings.instagram_handle || '@mens_territory_mt';
  const cleanHandle = handle.replace('@', '');

  const instagramPosts = [
    {
      id: 'ig1',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      caption: 'Matte black drops & heavy twill draping.',
    },
    {
      id: 'ig2',
      image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
      caption: 'Wide-leg baggy pants engineered for urban presence.',
    },
    {
      id: 'ig3',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
      caption: '240 GSM drop shoulder signature tee.',
    },
    {
      id: 'ig4',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      caption: 'Giza cotton formals built for boardroom authority.',
    },
    {
      id: 'ig5',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
      caption: '13.5 oz sun-faded vintage denim.',
    },
    {
      id: 'ig6',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
      caption: 'Layering essentials & structured canvas jackets.',
    },
  ];

  return (
    <section className="py-20 border-t border-zinc-200 bg-zinc-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-zinc-600 text-xs uppercase font-bold tracking-widest mb-1">
              <InstagramIcon className="w-4 h-4 text-pink-600" />
              <span>Follow Our Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 tracking-tight">
              {handle}
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              Join the Men&apos;s Territory community on Instagram for daily drop announcements & outfit inspiration.
            </p>
          </div>

          <a
            href={`https://instagram.com/${cleanHandle}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm group"
          >
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>Follow on Instagram</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={`https://instagram.com/${cleanHandle}`}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-zinc-200 block shadow-xs"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 backdrop-blur-[2px]">
                <InstagramIcon className="w-5 h-5 text-white mb-2" />
                <p className="text-[10px] text-white font-medium line-clamp-2 leading-tight">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
