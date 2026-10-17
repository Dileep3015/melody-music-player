import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Later: add server.proxy { '/api': 'http://127.0.0.1:5000' } to talk to your Flask backend
export default defineConfig({ plugins: [react()] })
