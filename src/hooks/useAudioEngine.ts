import { useState, useEffect, useRef, useCallback } from 'react';
import { Song, PlaybackStatus, AudioEngineState } from '../types';

interface UseAudioEngineProps {
  songs: Song[];
  initialIndex?: number;
}

export function useAudioEngine({ songs, initialIndex = 0 }: UseAudioEngineProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(initialIndex);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(songs[initialIndex]?.duration || 0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTrack = songs[currentTrackIndex] || songs[0];

  // Initialize single authoritative audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
        updateMediaSessionPosition(audio.currentTime, audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleWaiting = () => {
      setStatus('loading');
    };

    const handlePlaying = () => {
      setStatus('playing');
      setErrorMessage(undefined);
      updateMediaSessionPlaybackState('playing');
      updateMediaSessionPosition(audio.currentTime, audio.duration || duration);
    };

    const handlePause = () => {
      if (audio.currentTime >= (audio.duration || 0) && (audio.duration || 0) > 0) {
        setStatus('ended');
        updateMediaSessionPlaybackState('none');
      } else {
        setStatus('paused');
        updateMediaSessionPlaybackState('paused');
      }
      updateMediaSessionPosition(audio.currentTime, audio.duration || duration);
    };

    const handleEnded = () => {
      setStatus('ended');
      updateMediaSessionPlaybackState('none');
      // Advance to next song automatically
      setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
    };

    const handleError = () => {
      setStatus('error');
      setErrorMessage('Audio format unsupported or track unavailable');
      updateMediaSessionPlaybackState('none');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [songs.length]);

  // Handle track source change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }

    const wasPlaying = status === 'playing';
    audio.src = currentTrack.audioSrc;
    audio.load();
    setCurrentTime(0);
    setDuration(currentTrack.duration || 0);

    // Synchronize Media Session Metadata
    updateMediaSessionMetadata(currentTrack);
    updateMediaSessionPosition(0, currentTrack.duration || 0);

    if (wasPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback resume prevented:', err);
          setStatus('paused');
          updateMediaSessionPlaybackState('paused');
        });
      }
    } else if (status !== 'idle') {
      setStatus('paused');
      updateMediaSessionPlaybackState('paused');
    }
  }, [currentTrackIndex, currentTrack.audioSrc, currentTrack.duration]);

  // Volume & mute sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setStatus('loading');
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setStatus('playing');
          setErrorMessage(undefined);
          updateMediaSessionPlaybackState('playing');
          updateMediaSessionPosition(audio.currentTime, audio.duration || duration);
        })
        .catch((err) => {
          console.warn('Playback start error:', err);
          setStatus('paused');
          updateMediaSessionPlaybackState('paused');
          setErrorMessage('Playback requires user interaction or audio is blocked');
        });
    }
  }, [duration]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setStatus('paused');
    updateMediaSessionPlaybackState('paused');
    updateMediaSessionPosition(audio.currentTime, audio.duration || duration);
  }, [duration]);

  const togglePlay = useCallback(() => {
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  const seek = useCallback((timeInSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(timeInSeconds, duration || 0));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
    updateMediaSessionPosition(clamped, duration || 0);
  }, [duration]);

  const seekRelative = useCallback((deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, Math.min(audio.currentTime + deltaSeconds, duration || 0));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    updateMediaSessionPosition(newTime, duration || 0);
  }, [duration]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
  }, [songs.length]);

  const prevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      seek(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
  }, [seek, songs.length]);

  const selectTrack = useCallback((index: number, autoPlay: boolean = true) => {
    if (index >= 0 && index < songs.length) {
      setCurrentTrackIndex(index);
      if (autoPlay) {
        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
        }
        playTimeoutRef.current = setTimeout(() => {
          audioRef.current?.play().catch(() => {
            setStatus('paused');
            updateMediaSessionPlaybackState('paused');
          });
        }, 50);
      }
    }
  }, [songs.length]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(newVolume, 1));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Expose authoritative Media Session Action Handlers
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    const ms = navigator.mediaSession;

    const actionMap: [MediaSessionAction, MediaSessionActionHandler | null][] = [
      ['play', () => play()],
      ['pause', () => pause()],
      ['previoustrack', () => prevTrack()],
      ['nexttrack', () => nextTrack()],
      [
        'seekbackward',
        (details) => {
          seekRelative(-(details.seekOffset || 10));
        },
      ],
      [
        'seekforward',
        (details) => {
          seekRelative(details.seekOffset || 10);
        },
      ],
      [
        'seekto',
        (details) => {
          if (typeof details.seekTime === 'number') {
            seek(details.seekTime);
          }
        },
      ],
      ['stop', () => pause()],
    ];

    actionMap.forEach(([action, handler]) => {
      try {
        ms.setActionHandler(action, handler);
      } catch (err) {
        // Some browsers may not support specific actions like seekto
      }
    });

    return () => {
      actionMap.forEach(([action]) => {
        try {
          ms.setActionHandler(action, null);
        } catch (err) {
          // ignore cleanup errors
        }
      });
    };
  }, [play, pause, prevTrack, nextTrack, seekRelative, seek]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(volume - 0.05);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (['1', '2', '3'].includes(e.key)) {
        const targetIndex = parseInt(e.key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < songs.length) {
          selectTrack(targetIndex, true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, handleVolumeChange, volume, toggleMute, songs.length, selectTrack]);

  const progress = duration > 0 ? currentTime / duration : 0;

  const state: AudioEngineState = {
    currentTrack,
    currentTrackIndex,
    status,
    isPlaying: status === 'playing',
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    errorMessage,
  };

  return {
    state,
    play,
    pause,
    togglePlay,
    seek,
    seekRelative,
    nextTrack,
    prevTrack,
    selectTrack,
    setVolume: handleVolumeChange,
    toggleMute,
  };
}

