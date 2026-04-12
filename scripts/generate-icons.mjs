import sharp from 'sharp'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const iconsDir = join(rootDir, 'public', 'icons')

if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true })

const sizes = [16, 48, 128]

for (const size of sizes) {
  const svgPath = join(iconsDir, `icon${size}.svg`)
  const pngPath = join(iconsDir, `icon${size}.png`)

  if (!existsSync(svgPath)) {
    console.warn(`SVG not found: ${svgPath}, skipping`)
    continue
  }

  const svgBuffer = readFileSync(svgPath)

  await sharp(svgBuffer).resize(size, size).png().toFile(pngPath)

  console.log(`Generated: ${pngPath}`)
}

console.log('All icons generated!')
