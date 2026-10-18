import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
	server: { host: '0.0.0.0', port: 8000 },
	// Strip console/debugger statements from production bundles
	esbuild: { drop: mode === 'production' ? ['console', 'debugger'] : [] },
	build: {
		// Hashed bundles go to /static (cacheable forever); public/assets keeps the game files
		assetsDir: 'static',
		// Phaser alone is ~1.2 MB minified; keep it in its own chunk and silence the size warning
		chunkSizeWarningLimit: 1600,
		rollupOptions: {
			output: { manualChunks: { phaser: ['phaser'] } },
		},
	},
	test: { include: ['src/**/*.test.js'] },
}))
