const fs = require('fs');
const path = 'src/app/layout.tsx';
const content = fs.readFileSync(path, 'utf8');
const pattern = /<span[\s\S]*?logoPulse 4s infinite[\s\S]*?<\/span>/;
const replacement = `            <span\n              style={{\n                display: \"flex\",\n                alignItems: \"center\",\n                gap: 10,\n                fontSize: 20,\n                fontWeight: 800,\n                textShadow: \"0 0 22px rgba(124,58,237,1)\",\n                animation: \"logoPulse 4s infinite\",\n              }}\n            >\n              <img\n                src=\"/icon.svg\"\n                alt=\"Movie Galaxy\"\n                style={{\n                  width: 28,\n                  height: 28,\n                  filter: \"drop-shadow(0 0 10px rgba(124,58,237,.9))\",\n                }}\n              />\n              Movie Galaxy\n            </span>`;
const updated = content.replace(pattern, replacement);
if (updated === content) {
  throw new Error('Pattern not found for header span.');
}
fs.writeFileSync(path, updated);
