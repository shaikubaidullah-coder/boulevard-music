import React from 'react';

interface NavbarProps {
  isPlaying: boolean;
  currentTrackIndex: number;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ isPlaying, currentTrackIndex }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-[#f5f4ef]/90 backdrop-blur-md transition-colors duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        {/* Left: Simple Title */}
        <div className="flex items-baseline space-x-2.5 sm:space-x-3">
          <span className="font-display text-xl sm:text-2xl font-normal tracking-tight text-ink">
            Boulevard
          </span>
          <span className="text-[11px] sm:text-xs font-sans tracking-wide text-ink-secondary">
            Personal Collection
          </span>
        </div>

        {/* Center: Subtle Status */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-sans text-ink-secondary">
          {isPlaying ? (
            <span className="flex items-center space-x-2 text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Playing Track 0{currentTrackIndex + 1}</span>
            </span>
          ) : (
            <span>3 songs · 12 minutes</span>
          )}
        </div>

        {/* Right: Human Track Counter */}
        <div className="flex items-center space-x-4">
          <span className="font-mono text-xs text-ink-tertiary">
            0{currentTrackIndex + 1} / 03
          </span>
        </div>
      </div>
    </header>
  );
});

export default Navbar;
