import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const optimizedDir = path.resolve('public/images/optimized');

const files = fs.readdirSync(optimizedDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

console.log(`Found ${files.length} images to optimize in ${optimizedDir}...`);

let totalSavedBytes = 0;
let totalOriginalBytes = 0;

for (const file of files) {
  const filePath = path.join(optimizedDir, file);
  
  // Skip temp or already small generated files if needed, but let's optimize everything!
  // Wait, let's look at size first
  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  
  totalOriginalBytes += stats.size;
  
  // If it's already under 100KB, maybe keep or slightly optimize
  if (sizeKB < 100 && file === 'Exterior-super-view.jpg') {
    console.log(`Skipping small ${file} (${sizeKB.toFixed(1)} KB)`);
    continue;
  }
  
  console.log(`Optimizing: ${file} (${sizeKB.toFixed(1)} KB)`);
  
  const tempPath = filePath + '.tmp';
  
  try {
    // Read and optimize
    const pipeline = sharp(filePath);
    const metadata = await pipeline.metadata();
    
    // Resize if width is larger than 1600px
    if (metadata.width > 1600) {
      pipeline.resize(1600, null, { withoutEnlargement: true, fit: 'inside' });
    }
    
    await pipeline
      .jpeg({ quality: 80, progressive: true, mozjpeg: true })
      .toFile(tempPath);
      
    // Replace original
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    
    const newStats = fs.statSync(filePath);
    const newSizeKB = newStats.size / 1024;
    const savedKB = sizeKB - newSizeKB;
    totalSavedBytes += (stats.size - newStats.size);
    
    console.log(`  -> Done! New size: ${newSizeKB.toFixed(1)} KB (Saved ${savedKB.toFixed(1)} KB / ${((savedKB / sizeKB) * 100).toFixed(0)}%)`);
  } catch (err) {
    console.error(`Error optimizing ${file}:`, err);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}

console.log(`\nOptimization Complete!`);
console.log(`Original total size: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total saved space: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB (${((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1)}% reduction)`);
