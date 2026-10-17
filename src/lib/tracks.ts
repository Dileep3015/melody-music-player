import type { Track } from '../types'
import { rng } from './synth'

export function art(c: string, s: number): string {
  const r = rng(s * 7 + 1)
  let o = ''

  for (let i = 0; i < 5; i++) {
    o += `<circle cx="${(r() * 200) | 0}" cy="${(r() * 200) | 0}" r="${(30 + r() * 60) | 0}" fill="#fff" fill-opacity="${(0.08 + r() * 0.18).toFixed(2)}"/>`
  }

  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#1c1530"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>${o}</svg>`
    )
  )
}

type Row = [
  string,
  string,
  string,
  string,
  number,
  number,
  number[],
  OscillatorType,
  string,
  number
]

const rows: Row[] = [
  ['Night Bus Home', 'Ravi Kanth', 'After Hours', 'Chill', 84, 57, [0, 3, 5, 7, 10], 'triangle', '#7a6cf0', 11],
  ['Monsoon Window', 'Aarti Rao', 'After Hours', 'Chill', 72, 53, [0, 2, 4, 7, 9], 'sine', '#3fb6c9', 23],
  ['Neon Chai Stall', 'Kiran & Co', 'City Lights', 'Dance', 118, 60, [0, 2, 3, 7, 8], 'sawtooth', '#f26b8f', 37],
  ['Rooftop Sprint', 'Sana Mir', 'City Lights', 'Dance', 126, 55, [0, 3, 5, 6, 7, 10], 'square', '#f2a65a', 41],
  ['Slow Lantern', 'Dev Anand Jr.', 'Quiet Hours', 'Focus', 66, 52, [0, 2, 4, 5, 7, 9, 11], 'sine', '#6fcf97', 53],
  ['Paper Boats', 'Meera Pillai', 'Quiet Hours', 'Focus', 76, 50, [0, 2, 4, 7, 9], 'triangle', '#e0c36a', 67],
]

export const BUILTIN: Track[] = [
  ...rows.map((a, i) => ({
    id: 'b' + i,
    kind: 'synth' as const,
    title: a[0],
    artist: a[1],
    album: a[2],
    genre: a[3],
    bpm: a[4],
    root: a[5],
    sc: a[6],
    wave: a[7],
    seed: a[9],
    cover: art(a[8], a[9]),
  })),

  {
    id: 'song-1',
    kind: 'file',
    title: 'Happy Days',
    artist: 'Harshika, Mickey J. Meyer',
    album: 'Happy Days (Original Motion Picture Soundtrack)',
    genre: 'Telugu Film Song',
    cover: '/melody-music-player/images/happy-days.jpg',
    url: '/melody-music-player/music/song1.mp3',
  },
  {
    id: 'song-2',
    kind: 'file',
    title: 'Puthiyoru Lokam',
    artist: 'Bhadra Rajin, Hesham Abdul Wahab, Vimal Roy',
    album: 'Hridayam (Original Motion Picture Soundtrack)',
    genre: 'Malayalam Film Song',
    cover: '/melody-music-player/images/puthiyoru-lokam.jpg',
    url: '/melody-music-player/music/song2.mp3',
  },
  {
    id: 'song-3',
    kind: 'file',
    title: 'Reppalaninda',
    artist: 'Haricharan, Chaitan Bharadwaj',
    album: 'RX 100 (Original Motion Picture Soundtrack)',
    genre: 'Telugu Film Song',
    cover: '/melody-music-player/images/reppalanindaa.jpg',
    url: '/melody-music-player/music/song3.mp3',
  },
  {
  id: "song-4",
  title: "Vaa Kannamma",
  artist: "Vignesh Srikanth",
  album: "Vaa Kannamma",
  genre: "Tamil Song",
  cover: '/melody-music-player/images/Vaa-kannamma.jpg',
  url: "/melody-music-player/music/song4.mp3",
  kind: "file",
},
{
  id: "song-5",
  title: "Aagi Aagi",
  artist: "Anurag Kulkarni",
  album: "Ee Nagaraniki Emaindi",
  genre: "Telugu Song",
  cover: '/melody-music-player/images/ENE.jpg',
  url: "/melody-music-player/music/song5.mp3",
  kind: "file",
},
{
  id: "song-6",
  title: "One Name",
  artist: "Anirudh Ravichander",
  album: "Jailer 2",
  genre: "Film Song",
  cover: '/melody-music-player/images/jailer.jpg',
  url: "/melody-music-player/music/song6.mp3",
  kind: "file",
},
{
  id: "song-7",
  title: "Adire Hrudayam",
  artist: "Karthik",
  album: "RX 100",
  genre: "Telugu Song",
  cover: '/melody-music-player/images/reppalanindaa.jpg',
  url: "/melody-music-player/music/song7.mp3",
  kind: "file",
},
{
  id: "song-8",
  title: "Pillaa Raa",
  artist: "Anurag Kulkarni",
  album: "RX 100",
  genre: "Telugu Song",
  cover: '/melody-music-player/images/reppalanindaa.jpg',
  url: "/melody-music-player/music/song8.mp3",
  kind: "file",
},
{
  id: "song-9",
  title: "Rudhiram Marigi",
  artist: "Deepthi Parthasarathy",
  album: "RX 100",
  genre: "Telugu Song",
  cover: '/melody-music-player/images/reppalanindaa.jpg',
  url: "/melody-music-player/music/song9.mp3",
  kind: "file",
},
{
  id: "song-10",
  title: "Darshana",
  artist: "Hesham Abdul Wahab",
  album: "Hridayam",
  genre: "Malayalam Song",
  cover: '/melody-music-player/images/puthiyoru-lokam.jpg',
  url: "/melody-music-player/music/song10.mp3",
  kind: "file",
},
{
  id: "song-11",
  title: "Sarvam Sadha",
  artist: "Hesham Abdul Wahab",
  album: "Hridayam",
  genre: "Malayalam Song",
  cover: '/melody-music-player/images/puthiyoru-lokam.jpg',
  url: "/melody-music-player/music/song11.mp3",
  kind: "file",
},
{
  id: "song-12",
  title: "Nagumo",
  artist: "Hesham Abdul Wahab",
  album: "Hridayam",
  genre: "Malayalam Song",
  cover: '/melody-music-player/images/puthiyoru-lokam.jpg',
  url: "/melody-music-player/music/song12.mp3",
  kind: "file",
},
]