import React, { useEffect } from 'react';
import { SONGS_ARCHIVE } from './data/songs';
import { useAudioEngine } from './hooks/useAudioEngine';
import { Navbar } from './components/Navbar';
import { HeroShelf } from './components/HeroShelf';
import { SongList } from './components/SongList';
import { PlayerBar } from './components/PlayerBar';
import { extractAtmosphereColor } from './utils/colorExtractor';

export const App: React.FC = () => {
  const {
    state: engineState,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    selectTrack,
    setVolume,
    toggleMute,
  } = useAudioEngine({
    songs: SONGS_ARCHIVE,
    initialIndex: 0,
  });

  const { currentTrack, currentTrackIndex, isPlaying } = engineState;

  // Sync atmosphere color to root dynamically using cached sampler without React re-render
  useEffect(() => {
    let isCancelled = false;

    extractAtmosphereColor(currentTrack.artworkSrc, currentTrack.atmosphereColor).then((color) => {
      if (!isCancelled) {
        document.documentElement.style.setProperty('--atmosphere-tint', color);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [currentTrack]);

  // Update document title dynamically based on playback
  useEffect(() => {
    if (isPlaying) {
      document.title = `▶ ${currentTrack.title} — ${currentTrack.artist}`;
    } else {
      document.title = 'Boulevard — Personal Record Collection';
    }
  }, [isPlaying, currentTrack]);

  return (
    <div
      className="relative min-h-[100dvh] bg-[#f5f4ef] text-[#141518] antialiased selection:bg-black/10 selection:text-black pb-36 sm:pb-32 paper-grain transition-colors duration-1000 ease-out"
      style={{
        backgroundColor: '#f5f4ef',
      }}
    >
      {/* Top Minimal Navigation (Memoized, independent of audio ticks) */}
      <Navbar
        isPlaying={isPlaying}
        currentTrackIndex={currentTrackIndex}
      />

      {/* Main Experience */}
      <main>
        {/* Physical Record Shelf Hero (Memoized, independent of audio ticks) */}
        <HeroShelf
          songs={SONGS_ARCHIVE}
          currentTrack={currentTrack}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onSelectTrack={selectTrack}
          onNext={nextTrack}
          onPrev={prevTrack}
        />

        {/* Editorial Song Index (Memoized, independent of audio ticks) */}
        <SongList
          songs={SONGS_ARCHIVE}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          onSelectTrack={selectTrack}
          onTogglePlay={togglePlay}
        />

        {/* Quiet Personal Ending */}
        <footer className="w-full border-t border-black/[0.08] px-6 py-16 sm:px-8 lg:px-12 text-center text-xs font-sans text-ink-secondary">
          <div className="mx-auto max-w-md space-y-2">
            <p className="font-display text-2xl text-ink font-normal tracking-tight">
              Boulevard
            </p>
            <p className="text-ink-secondary">
              A private collection of songs I keep coming back to.
            </p>
            <p className="font-mono text-[11px] text-ink-tertiary pt-2">
              03 records · 12 minutes
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Bottom Player (Handles live scrubber & live timecode) */}
      <PlayerBar
        engineState={engineState}
        onTogglePlay={togglePlay}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
      />
    </div>
  );
};

export default App;
