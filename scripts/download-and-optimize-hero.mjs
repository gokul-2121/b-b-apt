import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import https from 'https';

const url = 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779015981/Building_front_main_xn6fzm.jpg';
const optimizedDir = path.resolve('public/images/optimized');
const tempDownloadPath = path.join(optimizedDir, 'downloaded-building.jpg');
const heroOutputPath = path.join(optimizedDir, 'exterior-hero.jpg');
const superViewOutputPath = path.join(optimizedDir, 'Exterior-super-view.jpg');

console.log(`Downloading new building front image from:\n${url}...`);

const file = fs.createWriteStream(tempDownloadPath);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close(async () => {
      console.log('Download complete! Optimizing image...');
      
      try {
        const stats = fs.statSync(tempDownloadPath);
        console.log(`Downloaded image size: ${(stats.size / 1024).toFixed(1)} KB`);

        // 1. Optimize as Full-HD Hero background (1920x1080)
        await sharp(tempDownloadPath)
          .resize(1920, 1080, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 85, progressive: true, mozjpeg: true })
          .toFile(heroOutputPath);
          
        const heroStats = fs.statSync(heroOutputPath);
        console.log(`Created exterior-hero.jpg: ${(heroStats.size / 1024).toFixed(1)} KB`);

        // 2. Also overwrite Exterior-super-view.jpg (1600x1066)
        await sharp(tempDownloadPath)
          .resize(1600, 1066, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toFile(superViewOutputPath);

        const superViewStats = fs.statSync(superViewOutputPath);
        console.log(`Overwrote Exterior-super-view.jpg: ${(superViewStats.size / 1024).toFixed(1)} KB`);

        // Delete temporary download file
        fs.unlinkSync(tempDownloadPath);
        console.log('Cleanup successful! Image update complete.');
      } catch (err) {
        console.error('Error optimizing image:', err);
      }
    });
  });
}).on('error', (err) => {
  fs.unlinkSync(tempDownloadPath);
  console.error('Error downloading image:', err.message);
});
