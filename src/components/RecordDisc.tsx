import React from 'react';
import { Song } from '../types';

interface RecordDiscProps {
  song: Song;
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const RecordDisc: React.FC<RecordDiscProps> = ({
  song,
  isPlaying,
  size = 'lg',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-36 h-36 sm:w-44 sm:h-44',
    md: 'w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72',
    lg: 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[440px] lg:h-[440px]',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer select-none group flex-shrink-0 transition-transform duration-500 ${sizeClasses} ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* Outer Record Body */}
      <div
        className={`relative h-full w-full rounded-full record-disc-rim overflow-hidden transition-all duration-700 ${
          isPlaying ? 'animate-spin-slow' : 'group-hover:scale-[1.02]'
        }`}
        style={{
          transformOrigin: 'center center',
          backgroundColor: '#111215',
        }}
      >
        {/* Artwork Layer on the Disc */}
        <img
          src={song.artworkSrc}
          alt={song.title}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
        />

        {/* Concentric Analog Vinyl Grooves & Reflection */}
        <div className="absolute inset-0 rounded-full vinyl-grooves opacity-60 mix-blend-overlay pointer-events-none" />

        {/* Outer Vinyl Edge Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-black/40 pointer-events-none" />
        <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none" />

        {/* Inner Record Spindle Hub (A24 / Real Vinyl Style) */}
        <div className="absolute inset-[34%] rounded-full border border-black/50 bg-[#e4e2da] shadow-inner flex flex-col items-center justify-center p-2 text-center pointer-events-none">
          {/* Circular runout groove line */}
          <div className="absolute inset-1.5 rounded-full border border-black/15" />

          {/* Minimal Label Text */}
          <span className="font-mono text-[7px] sm:text-[8px] font-bold tracking-widest text-black/70 uppercase">
            {song.index}
          </span>
          <span className="line-clamp-1 max-w-[85%] font-display text-[9px] sm:text-[11px] font-bold text-black/90 leading-tight">
            {song.title}
          </span>

          {/* Polycarbonate Clear Center Ring & Spindle Hole */}
          <div className="mt-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-black/30 bg-black/80 record-hub">
            <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>

        {/* Realistic Light Glare Sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-75" />
      </div>
    </div>
  );
};
