const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function createIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: Royal Green #00823B (0, 130, 59)
      png.data[idx] = 0;     // R
      png.data[idx + 1] = 130; // G
      png.data[idx + 2] = 59;  // B
      png.data[idx + 3] = 255; // A

      // Inner circular glow: Mint #C8E6C9 (200, 230, 201)
      if (dist < radius) {
        // Center bird silhouette
        if (Math.abs(dx) < radius * 0.55 && Math.abs(dy) < radius * 0.55) {
          // Bird Crest (Top Red)
          if (dy < -radius * 0.15 && dx < 0) {
            png.data[idx] = 229;   // R
            png.data[idx + 1] = 57;  // G
            png.data[idx + 2] = 53;  // B
          }
          // Bird Chest (White)
          else if (dx > -radius * 0.2 && dx < radius * 0.2 && dy > -radius * 0.1) {
            png.data[idx] = 255;
            png.data[idx + 1] = 255;
            png.data[idx + 2] = 255;
          }
          // Bird Body (Dark Emerald #0E4D34)
          else {
            png.data[idx] = 14;
            png.data[idx + 1] = 77;
            png.data[idx + 2] = 52;
          }
        } else {
          // Mint Turquoise ring
          png.data[idx] = 168;
          png.data[idx + 1] = 218;
          png.data[idx + 2] = 220;
        }
      }
    }
  }

  return PNG.sync.write(png);
}

const targets = [
  'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send\\hybrid-app\\public',
  'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send\\hybrid-app\\dist',
  'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send\\backend',
  'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send-upload\\hybrid-app\\public',
  'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send-upload\\hybrid-app\\dist'
];

targets.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'icon-192.png'), createIcon(192));
  fs.writeFileSync(path.join(dir, 'icon-512.png'), createIcon(512));
  fs.writeFileSync(path.join(dir, 'maskable-icon-512.png'), createIcon(512, true));
});

console.log('✅ All PNG icons generated successfully!');
