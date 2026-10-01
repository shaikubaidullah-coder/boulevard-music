import React from 'react';
import { AudioEngineState } from '../types';
import { formatTime } from '../hooks/useAudioEngine';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface PlayerBarProps {
  engineState: AudioEngineState;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  engineState,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) => {
  const { currentTrack, isPlaying, currentTime, duration, progress, volume, isMuted } = engineState;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  const handleBarSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * (duration || 1));
  };

  return (
    <aside
      aria-label="Music Player"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-black/10 bg-[#f5f4ef]/95 backdrop-blur-md shadow-[0_-6px_25px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom)+0.25rem)]"
    >
      {/* Mobile Top Progress Indicator (Tap to seek on phone) */}
      <div
        onClick={handleBarSeek}
        className="block sm:hidden w-full h-[3px] bg-black/10 cursor-pointer relative"
        title="Tap to seek"
      >
        <div
          className="h-full bg-ink transition-[width] duration-150"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-8 sm:py-3">
        {/* Left: Active Song Artwork & Metadata */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 sm:flex-initial sm:max-w-[260px]">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded overflow-hidden shadow-sm border border-black/10">
            <img
              src={currentTrack.artworkSrc}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 pr-2">
            <p className="font-display text-base sm:text-lg text-ink truncate leading-tight">
              {currentTrack.title}
            </p>
            <p className="font-sans text-[11px] sm:text-xs text-ink-secondary truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Center (Desktop): Playback Controls & Progress Scrubber */}
        <div className="hidden sm:flex flex-col items-center flex-1 mx-4 max-w-xl">
          <div className="flex items-center space-x-4 mb-1">
            <button
              onClick={onPrev}
              className="p-2 text-ink-secondary hover:text-ink active:scale-90 transition-all rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-ink text-paper hover:bg-black active:scale-95 transition-all shadow-md cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-2 text-ink-secondary hover:text-ink active:scale-90 transition-all rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Next track"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center w-full space-x-2.5">
            <span className="text-[11px] font-mono text-ink-tertiary w-9 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSliderChange}
              className="paper-scrubber flex-1 h-1.5 rounded-full"
              aria-label="Audio scrubber"
            />

            <span className="text-[11px] font-mono text-ink-tertiary w-9 text-left tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Mobile Right Controls: Prev, Play/Pause, Next with min 44x44px touch targets */}
        <div className="flex sm:hidden items-center space-x-1 shrink-0">
          <button
            onClick={onPrev}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2 text-ink-secondary hover:text-ink active:scale-90 transition-all cursor-pointer"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] w-10 h-10 rounded-full bg-ink text-paper hover:bg-black active:scale-95 transition-all shadow cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="flex items-center justify-center min-h-[44px] min-w-[44px] p-2 text-ink-secondary hover:text-ink active:scale-90 transition-all cursor-pointer"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop Right Controls: Volume & Mute */}
        <div className="hidden sm:flex items-center space-x-2 min-w-0">
          <button
            onClick={onToggleMute}
            className="p-2 text-ink-secondary hover:text-ink active:scale-90 transition-all rounded-full hover:bg-black/5 cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-ink-secondary" />
            ) : (
              <Volume2 className="h-4 w-4 text-ink" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="paper-scrubber w-16 sm:w-20 h-1.5 hidden md:block"
            aria-label="Volume slider"
          />
        </div>
      </div>
    </aside>
  );
};

export default PlayerBar;
