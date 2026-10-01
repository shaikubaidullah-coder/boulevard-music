export interface Song {
  id: string;
  index: string;
  title: string;
  artist: string;
  subtitle?: string;
  audioSrc: string;
  artworkSrc: string;
  duration: number;
  formattedDuration: string;
  quote: string;
  atmosphereColor: string;
  accentColor: string;
  note: string;
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface AudioEngineState {
  currentTrack: Song;
  currentTrackIndex: number;
  status: PlaybackStatus;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  isMuted: boolean;
  errorMessage?: string;
}
