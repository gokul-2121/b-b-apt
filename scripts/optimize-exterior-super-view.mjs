import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const optimizedDir = path.resolve('public/images/optimized');

const inputPath = path.join(optimizedDir, 'IMG-20190219-203821.jpg');
const outputPath = path.join(optimizedDir, 'Exterior-super-view.jpg');

console.log(`Overwriting blurry Exterior-super-view.jpg with optimized high-res building view...`);

try {
  await sharp(inputPath)
    .resize(1600, 1066, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Successfully overwritten Exterior-super-view.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Error generating image:', err);
}
