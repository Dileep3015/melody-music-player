import type { Track } from '../types'
export const LEN = 60
export function rng(s: number) {
  return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
function note(c: BaseAudioContext, d: AudioNode, m: number, when: number, dur: number, type: OscillatorType, vol: number) {
  const o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.value = hz(m)
  g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
  o.connect(g); g.connect(d); o.start(when); o.stop(when + dur + 0.05)
}
export const mkpat = (tr: Track): (number | null)[] => {
  const r = rng(tr.seed!), n = tr.sc!.length
  return Array.from({ length: 16 }, (_, k) => (k % 4 === 0 || r() > 0.45 ? Math.floor(r() * n * 1.6) : null))
}
export function stepNotes(c: BaseAudioContext, d: AudioNode, tr: Track, p: (number | null)[], k: number, when: number) {
  const sc = tr.sc!, root = tr.root!, sd = 60 / tr.bpm! / 2, v = p[k % 16]
  if (v !== null) note(c, d, root + 12 + sc[v % sc.length] + (v >= sc.length ? 12 : 0), when, sd * 1.8, tr.wave!, 0.14)
  if (k % 4 === 0) note(c, d, root - 12 + (k % 16 === 8 ? sc[2] : 0), when, sd * 3.5, 'sine', 0.3)
  if (k % 16 === 0) [0, 2, 4].forEach(i => note(c, d, root + sc[i % sc.length], when, sd * 14, 'triangle', 0.05))
}
/** Render a synth track to a real .wav file (works offline). */
export async function renderWav(tr: Track): Promise<Blob> {
  const R = 22050, oc = new OfflineAudioContext(1, R * LEN, R), d = oc.createGain()
  d.gain.value = 0.8; d.connect(oc.destination)
  const p = mkpat(tr), sd = 60 / tr.bpm! / 2
  for (let k = 0, w = 0; w < LEN; k++, w += sd) stepNotes(oc, d, tr, p, k, w)
  const f = (await oc.startRendering()).getChannelData(0)
  const b = new DataView(new ArrayBuffer(44 + f.length * 2))
  const s = (o: number, t: string) => [...t].forEach((c, i) => b.setUint8(o + i, c.charCodeAt(0)))
  s(0, 'RIFF'); b.setUint32(4, 36 + f.length * 2, true); s(8, 'WAVEfmt '); b.setUint32(16, 16, true); b.setUint16(20, 1, true)
  b.setUint16(22, 1, true); b.setUint32(24, R, true); b.setUint32(28, R * 2, true); b.setUint16(32, 2, true); b.setUint16(34, 16, true)
  s(36, 'data'); b.setUint32(40, f.length * 2, true)
  for (let i = 0; i < f.length; i++) b.setInt16(44 + i * 2, Math.max(-1, Math.min(1, f[i])) * 32767, true)
  return new Blob([b], { type: 'audio/wav' })
}
