import sharp from 'sharp';
import path from 'path';

const optimizedDir = path.resolve('public/images/optimized');

// Create an optimized version of the front view for the Offers section
const inputPath = path.join(optimizedDir, 'IMG-20190219-203821.jpg');
const outputPath = path.join(optimizedDir, 'exterior-offers.jpg');

await sharp(inputPath)
  .resize(800, 600, { fit: 'cover' })
  .jpeg({ quality: 82, progressive: true })
  .toFile(outputPath);

const fs = await import('fs');
const stats = fs.statSync(outputPath);
console.log(`Created: exterior-offers.jpg (${(stats.size / 1024).toFixed(0)} KB)`);
console.log('Done!');
