import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import https from 'https';

const attractions = [
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018036/konni_elephant_camp_pathanamthitta_k6b1bd.jpg',
    filename: 'konni_elephant.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018036/Adavi_eco_tourism_xqnsnw.jpg',
    filename: 'adavi_eco.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018037/Gavi__Kerala_isssaw.jpg',
    filename: 'gavi_forest.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018036/Peruthenaruvi_waterfalls_geyjs3.jpg',
    filename: 'waterfall.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018035/Sabarimala_temple_opeekz.webp',
    filename: 'sabarimala.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018036/Mannadi_temple_pl2f30.webp',
    filename: 'mannadi.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018035/Aranmula-Parthasarathy-Temple_kflvkl.jpg',
    filename: 'aranmula.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018035/Pandalam_palace_hem0u0.webp',
    filename: 'pandalam.png'
  },
  {
    url: 'https://res.cloudinary.com/dz0z9dbpf/image/upload/q_auto/f_auto/v1779018036/Kalleli_oorlai_rfard7.jpg',
    filename: 'kalleli.png'
  }
];

const targetDir = path.resolve('public/images/attractions');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

console.log('Starting custom attractions download and optimization...');

for (const item of attractions) {
  const tempDest = path.join(targetDir, `temp_${item.filename}`);
  const finalDest = path.join(targetDir, item.filename);
  
  console.log(`Downloading: ${item.filename} from URL...`);
  try {
    await downloadImage(item.url, tempDest);
    
    console.log(`Optimizing: ${item.filename}...`);
    // Output format is PNG because we want to match the filename extension,
    // but we can compress it heavily with sharp's png settings to keep it fast!
    await sharp(tempDest)
      .resize(800, 600, { fit: 'cover' })
      .png({ quality: 80, compressionLevel: 8 })
      .toFile(finalDest);
      
    fs.unlinkSync(tempDest);
    
    const stats = fs.statSync(finalDest);
    console.log(`  -> Saved ${item.filename} successfully (${(stats.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`Error processing ${item.filename}:`, err);
    if (fs.existsSync(tempDest)) fs.unlinkSync(tempDest);
  }
}

console.log('\nAll custom attraction images successfully updated!');
