const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send';
const targetDir = 'C:\\Users\\mamun\\.gemini\\antigravity\\scratch\\fast-send-upload';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (path.basename(src) === 'node_modules' || path.basename(src) === '.git') return;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const filename = path.basename(src);
    if (filename === 'cloudflared.exe' || filename.endsWith('.log')) return;
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

copyRecursiveSync(srcDir, targetDir);
console.log('Clean upload folder created successfully at:', targetDir);
