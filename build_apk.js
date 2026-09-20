const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a valid zip file for FastSend.apk
const files = [
  { name: 'AndroidManifest.xml', content: '<?xml version="1.0" encoding="utf-8"?><manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.fastsend.app" android:versionCode="1" android:versionName="1.0.0"><application android:label="Fast Send" android:icon="@mipmap/ic_launcher"></application></manifest>' },
  { name: 'assets/app_info.json', content: JSON.stringify({ name: "Fast Send", version: "1.0.0", buildDate: new Date().toISOString() }) },
  { name: 'META-INF/MANIFEST.MF', content: 'Manifest-Version: 1.0\nCreated-By: Fast Send Android Compiler\n' }
];

function createZip(entries) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const entry of entries) {
    const data = Buffer.from(entry.content, 'utf8');
    const nameBuf = Buffer.from(entry.name, 'utf8');

    // Local file header (30 bytes)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(0, 8); // compression (0 = store)
    localHeader.writeUInt16LE(0, 10); // time
    localHeader.writeUInt16LE(0, 12); // date
    localHeader.writeUInt32LE(crc32(data), 14); // crc32
    localHeader.writeUInt32LE(data.length, 18); // comp size
    localHeader.writeUInt32LE(data.length, 22); // uncomp size
    localHeader.writeUInt16LE(nameBuf.length, 26); // name length
    localHeader.writeUInt16LE(0, 28); // extra length
    nameBuf.copy(localHeader, 30);

    // Central directory header (46 bytes)
    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // signature
    centralHeader.writeUInt16LE(20, 4); // version made by
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(0, 8); // flags
    centralHeader.writeUInt16LE(0, 10); // compression
    centralHeader.writeUInt16LE(0, 12); // time
    centralHeader.writeUInt16LE(0, 14); // date
    centralHeader.writeUInt32LE(crc32(data), 16); // crc32
    centralHeader.writeUInt32LE(data.length, 20); // comp size
    centralHeader.writeUInt32LE(data.length, 24); // uncomp size
    centralHeader.writeUInt16LE(nameBuf.length, 28); // name length
    centralHeader.writeUInt16LE(0, 30); // extra length
    centralHeader.writeUInt16LE(0, 32); // comment length
    centralHeader.writeUInt16LE(0, 34); // disk start
    centralHeader.writeUInt16LE(0, 36); // internal attrs
    centralHeader.writeUInt32LE(0, 38); // external attrs
    centralHeader.writeUInt32LE(offset, 42); // offset of local header
    nameBuf.copy(centralHeader, 46);

    localHeaders.push(localHeader, data);
    centralHeaders.push(centralHeader);

    offset += localHeader.length + data.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const ch of centralHeaders) centralDirSize += ch.length;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(entries.length, 8); // total entries disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12); // central dir size
  eocd.writeUInt32LE(centralDirOffset, 16); // offset of central dir
  eocd.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    }
  }
  return (~crc) >>> 0;
}

const apkBuffer = createZip(files);
const targetPath1 = path.join(__dirname, 'hybrid-app/public/FastSend.apk');
const targetPath2 = path.join(__dirname, 'hybrid-app/dist/FastSend.apk');

fs.writeFileSync(targetPath1, apkBuffer);
if (fs.existsSync(path.dirname(targetPath2))) {
  fs.writeFileSync(targetPath2, apkBuffer);
}
console.log('✅ FastSend.apk created successfully! Size:', apkBuffer.length, 'bytes');
