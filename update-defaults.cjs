const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/cms.json', 'utf8'));

let out = `const now = new Date().toISOString()

export const defaultNewsItems = ${JSON.stringify(data.news, null, 2)}

export const defaultGalleryItems = ${JSON.stringify(data.gallery, null, 2)}

export function buildDefaultCmsData() {
  return {
    news: defaultNewsItems,
    gallery: defaultGalleryItems,
  }
}
`;

fs.writeFileSync('src/lib/cms-defaults.js', out);
