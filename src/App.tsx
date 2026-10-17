import { useEffect, useMemo, useRef, useState } from 'react'
import type { Handlers, Playlists, View } from './types'
import { BUILTIN } from './lib/tracks'
import { hydrate, loadPls, loadUploads, removeUpload, saveUpload, savePls, type UploadRec } from './lib/storage'
import { downloadTrack } from './lib/download'
import { usePlayer } from './hooks/usePlayer'
import Player from './components/Player'
import { Albums, PlaylistsView, Songs, Upload } from './components/Sections'
import type { Track } from './types'

const TABS: [View, string][] = [['songs', 'Songs'], ['albums', 'Albums'], ['playlists', 'My playlists'], ['upload', 'Upload']]

export default function App() {
  const [uploads, setUploads] = useState<Track[]>([])
  const tracks = useMemo(() => [...BUILTIN, ...uploads], [uploads])
  const [pls, setPlsState] = useState<Playlists>(loadPls)
  const setPls = (p: Playlists) => { setPlsState(p); savePls(p) }
  const [view, setView] = useState<View>('songs')
  const [msg, setMsg] = useState('')
  const timer = useRef(0)
  const toast = (m: string) => { setMsg(m); clearTimeout(timer.current); timer.current = window.setTimeout(() => setMsg(''), 2800) }
  const player = usePlayer(tracks, toast)
  const dlg = useRef<HTMLDialogElement>(null)
  const [addId, setAddId] = useState<string | null>(null), [pick, setPick] = useState(''), [newName, setNewName] = useState('')

  useEffect(() => { loadUploads().then(rs => setUploads(rs.map(hydrate))).catch(() => {}) }, [])

  const h: Handlers = {
    onPlay: (id, q) => player.play(id, q),
    onAdd: id => { setAddId(id); setNewName(''); setPick(Object.keys(pls)[0] ?? ''); dlg.current?.showModal() },
    onDownload: async id => {
      const t = tracks.find(x => x.id === id)!
      toast(`Preparing “${t.title}”…`)
      try { await downloadTrack(t); toast('Download started.') } catch { toast('Couldn’t create the file.') }
    },
    onDelete: async id => {
      if (player.cur === id) player.reset()
      setUploads(u => u.filter(t => t.id !== id))
      setPls(Object.fromEntries(Object.entries(pls).map(([n, ids]) => [n, ids.filter(x => x !== id)])))
      try { await removeUpload(id) } catch { /* ignore */ }
      toast('Deleted.')
    },
  }
  const addToPlaylist = () => {
    const n = newName.trim() || pick
    if (!n || !addId) return toast('Name a playlist first.')
    const cur = pls[n] ?? []
    if (cur.includes(addId)) toast(`Already in “${n}”.`)
    else { setPls({ ...pls, [n]: [...cur, addId] }); toast(`Added to “${n}”.`) }
    dlg.current?.close()
  }
  const saveNew = async (r: UploadRec) => {
    setUploads(u => [...u, hydrate(r)])
    try { await saveUpload(r); toast(`Saved “${r.title}”.`) } catch { toast('Added for this visit only; this browser blocked saving.') }
  }
  const base = { tracks, cur: player.cur, h }
  const names = Object.keys(pls)

  return (
    <div className="wrap">
      <div className="logo">Melody</div>
      <h1>Your music, your albums</h1>
      <Player player={player} track={tracks.find(t => t.id === player.cur)} fallbackQueue={tracks.map(t => t.id)} />
      <nav role="tablist" aria-label="Sections">
        {TABS.map(([v, label]) => <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}>{label}</button>)}
      </nav>
      <main>
        {view === 'songs' && <Songs {...base} />}
        {view === 'albums' && <Albums {...base} />}
        {view === 'playlists' && <PlaylistsView {...base} pls={pls} setPls={setPls} toast={toast} />}
        {view === 'upload' && <Upload {...base} onSave={saveNew} />}
      </main>
      <footer>Uploads, playlists and covers are saved privately in this browser.</footer>
      <dialog ref={dlg}>
        <h2>Add to playlist</h2>
        <div className="form">
          {names.length > 0 && <select value={pick} onChange={e => setPick(e.target.value)} aria-label="Playlist">{names.map(n => <option key={n}>{n}</option>)}</select>}
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Or name a new playlist" aria-label="New playlist name" />
          <div style={{ display: 'flex', gap: 8 }}><button className="btn pri" onClick={addToPlaylist}>Add song</button><button className="btn" onClick={() => dlg.current?.close()}>Cancel</button></div>
        </div>
      </dialog>
      <div id="toast" className={msg ? 'on' : ''} role="status" aria-live="polite">{msg}</div>
    </div>
  )
}