// Media Session Helper Utilities
function updateMediaSessionMetadata(song: Song) {
  if (typeof window === 'undefined' || !('mediaSession' in navigator) || !window.MediaMetadata) {
    return;
  }

  try {
    const origin = window.location.origin;
    const fullArtworkUrl = song.artworkSrc.startsWith('http')
      ? song.artworkSrc
      : `${origin}${song.artworkSrc}`;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: 'Boulevard',
      artwork: [
        { src: fullArtworkUrl, sizes: '96x96', type: 'image/webp' },
        { src: fullArtworkUrl, sizes: '128x128', type: 'image/webp' },
        { src: fullArtworkUrl, sizes: '192x192', type: 'image/webp' },
        { src: fullArtworkUrl, sizes: '256x256', type: 'image/webp' },
        { src: fullArtworkUrl, sizes: '384x384', type: 'image/webp' },
        { src: fullArtworkUrl, sizes: '512x512', type: 'image/webp' },
      ],
    });
  } catch (err) {
    console.warn('Failed to update MediaSession metadata:', err);
  }
}

function updateMediaSessionPlaybackState(state: 'playing' | 'paused' | 'none') {
  if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
    return;
  }

  try {
    navigator.mediaSession.playbackState = state;
  } catch (err) {
    // Ignore unsupported browser quirks
  }
}

function updateMediaSessionPosition(position: number, duration: number) {
  if (
    typeof window === 'undefined' ||
    !('mediaSession' in navigator) ||
    !('setPositionState' in navigator.mediaSession)
  ) {
    return;
  }

  if (isNaN(duration) || duration <= 0 || isNaN(position)) {
    return;
  }

  try {
    navigator.mediaSession.setPositionState({
      duration: Math.max(0, duration),
      playbackRate: 1,
      position: Math.min(Math.max(0, position), duration),
    });
  } catch (err) {
    // Silently ignore transient positionState errors during seeking
  }
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
