import { useState } from 'react'
import type { Handlers, Playlists, Track } from '../types'
import type { UploadRec } from '../lib/storage'
import { art } from '../lib/tracks'
import TrackList from './TrackList'

interface Base { tracks: Track[]; cur: string | null; h: Handlers }

export function Songs({ tracks, cur, h }: Base) {
  const [q, setQ] = useState(''), [genre, setGenre] = useState('All')
  const genres = ['All', ...new Set(tracks.map(t => t.genre))]
  const shown = tracks.filter(t => (genre === 'All' || t.genre === genre) && `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q.trim().toLowerCase()))
  return (<>
    <div className="tools">
      <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search title, artist or album" aria-label="Search songs" />
      {genres.map(g => <button key={g} className="chip" aria-pressed={g === genre} onClick={() => setGenre(g)}>{g}</button>)}
    </div>
    <TrackList tracks={shown} cur={cur} h={h} empty="No songs match. Clear the search or pick another genre." />
  </>)
}

export function Albums({ tracks, cur, h }: Base) {
  const [open, setOpen] = useState<string | null>(null)
  const groups: Record<string, Track[]> = {}
  tracks.forEach(t => (groups[t.album] ||= []).push(t))
  const ts = open ? groups[open] : undefined
  if (open && ts) return (<>
    <button className="btn" onClick={() => setOpen(null)}>&#8592; All albums</button>
    <div className="head" style={{ marginTop: 16 }}>
      <img src={ts[0].cover} alt="" />
      <div><h2>{open}</h2><small>{ts.length} song{ts.length > 1 ? 's' : ''}</small><br />
        <button className="btn pri" style={{ marginTop: 10 }} onClick={() => h.onPlay(ts[0].id, ts.map(t => t.id))}>Play album</button></div>
    </div>
    <TrackList tracks={ts} cur={cur} h={h} empty="" />
  </>)
  return (
    <div className="grid">
      {Object.entries(groups).map(([n, a]) => (
        <button key={n} className="card" onClick={() => setOpen(n)}>
          <img src={a[0].cover} alt="" /><b>{n}</b><br /><small>{a.length} song{a.length > 1 ? 's' : ''}</small>
        </button>))}
    </div>)
}

interface PlProps extends Base { pls: Playlists; setPls: (p: Playlists) => void; toast: (m: string) => void }
export function PlaylistsView({ tracks, cur, h, pls, setPls, toast }: PlProps) {
  const [open, setOpen] = useState<string | null>(null), [name, setName] = useState('')
  const byId = (id: string) => tracks.find(t => t.id === id)
  if (open && pls[open]) {
    const ts = pls[open].map(byId).filter((t): t is Track => !!t)
    const hh: Handlers = { ...h, onRemove: id => setPls({ ...pls, [open]: pls[open].filter(x => x !== id) }) }
    return (<>
      <button className="btn" onClick={() => setOpen(null)}>&#8592; All playlists</button>
      <h2 style={{ marginTop: 16 }}>{open}</h2>
      <div className="tools">
        <button className="btn pri" onClick={() => ts.length ? h.onPlay(ts[0].id, ts.map(t => t.id)) : toast('Add some songs first.')}>Play playlist</button>
        <button className="btn" onClick={() => { const rest = { ...pls }; delete rest[open]; setPls(rest); setOpen(null) }}>Delete playlist</button>
      </div>
      <TrackList tracks={ts} cur={cur} h={hh} mode="pl" empty="This playlist is empty. Use the + button on any song to add it here." />
    </>)
  }
  const create = () => {
    const n = name.trim()
    if (!n) return toast('Type a playlist name first.')
    if (pls[n]) return toast('That playlist already exists.')
    setPls({ ...pls, [n]: [] }); setName(''); setOpen(n)
  }
  const names = Object.keys(pls)
  return (<>
    <div className="tools">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="New playlist name" aria-label="New playlist name" />
      <button className="btn pri" onClick={create}>Create playlist</button>
    </div>
    {names.length ? <div className="grid">{names.map(n => {
      const f = byId(pls[n][0])
      return <button key={n} className="card" onClick={() => setOpen(n)}><img src={f ? f.cover : art('#7a6cf0', 5)} alt="" /><b>{n}</b><br /><small>{pls[n].length} song{pls[n].length === 1 ? '' : 's'}</small></button>
    })}</div> : <p className="empty">No playlists yet. Name one above to get started.</p>}
  </>)
}

export function Upload({ tracks, cur, h, onSave }: Base & { onSave: (r: UploadRec) => void }) {
  const [file, setFile] = useState<File | null>(null), [img, setImg] = useState<File | null>(null)
  const [title, setTitle] = useState(''), [artist, setArtist] = useState(''), [album, setAlbum] = useState('')
  const [msg, setMsg] = useState('')
  const ups = tracks.filter(t => t.kind === 'file')
  const albums = [...new Set(tracks.map(t => t.album))]
  const save = () => {
    if (!file) return setMsg('Choose an audio file first.')
    onSave({ id: 'u' + Date.now(), title: title.trim() || file.name.replace(/\.[^.]+$/, ''), artist: artist.trim() || 'Me',
      album: album.trim() || 'My uploads', blob: file, img, ext: (file.name.match(/\.([a-z0-9]+)$/i)?.[1] ?? 'mp3').toLowerCase() })
    setFile(null); setImg(null); setTitle(''); setArtist(''); setAlbum(''); setMsg('Saved.')
  }
  return (<>
    <h2>Upload a song</h2>
    <div className="form">
      <label>Audio file<input className="field" type="file" accept="audio/*" key={'f' + ups.length} onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
      <label>Title<input className="field" type="text" value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label>Artist<input className="field" type="text" value={artist} onChange={e => setArtist(e.target.value)} /></label>
      <label>Album<input className="field" type="text" list="al" value={album} onChange={e => setAlbum(e.target.value)} placeholder="My uploads" />
        <datalist id="al">{albums.map(n => <option key={n} value={n} />)}</datalist></label>
      <label>Cover image (optional)<input className="field" type="file" accept="image/*" key={'i' + ups.length} onChange={e => setImg(e.target.files?.[0] ?? null)} /></label>
      <button className="btn pri" onClick={save}>Save song</button>
      {msg && <small role="status">{msg}</small>}
    </div>
    <h2 style={{ marginTop: 28 }}>Your uploads</h2>
    <TrackList tracks={ups} cur={cur} h={h} mode="up" empty="Nothing uploaded yet. Added songs show up in Songs and Albums too." />
  </>)
}
