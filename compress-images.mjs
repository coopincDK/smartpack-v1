import sharp from 'sharp';
import { readdir, stat, rename } from 'fs/promises';
import { join, extname, basename } from 'path';

const FOLDERS = [
  'C:/Users/MartinMortensen/Desktop/SmartPack_v1/assets',
  'C:/Users/MartinMortensen/Desktop/lager-quiz/WarehouseWarrior/assets'
];

const MIN_SIZE = 300 * 1024; // kun filer over 300KB
let totalSaved = 0;
let count = 0;

async function getAllFiles(dir) {
  let files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getAllFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function compressPng(filePath) {
  const s = await stat(filePath);
  if (s.size < MIN_SIZE) return;

  const tmp = filePath + '.tmp';
  try {
    await sharp(filePath)
      .png({ compressionLevel: 9, palette: true, quality: 80 })
      .toFile(tmp);

    const newStat = await stat(tmp);
    const saved = s.size - newStat.size;
    if (newStat.size < s.size) {
      await rename(tmp, filePath);
      totalSaved += saved;
      count++;
      const pct = Math.round((saved / s.size) * 100);
      console.log(`✅ ${basename(filePath)}: ${kb(s.size)} → ${kb(newStat.size)} (-${pct}%)`);
    } else {
      await rename(tmp, filePath.replace('.tmp', ''));
      // delete tmp
      try { await rename(tmp, tmp + '.del'); } catch {}
      console.log(`⏭  ${basename(filePath)}: allerede optimeret`);
    }
  } catch (e) {
    console.log(`❌ ${basename(filePath)}: ${e.message}`);
    try { await rename(tmp, filePath); } catch {}
  }
}

function kb(b) { return Math.round(b / 1024) + 'KB'; }

async function main() {
  for (const folder of FOLDERS) {
    console.log(`\n📁 ${folder}`);
    const files = await getAllFiles(folder);
    const pngs = files.filter(f => extname(f).toLowerCase() === '.png');
    for (const f of pngs) {
      await compressPng(f);
    }
  }
  console.log(`\n🎯 Færdig: ${count} filer komprimeret, ${kb(totalSaved)} sparet i alt`);
}

main().catch(console.error);
