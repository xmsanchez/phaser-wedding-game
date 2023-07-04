import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {viteObfuscateFile} from 'vite-plugin-obfuscator'

let obfuscator_options = {
  compact: true
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteObfuscateFile(obfuscator_options)],
	server: { host: '0.0.0.0', port: 8000 },
})
