const fs = require('fs');
const path = 'src/app/surprise/page.tsx';
let text = fs.readFileSync(path, 'utf8');
const words = [
  'Dark Energy',
  'Comfort Zone',
  'Heart Mode',
  'Cosmic',
  'Anime Soul',
  'Adrenaline',
  'Drama Core',
  'Cinematic',
];
for (const w of words) {
  const re = new RegExp(`return \".*${w}\";`, 'g');
  text = text.replace(re, `return \"${w}\";`);
}
fs.writeFileSync(path, text);
