import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const attractionsDir = path.resolve('public/images/attractions');

const files = fs.readdirSync(attractionsDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const inputPath = path.join(attractionsDir, file);
  const outputName = file.replace('.png', '.jpg');
  const outputPath = path.join(attractionsDir, outputName);
  
  const stats = fs.statSync(inputPath);
  console.log(`Converting: ${file} (${(stats.size / 1024).toFixed(0)} KB)`);
  
  await sharp(inputPath)
    .resize(800, 600, { fit: 'cover' })
    .jpeg({ quality: 80, progressive: true })
    .toFile(outputPath);
  
  const newStats = fs.statSync(outputPath);
  console.log(`  -> ${outputName} (${(newStats.size / 1024).toFixed(0)} KB) - saved ${((1 - newStats.size/stats.size)*100).toFixed(0)}%`);
}

console.log('\nDone! All attraction images converted to optimized JPEG.');
