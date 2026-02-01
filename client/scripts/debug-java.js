
import fs from 'fs';
import path from 'path';

// Hardcoded absolute path
const targetDir = 'd:\\interviewDev\\java-interview-questions-main\\java-interview-questions-main\\scripts';
console.log(`Checking dir: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
    console.error("❌ Dir does not exist!");
} else {
    console.log("✅ Dir exists.");
    try {
        const files = fs.readdirSync(targetDir);
        console.log(`Contents (${files.length}):`);
        files.forEach(f => {
            console.log(` - '${f}' (len: ${f.length})`);
        });
    } catch (e) {
        console.error("❌ Error reading dir:", e);
    }
}
