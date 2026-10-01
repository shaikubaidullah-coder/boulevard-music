import React from 'react';
import { Song } from '../types';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SongListProps {
  songs: Song[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  onTogglePlay: () => void;
}

export const SongList: React.FC<SongListProps> = React.memo(({
  songs,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
}) => {
  return (
    <section className="w-full bg-[#eae8e1]/50 border-t border-b border-black/[0.08] px-4 py-12 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-3 border-b border-black/[0.08]">
          <div>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-ink-tertiary">
              Full Tracklist
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-ink font-normal tracking-tight mt-0.5">
              My Songs
            </h2>
          </div>
          <span className="font-mono text-xs text-ink-tertiary mt-1 sm:mt-0">
            03 songs · 12 minutes
          </span>
        </div>

        {/* Editorial Track List */}
        <div className="space-y-4">
          {songs.map((song, index) => {
            const isCurrent = currentTrackIndex === index;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <motion.div
                key={song.id}
                layout
                onClick={() => {
                  if (isCurrent) {
                    onTogglePlay();
                  } else {
                    onSelectTrack(index);
                  }
                }}
                className={`group p-4 sm:p-6 rounded-lg cursor-pointer transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-paper shadow-sm border-black/15'
                    : 'bg-transparent border-transparent hover:border-black/10 hover:bg-black/[0.02]'
                }`}
              >
                {/* Mobile Track Layout (Dedicated Vertical Rhythm) */}
                <div className="flex flex-col md:hidden space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs ${isCurrent ? 'text-ink font-bold' : 'text-ink-tertiary'}`}>
                      0{index + 1}
                    </span>
                    {isCurrentPlaying && (
                      <span className="flex items-center space-x-1 text-emerald-700 text-[11px] font-mono">
                        <Volume2 className="h-3 w-3 animate-pulse" />
                        <span>Playing</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-normal tracking-normal text-ink leading-snug">
                      {song.title}
                    </h3>
                    <p className="font-sans text-xs text-ink-secondary mt-0.5">
                      {song.artist}
                      {song.subtitle && <span className="text-ink-tertiary"> — {song.subtitle}</span>}
                    </p>
                  </div>

                  <p className="font-sans text-xs text-ink-tertiary leading-relaxed pt-0.5 line-clamp-2">
                    {song.note}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-black/[0.06]">
                    <span className="font-mono text-xs text-ink-tertiary">
                      {song.formattedDuration}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          onTogglePlay();
                        } else {
                          onSelectTrack(index);
                        }
                      }}
                      className={`flex items-center justify-center min-h-[44px] min-w-[44px] w-10 h-10 rounded-full transition-all cursor-pointer ${
                        isCurrentPlaying
                          ? 'bg-ink text-paper shadow-sm'
                          : 'border border-black/15 text-ink hover:bg-black/10'
                      }`}
                      aria-label={isCurrentPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                    >
                      {isCurrentPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Desktop Track Layout (Horizontal Editorial Row) */}
                <div className="hidden md:flex items-center justify-between">
                  <div className="flex items-start space-x-6 min-w-0">
                    <span className={`font-mono text-base pt-1 ${isCurrent ? 'text-ink font-bold' : 'text-ink-tertiary'}`}>
                      0{index + 1}
                    </span>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-display text-2xl lg:text-3xl font-normal tracking-normal text-ink">
                          {song.title}
                        </h3>
                        {isCurrentPlaying && (
                          <span className="flex items-center space-x-1 text-emerald-700 text-xs font-mono">
                            <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                            <span>Playing</span>
                          </span>
                        )}
                      </div>

                      <p className="font-sans text-sm text-ink-secondary">
                        {song.artist}
                        {song.subtitle && <span className="text-ink-tertiary"> — {song.subtitle}</span>}
                      </p>

                      <p className="font-sans text-xs text-ink-tertiary pt-1 line-clamp-1 max-w-xl">
                        {song.note}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 shrink-0">
                    <span className="font-mono text-sm text-ink-tertiary">
                      {song.formattedDuration}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          onTogglePlay();
                        } else {
                          onSelectTrack(index);
                        }
                      }}
                      className={`flex items-center justify-center w-11 h-11 rounded-full transition-all cursor-pointer ${
                        isCurrentPlaying
                          ? 'bg-ink text-paper shadow-md scale-105'
                          : 'border border-black/15 text-ink hover:bg-black/10 hover:border-black/30'
                      }`}
                      aria-label={isCurrentPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                    >
                      {isCurrentPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default SongList;
