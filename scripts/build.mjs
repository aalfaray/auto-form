import { build as viteBuild } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { rmSync, mkdirSync, cpSync, existsSync, readFileSync, writeFileSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')

if (existsSync(distDir)) rmSync(distDir, { recursive: true })
mkdirSync(distDir, { recursive: true })

async function buildUI() {
  await viteBuild({
    root: rootDir,
    plugins: [react()],
    resolve: {
      alias: {
        '@shared': resolve(rootDir, 'src/shared'),
        '@': resolve(rootDir, 'src'),
        '@/components': resolve(rootDir, 'src/components'),
        '@/lib': resolve(rootDir, 'src/lib'),
        '@/hooks': resolve(rootDir, 'src/hooks'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          popup: resolve(rootDir, 'popup.html'),
          options: resolve(rootDir, 'options.html'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
      outDir: distDir,
      emptyOutDir: false,
      sourcemap: false,
      minify: false,
      target: 'chrome120',
    },
  })
}

async function buildStandalone(name, entryPath) {
  await viteBuild({
    root: rootDir,
    resolve: {
      alias: {
        '@shared': resolve(rootDir, 'src/shared'),
        '@': resolve(rootDir, 'src'),
        '@/components': resolve(rootDir, 'src/components'),
        '@/lib': resolve(rootDir, 'src/lib'),
        '@/hooks': resolve(rootDir, 'src/hooks'),
      },
    },
    build: {
      rollupOptions: {
        input: entryPath,
        output: {
          entryFileNames: `${name}.js`,
          format: 'iife',
        },
      },
      outDir: distDir,
      emptyOutDir: false,
      sourcemap: false,
      minify: false,
      target: 'chrome120',
    },
  })

  const filePath = resolve(distDir, `${name}.iife.js`)
  const targetPath = resolve(distDir, `${name}.js`)
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8')
    const cleaned = content
      .replace(/^var\s+\w+\s*=\s*\(\s*function\s*\(\)\s*\{/, '(function() {')
      .replace(/\}\)\(\)\s*;?\s*$/, '})();')
    writeFileSync(targetPath, cleaned)
    rmSync(filePath)
  }
}

async function main() {
  console.log('Building UI (popup + options)...')
  await buildUI()
  console.log('UI built.')

  console.log('Building content-script...')
  await buildStandalone('content-script', resolve(rootDir, 'src/content/index.ts'))
  console.log('Content-script built.')

  console.log('Building background...')
  await buildStandalone('background', resolve(rootDir, 'src/background/service-worker.ts'))
  console.log('Background built.')

  console.log('Copying static assets...')
  const publicDir = resolve(rootDir, 'public')
  if (existsSync(publicDir)) {
    cpSync(publicDir, distDir, { recursive: true, overwrite: true })
  }

  console.log('\n✅ Build complete! Load the dist/ folder as an unpacked extension.')
}

main().catch(err => {
  console.error('Build failed:', err)
  process.exit(1)
})
