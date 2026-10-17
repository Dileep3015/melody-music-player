import type { Playlists, Track } from '../types'
import { art } from './tracks'
export interface UploadRec { id: string; title: string; artist: string; album: string; blob: Blob; img: Blob | null; ext: string }
const open = () => new Promise<IDBDatabase>((res, rej) => {
  const r = indexedDB.open('melody', 1)
  r.onupgradeneeded = () => r.result.createObjectStore('t', { keyPath: 'id' })
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error)
})
const req = <T,>(q: IDBRequest<T>) => new Promise<T>((res, rej) => { q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error) })
const store = async (m: IDBTransactionMode) => (await open()).transaction('t', m).objectStore('t')
export const loadUploads = async (): Promise<UploadRec[]> =>
  ((await req((await store('readonly')).getAll())) as UploadRec[]).sort((a, b) => (a.id > b.id ? 1 : -1))
export const saveUpload = async (r: UploadRec) => { await req((await store('readwrite')).put(r)) }
export const removeUpload = async (id: string) => { await req((await store('readwrite')).delete(id)) }
export function hydrate(r: UploadRec): Track {
  const h = [...r.id].reduce((a, c) => a + c.charCodeAt(0), 0)
  return { id: r.id, kind: 'file', title: r.title, artist: r.artist, album: r.album, genre: 'Upload', ext: r.ext, blob: r.blob,
    url: URL.createObjectURL(r.blob), cover: r.img ? URL.createObjectURL(r.img) : art(`hsl(${(h * 37) % 360},60%,55%)`, h) }
}
export const loadPls = (): Playlists => { try { return JSON.parse(localStorage.getItem('melody.pls') || '{}') } catch { return {} } }
export const savePls = (p: Playlists) => { try { localStorage.setItem('melody.pls', JSON.stringify(p)) } catch { /* storage blocked */ } }
