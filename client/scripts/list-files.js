
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../');
const LOG_FILE = path.join(__dirname, 'debug_log.txt');

const FOLDERS = [
    'java-interview-questions-main',
    'docker-cheat-sheet-master',
    'system-design-concepts-main',
    'javascript-interview-questions-master'
];

let log = `Root: ${ROOT}\n`;

FOLDERS.forEach(folder => {
    const p = path.join(ROOT, folder);
    log += `\nChecking: ${p}\n`;
    if (!fs.existsSync(p)) {
        log += "  ❌ DOES NOT EXIST\n";
    } else {
        try {
            const files = fs.readdirSync(p);
            log += `  ✅ Exists. Content (${files.length}):\n`;
            files.forEach(f => log += `    - ${f}\n`);
        } catch (err) {
            log += `  ❌ ERROR READING: ${err.message}\n`;
        }
    }
});

fs.writeFileSync(LOG_FILE, log);
console.log("Log written to " + LOG_FILE);
