import fs from 'fs-extra';
import path from 'path';

const src = path.resolve(__dirname, '../../shared');
const dest = path.resolve(__dirname, '../src/shared');

console.log(`Copying from ${src} to ${dest}...`);

fs.removeSync(dest); // Remove old copy

fs.copySync(src, dest, {
  filter: (srcPath) => {
    return !srcPath.endsWith('tsconfig.json'); // Exclude tsconfig
  },
});

console.log('✅ Shared folder copied (tsconfig.json excluded)');
