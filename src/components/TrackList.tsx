import type { Handlers, Track } from '../types'
interface Props { tracks: Track[]; cur: string | null; h: Handlers; mode?: 'add' | 'pl' | 'up'; empty: string }
export default function TrackList({ tracks, cur, h, mode = 'add', empty }: Props) {
  if (!tracks.length) return <p className="empty">{empty}</p>
  const ids = tracks.map(t => t.id)
  return (
    <ul>
      {tracks.map(t => (
        <li key={t.id} className="row" aria-current={t.id === cur ? 'true' : undefined}>
          <button className="main" onClick={() => h.onPlay(t.id, ids)}>
            <img src={t.cover} alt="" /><span><b>{t.title}</b><small>{t.artist} · {t.album}</small></span>
          </button>
          {mode === 'pl'
            ? <button className="ib" onClick={() => h.onRemove?.(t.id)} aria-label="Remove from playlist">&#10005;</button>
            : <button className="ib" onClick={() => h.onAdd(t.id)} aria-label="Add to playlist">&#65291;</button>}
          <button className="ib" onClick={() => h.onDownload(t.id)} aria-label={`Download ${t.title}`}>&#11015;</button>
          {mode === 'up' && <button className="ib" onClick={() => h.onDelete?.(t.id)} aria-label="Delete upload">&#128465;</button>}
        </li>
      ))}
    </ul>
  )
}
