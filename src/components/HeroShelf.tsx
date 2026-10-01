import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { RecordDisc } from './RecordDisc';
import { Play, Pause, ArrowLeft, ArrowRight, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroShelfProps {
  songs: Song[];
  currentTrack: Song;
  currentTrackIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const HeroShelf: React.FC<HeroShelfProps> = React.memo(({
  songs,
  currentTrack,
  currentTrackIndex,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  onNext,
  onPrev,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLightboxOpen]);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const prevSong = songs[(currentTrackIndex - 1 + songs.length) % songs.length];
  const nextSong = songs[(currentTrackIndex + 1) % songs.length];

  return (
    <section className="relative w-full overflow-hidden px-4 pt-4 pb-12 sm:px-8 sm:pt-8 md:pb-20 lg:px-12">
      {/* Subtle Ambient Atmosphere Diffusion derived from active song */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-[380px] sm:h-[480px] w-[92vw] max-w-[1000px] rounded-full blur-[100px] sm:blur-[140px] opacity-70 transition-colors duration-1000 ease-in-out -z-10"
        style={{ backgroundColor: 'var(--atmosphere-tint)' }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Editorial Sub-header / Horizon Navigation */}
        <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 mb-6 sm:mb-8 text-xs font-mono tracking-wider text-ink-tertiary">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-ink font-semibold">{currentTrack.index}</span>
            <span>/</span>
            <span>0{songs.length}</span>
            <span className="text-black/20">|</span>
            <span className="text-ink-secondary">{currentTrack.formattedDuration}</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onPrev}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] px-2 text-ink-secondary hover:text-ink active:scale-90 transition-all cursor-pointer"
              title={`Previous: ${prevSong.title}`}
              aria-label={`Previous: ${prevSong.title}`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline ml-1 font-sans text-xs">Previous</span>
            </button>
            <button
              onClick={onNext}
              className="flex items-center justify-center min-h-[44px] min-w-[44px] px-2 text-ink-secondary hover:text-ink active:scale-90 transition-all cursor-pointer"
              title={`Next: ${nextSong.title}`}
              aria-label={`Next: ${nextSong.title}`}
            >
              <span className="hidden md:inline mr-1 font-sans text-xs">Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE HERO (Vertical, intentional, pocket-sized rhythm) */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:hidden space-y-6">
          {/* 1. Track Meta & Title */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-ink-tertiary mb-1.5">
              <span>Track {currentTrack.index}</span>
              {currentTrack.subtitle && (
                <>
                  <span className="text-black/20">·</span>
                  <span className="font-sans text-xs text-ink-secondary">{currentTrack.subtitle}</span>
                </>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={currentTrack.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="font-display text-3xl sm:text-4xl text-ink font-normal leading-[1.08] tracking-normal break-words"
              >
                {currentTrack.title}
              </motion.h1>
            </AnimatePresence>

            <p className="font-sans text-base text-ink-secondary font-medium mt-1">
              {currentTrack.artist}
            </p>
          </div>

          {/* 2. Artwork & Subtle Vinyl Interaction (Centered, bounded) */}
          <div className="py-2 flex justify-center">
            <div className="relative group w-full max-w-[270px] sm:max-w-[320px] pr-8 sm:pr-10">
              {/* Vinyl Disc emerging from sleeve */}
              <div
                className={`absolute top-0 right-0 h-full aspect-square pointer-events-auto transition-transform duration-700 ease-out z-0 ${
                  isPlaying ? 'translate-x-8 sm:translate-x-10 rotate-12' : 'translate-x-3 sm:translate-x-4'
                }`}
              >
                <RecordDisc
                  song={currentTrack}
                  isPlaying={isPlaying}
                  size="sm"
                  onClick={onTogglePlay}
                  className="!w-full !h-full transform-gpu"
                />
              </div>

              {/* Album Sleeve Foreground */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative z-10 aspect-square w-[86%] bg-paper-subtle rounded-sm shadow-[0_16px_36px_-10px_rgba(0,0,0,0.22)] overflow-hidden cursor-zoom-in border border-black/[0.08] active:scale-[0.98] transition-transform duration-300"
              >
                <img
                  src={currentTrack.artworkSrc}
                  alt={`${currentTrack.title} artwork`}
                  width={280}
                  height={280}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white/90 font-mono text-[9px]">
                  SIDE {currentTrack.index}
                </div>
                <div className="absolute top-2.5 right-2.5 rounded-full bg-black/40 backdrop-blur-md p-1.5 text-paper">
                  <Maximize2 className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Primary Play & View Artwork Action (Touch-friendly, min 48px height) */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onTogglePlay}
              className="flex-1 flex items-center justify-center space-x-2.5 min-h-[48px] px-5 py-3 rounded-full bg-ink text-paper hover:bg-black active:scale-[0.97] transition-all shadow cursor-pointer"
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current translate-x-0.5" />
                )}
              </span>
              <span className="font-sans text-sm font-medium tracking-wide">
                {isPlaying ? 'Pause Record' : 'Listen Now'}
              </span>
            </button>

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="flex items-center justify-center space-x-1.5 min-h-[48px] px-4 py-3 rounded-full border border-black/15 text-ink active:scale-[0.97] transition-all text-xs font-sans cursor-pointer hover:bg-black/5"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Artwork</span>
            </button>
          </div>

          {/* 4. Poetic Quote & Personal Note */}
          <div className="space-y-3 pt-2">
            <div className="border-l-2 border-ink/20 pl-3.5 py-0.5">
              <p className="font-display text-lg text-ink italic leading-relaxed">
                {currentTrack.quote}
              </p>
            </div>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {currentTrack.note}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP HERO (Asymmetric, Expansive Art-Directed Stage)   */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Tactile Artwork & Vinyl Physical Media Display */}
          <div className="lg:col-span-6 flex justify-start">
            <div className="relative group w-full max-w-[400px] mr-14">
              {/* Vinyl Disc emerging from sleeve */}
              <div
                className={`absolute top-0 right-0 -right-10 h-full aspect-square pointer-events-auto transition-transform duration-700 ease-out z-0 ${
                  isPlaying ? 'translate-x-16 rotate-12' : 'translate-x-6 group-hover:translate-x-10'
                }`}
              >
                <RecordDisc
                  song={currentTrack}
                  isPlaying={isPlaying}
                  size="md"
                  onClick={onTogglePlay}
                  className="!w-full !h-full transform-gpu"
                />
              </div>

              {/* Album Jacket / Sleeve Foreground */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative z-10 aspect-square w-[88%] bg-paper-subtle rounded-sm shadow-[0_20px_45px_-12px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden cursor-zoom-in border border-black/[0.08] transition-transform duration-500 group-hover:-translate-y-1"
              >
                <motion.img
                  key={currentTrack.id}
                  src={currentTrack.artworkSrc}
                  alt={`${currentTrack.title} artwork`}
                  width={400}
                  height={400}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />

                <div className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-md p-2 text-paper opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="h-3.5 w-3.5" />
                </div>

                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-white/90 font-mono text-[10px]">
                  SIDE {currentTrack.index}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Typography, Story, and Primary Play Action */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-xs text-ink-tertiary">Track {currentTrack.index}</span>
                {currentTrack.subtitle && (
                  <>
                    <span className="text-black/20">·</span>
                    <span className="font-sans text-xs tracking-wide text-ink-secondary">
                      {currentTrack.subtitle}
                    </span>
                  </>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentTrack.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="font-display text-5xl lg:text-6xl text-ink font-normal leading-[1.05] tracking-normal break-words"
                >
                  {currentTrack.title}
                </motion.h1>
              </AnimatePresence>

              <motion.p
                key={`artist-${currentTrack.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="font-sans text-xl text-ink-secondary mt-2 font-medium"
              >
                {currentTrack.artist}
              </motion.p>
            </div>

            <div className="border-l-2 border-ink/20 pl-4 py-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`quote-${currentTrack.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="font-display text-xl text-ink italic leading-relaxed"
                >
                  {currentTrack.quote}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="font-sans text-base text-ink-secondary leading-relaxed">
              {currentTrack.note}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onTogglePlay}
                className="flex items-center space-x-3 px-6 py-3.5 rounded-full bg-ink text-paper hover:bg-black active:scale-95 transition-all shadow-md group cursor-pointer"
                aria-label={isPlaying ? 'Pause song' : 'Play song'}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-current translate-x-0.5" />
                  )}
                </span>
                <span className="font-sans text-sm font-medium tracking-wide">
                  {isPlaying ? 'Pause Record' : 'Listen Now'}
                </span>
              </button>

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="flex items-center space-x-2 px-4 py-3.5 rounded-full border border-black/15 text-ink hover:bg-black/5 active:scale-95 transition-all text-xs font-sans cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>View Artwork</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* The Physical Record Shelf Deck ("On Rotation")            */}
        {/* ========================================================= */}
        <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-black/[0.08]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-ink-tertiary">On Rotation</p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink">The Shelf</h2>
            </div>
            <p className="text-xs font-sans text-ink-secondary hidden sm:block">
              Select a record to cue playback
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {songs.map((song, index) => {
              const isActive = index === currentTrackIndex;
              const isCurrentPlaying = isActive && isPlaying;

              return (
                <div
                  key={song.id}
                  onClick={() => {
                    if (isActive) {
                      onTogglePlay();
                    } else {
                      onSelectTrack(index);
                    }
                  }}
                  className={`group relative p-3.5 sm:p-4 rounded-lg cursor-pointer transition-all duration-300 border min-h-[58px] ${
                    isActive
                      ? 'bg-paper-subtle/80 border-black/20 shadow-sm translate-y-[-1px]'
                      : 'bg-transparent border-transparent hover:border-black/10 hover:bg-black/[0.02]'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 sm:space-x-4">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                      <img
                        src={song.artworkSrc}
                        alt=""
                        width={64}
                        height={64}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isCurrentPlaying ? (
                          <div className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center">
                            <Pause className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className={`w-7 h-7 rounded-full ${isActive ? 'bg-ink text-paper' : 'bg-black/60 text-white'} opacity-90 group-hover:opacity-100 flex items-center justify-center transition-all group-hover:scale-105`}>
                            <Play className="h-3 w-3 translate-x-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-ink-tertiary">0{index + 1}</span>
                        {isActive && (
                          <span className="px-1.5 py-0.5 rounded-full bg-ink/10 font-mono text-[9px] text-ink font-semibold uppercase">
                            {isCurrentPlaying ? 'Playing' : 'Cued'}
                          </span>
                        )}
                      </div>
                      <p className="font-display text-base sm:text-lg text-ink truncate leading-snug mt-0.5">
                        {song.title}
                      </p>
                      <p className="font-sans text-xs text-ink-secondary truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Artwork Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 min-h-[44px] min-w-[44px] p-2 text-white/90 hover:text-white rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all z-10 flex items-center justify-center cursor-pointer"
              aria-label="Close artwork"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-xl w-full max-h-[85vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={currentTrack.artworkSrc}
                alt={currentTrack.title}
                decoding="async"
                className="max-h-[65vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded shadow-2xl"
              />

              <div className="mt-4 text-center text-white px-4">
                <p className="font-display text-xl sm:text-2xl font-normal leading-snug">{currentTrack.title}</p>
                <p className="font-sans text-xs sm:text-sm text-white/70 mt-1">{currentTrack.artist}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default HeroShelf;
