import type { Track } from '../types'
import { rng } from './synth'
export function art(c: string, s: number): string {
  const r = rng(s * 7 + 1); let o = ''
  for (let i = 0; i < 5; i++) o += `<circle cx="${(r() * 200) | 0}" cy="${(r() * 200) | 0}" r="${(30 + r() * 60) | 0}" fill="#fff" fill-opacity="${(0.08 + r() * 0.18).toFixed(2)}"/>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#1c1530"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>${o}</svg>`)
}
type Row = [string, string, string, string, number, number, number[], OscillatorType, string, number]
const rows: Row[] = [
  ['Night Bus Home', 'Ravi Kanth', 'After Hours', 'Chill', 84, 57, [0, 3, 5, 7, 10], 'triangle', '#7a6cf0', 11],
  ['Monsoon Window', 'Aarti Rao', 'After Hours', 'Chill', 72, 53, [0, 2, 4, 7, 9], 'sine', '#3fb6c9', 23],
  ['Neon Chai Stall', 'Kiran & Co', 'City Lights', 'Dance', 118, 60, [0, 2, 3, 7, 8], 'sawtooth', '#f26b8f', 37],
  ['Rooftop Sprint', 'Sana Mir', 'City Lights', 'Dance', 126, 55, [0, 3, 5, 6, 7, 10], 'square', '#f2a65a', 41],
  ['Slow Lantern', 'Dev Anand Jr.', 'Quiet Hours', 'Focus', 66, 52, [0, 2, 4, 5, 7, 9, 11], 'sine', '#6fcf97', 53],
  ['Paper Boats', 'Meera Pillai', 'Quiet Hours', 'Focus', 76, 50, [0, 2, 4, 7, 9], 'triangle', '#e0c36a', 67],
]
export const BUILTIN: Track[] = rows.map((a, i) => ({
  id: 'b' + i, kind: 'synth', title: a[0], artist: a[1], album: a[2], genre: a[3],
  bpm: a[4], root: a[5], sc: a[6], wave: a[7], seed: a[9], cover: art(a[8], a[9]),
}))
