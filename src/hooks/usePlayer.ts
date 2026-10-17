import { useRef, useState } from 'react'
import type { Track } from '../types'
import { LEN, mkpat, stepNotes } from '../lib/synth'

export function usePlayer(tracks: Track[], onError: (m: string) => void) {
  const list = useRef(tracks); list.current = tracks
  const [cur, setCur] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const s = useRef({ ctx: null as AudioContext | null, master: null as GainNode | null, an: null as AnalyserNode | null,
    bus: null as GainNode | null, timer: 0, audio: null as HTMLAudioElement | null, t0: 0, queue: [] as string[], cur: null as string | null, vol: 0.6 })
  const get = (id: string | null) => list.current.find(t => t.id === id)

  function init() {
    const x = s.current
    if (x.ctx) return x.ctx
    const ctx = new AudioContext(), master = ctx.createGain(), an = ctx.createAnalyser()
    master.gain.value = x.vol; an.fftSize = 128; master.connect(an); an.connect(ctx.destination)
    Object.assign(x, { ctx, master, an }); return ctx
  }
  function stop() {
    const x = s.current
    clearInterval(x.timer)
    if (x.bus) { x.bus.disconnect(); x.bus = null }
    if (x.audio) { x.audio.pause(); x.audio = null }
  }
  function play(id: string, queue?: string[]) {
    const tr = get(id); if (!tr) return
    const ctx = init(), x = s.current
    stop(); void ctx.resume(); x.cur = id; if (queue) x.queue = queue
    if (tr.kind === 'synth') {
      const bus = ctx.createGain(); bus.connect(x.master!); x.bus = bus
      const pat = mkpat(tr), sd = 60 / tr.bpm! / 2
      let step = 0, next = ctx.currentTime + 0.05; x.t0 = ctx.currentTime
      x.timer = window.setInterval(() => {
        while (next < ctx.currentTime + 0.15) { stepNotes(ctx, bus, tr, pat, step, next); next += sd; step++ }
        if (ctx.currentTime - x.t0 >= LEN) move(1)
      }, 25)
    } else {
      const a = new Audio(tr.url); x.audio = a
      try { ctx.createMediaElementSource(a).connect(x.master!) } catch { a.volume = x.vol }
      a.onended = () => move(1)
      a.play().catch(() => onError('This file couldn’t be played. Try MP3, WAV or M4A.'))
    }
    setCur(id); setPlaying(true)
  }
  function move(d: number) {
    const x = s.current, q = x.queue.length ? x.queue : list.current.map(t => t.id)
    let k = q.indexOf(x.cur ?? ''); k = ((k < 0 ? 0 : k + d) + q.length) % q.length
    play(q[k], q)
  }
  function toggle(fallback?: string[]) {
    const x = s.current, tr = get(x.cur)
    if (!tr) { if (fallback?.length) play(fallback[0], fallback); else play(list.current[0].id); return }
    if (playing) { if (tr.kind === 'synth') void x.ctx!.suspend(); else x.audio?.pause(); setPlaying(false) }
    else { if (tr.kind === 'synth') void x.ctx!.resume(); else void x.audio?.play(); setPlaying(true) }
  }
  function reset() { stop(); s.current.cur = null; setCur(null); setPlaying(false) }
  function setVolume(v: number) { const x = s.current; x.vol = v; if (x.master) x.master.gain.value = v; if (x.audio) x.audio.volume = v }
  function seek(f: number) { const a = s.current.audio; if (a && a.duration) a.currentTime = f * a.duration }
  function progress() {
    const x = s.current, tr = get(x.cur)
    if (tr?.kind === 'synth' && x.ctx) return (x.ctx.currentTime - x.t0) / LEN
    return x.audio && x.audio.duration ? x.audio.currentTime / x.audio.duration : 0
  }
  function freq(buf: Uint8Array<ArrayBuffer>) { s.current.an?.getByteFrequencyData(buf) }
  return { cur, playing, play, toggle, next: () => move(1), prev: () => move(-1), reset, setVolume, seek, progress, freq }
}
export type PlayerApi = ReturnType<typeof usePlayer>
