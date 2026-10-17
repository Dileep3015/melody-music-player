import type { Track } from '../types'
import { renderWav } from './synth'
/** Saves the track as a real audio file (.wav for built-in tracks, original format for uploads). */
export async function downloadTrack(tr: Track) {
  const blob = tr.kind === 'synth' ? await renderWav(tr) : tr.blob!
  const name = (tr.title.replace(/[^\w\- ]+/g, '').trim() || 'track') + '.' + (tr.kind === 'synth' ? 'wav' : tr.ext)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 4000)
}
