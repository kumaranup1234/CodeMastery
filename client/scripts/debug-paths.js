
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../');

console.log('Script dir:', __dirname);
console.log('Root dir:', rootDir);
console.log('Contents of Root:');

try {
    const files = fs.readdirSync(rootDir);
    files.forEach(f => console.log(' - ' + f));
} catch (e) {
    console.error('Error listing root:', e);
}

const checkFiles = [
    'java-interview-questions-main/README.md',
    'docker-cheat-sheet-master/README.md',
    'system-design-concepts-main/README.md',
    'javascript-interview-questions-master/README.md'
];

console.log('\nChecking target files:');
checkFiles.forEach(f => {
    const p = path.join(rootDir, f);
    console.log(`${f}: ${fs.existsSync(p) ? '✅ FOUND' : '❌ NOT FOUND'} (${p})`);
});
