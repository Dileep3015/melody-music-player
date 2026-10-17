# Melody (React + TypeScript + Vite)

Music player with albums, playlists, uploads, downloads, cover art and a responsive layout (mobile, laptop, TV).

## Run on Windows
1. Install Node.js LTS from https://nodejs.org
2. Open this folder in VS Code, then open the terminal (Ctrl + `)
3. `npm install`
4. `npm run dev` and open the address it prints (usually http://localhost:5173)

Other commands: `npm run build` (production files in `dist/`), `npm run preview`.

## Where to change things
| Want to change | File |
|---|---|
| Player, visualizer, seek bar | `src/components/Player.tsx` |
| Play / pause / queue / volume logic | `src/hooks/usePlayer.ts` |
| Songs, Albums, Playlists, Upload screens | `src/components/Sections.tsx` |
| One song row (buttons) | `src/components/TrackList.tsx` |
| Built-in tracks and cover art | `src/lib/tracks.ts` |
| Uploads (IndexedDB) and playlists (localStorage) | `src/lib/storage.ts` |
| Download as .wav / original file | `src/lib/download.ts` |
| Colors, layout, mobile/TV sizes | `src/styles.css` |
| Shared types | `src/types.ts` |

## Next steps for your Flask + MySQL + Jamendo backend
- In `vite.config.ts` add `server: { proxy: { '/api': 'http://127.0.0.1:5000' } }`.
- Add a `fetch('/api/search?q=...')` call and map the results to the `Track` type (`kind: 'file'`, `url` = stream URL).
- Check Jamendo licensing before offering downloads of its tracks.
