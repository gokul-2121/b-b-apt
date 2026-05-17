import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const optimizedDir = path.resolve('public/images/optimized');

const inputPath = path.join(optimizedDir, 'IMG-20190219-203821.jpg');
const outputPath = path.join(optimizedDir, 'exterior-hero.jpg');

console.log(`Processing high-res hero image from ${inputPath}...`);

try {
  await sharp(inputPath)
    .resize(1920, 1080, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Successfully created exterior-hero.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Error generating hero image:', err);
}
