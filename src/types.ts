export interface Track {
  id: string; title: string; artist: string; album: string; genre: string; cover: string
  kind: 'synth' | 'file'
  // synth tracks
  bpm?: number; root?: number; sc?: number[]; wave?: OscillatorType; seed?: number
  // uploaded tracks
  url?: string; blob?: Blob; ext?: string
}
export type Playlists = Record<string, string[]>
export type View = 'songs' | 'albums' | 'playlists' | 'upload'
export interface Handlers {
  onPlay: (id: string, queue: string[]) => void
  onAdd: (id: string) => void
  onDownload: (id: string) => void
  onRemove?: (id: string) => void
  onDelete?: (id: string) => void
}
