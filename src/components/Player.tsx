import { useEffect, useRef } from 'react'
import type { PlayerApi } from '../hooks/usePlayer'
import type { Track } from '../types'

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
interface Props { player: PlayerApi; track?: Track; fallbackQueue: string[] }

export default function Player({ player, track, fallbackQueue }: Props) {
  const cv = useRef<HTMLCanvasElement>(null), bar = useRef<HTMLDivElement>(null), fill = useRef<HTMLElement>(null)
  const live = useRef({ playing: player.playing, progress: player.progress, freq: player.freq })
  live.current = { playing: player.playing, progress: player.progress, freq: player.freq }

  useEffect(() => {
    let raf = 0
    const draw = () => {
      const c = cv.current!, g = c.getContext('2d')!, dpr = devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight
      if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr }
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h)
      const cs = getComputedStyle(document.documentElement), a1 = cs.getPropertyValue('--accent'), a2 = cs.getPropertyValue('--accent2')
      const n = 48, bw = w / n, d = new Uint8Array(64)
      if (live.current.playing) live.current.freq(d)
      for (let i = 0; i < n; i++) {
        const v = live.current.playing ? (d[i] || 0) / 255 : 0.05 + 0.03 * Math.sin(Date.now() / 600 + i)
        const bh = Math.max(3, v * h * 0.9); g.fillStyle = i % 2 ? a1 : a2; g.fillRect(i * bw + 2, h - bh, bw - 4, bh)
      }
      if (fill.current) fill.current.style.width = Math.min(100, live.current.progress() * 100) + '%'
      raf = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="stage" aria-label="Player">
      <canvas ref={cv} aria-hidden="true" />
      <div className="bar" ref={bar} aria-hidden="true" onClick={e => { const r = bar.current!.getBoundingClientRect(); player.seek((e.clientX - r.left) / r.width) }}><i ref={fill} /></div>
      <div className="now">
        <div className="meta">
          <img alt="" src={track?.cover ?? BLANK} />
          <div><b>{track?.title ?? 'Nothing playing'}</b><small>{track ? `${track.artist} – ${track.album}` : 'Pick a song to start'}</small></div>
        </div>
        <div className="ctrls">
          <button className="ic" onClick={player.prev} aria-label="Previous track">&#9198;</button>
          <button className="play" onClick={() => player.toggle(fallbackQueue)} aria-label={player.playing ? 'Pause' : 'Play'}>{player.playing ? '❚❚' : '▶'}</button>
          <button className="ic" onClick={player.next} aria-label="Next track">&#9197;</button>
          <label className="vol">Volume <input type="range" min="0" max="1" step="0.01" defaultValue="0.6" onChange={e => player.setVolume(+e.target.value)} /></label>
        </div>
      </div>
    </section>
  )
}
