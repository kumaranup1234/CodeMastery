
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../src/data/questions.json');
const SOURCE_FILE = path.join(__dirname, '../../custom-content/java/ADVANCED.md');

console.log(`Reading existing data from ${DATA_FILE}...`);
const existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const initialCount = existingData.length;

console.log(`Reading new content from ${SOURCE_FILE}...`);
const content = fs.readFileSync(SOURCE_FILE, 'utf-8');
const lines = content.split('\n');

let currentCategory = 'General';
let currentQuestion = null;
const newQuestions = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty or TOC
    if (!line.trim() || line.includes('Table of Contents')) continue;

    // Detect Category (H2)
    if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '').trim();
        continue;
    }

    // Detect Question (Numbered List "1. " or "### ")
    const isHeader = line.startsWith('### ');
    const isNumber = /^\d+\.\s/.test(line);

    if (isHeader || isNumber) {
        if (currentQuestion) {
            currentQuestion.answer = currentQuestion.answer.trim();
            newQuestions.push(currentQuestion);
        }

        let title = line.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '').trim();

        currentQuestion = {
            id: crypto.randomUUID(),
            technology: 'Java',
            category: currentCategory,
            title: title,
            answer: '',
            level: 'Advanced' // Tagging as advanced
        };
    } else if (currentQuestion) {
        currentQuestion.answer += line + '\n';
    }
}

// Push last
if (currentQuestion) {
    currentQuestion.answer = currentQuestion.answer.trim();
    newQuestions.push(currentQuestion);
}

console.log(`Parsed ${newQuestions.length} new Java questions.`);

// Append
const finalData = [...existingData, ...newQuestions];

fs.writeFileSync(DATA_FILE, JSON.stringify(finalData, null, 2));
console.log(`Success! Total questions increased from ${initialCount} to ${finalData.length}.`);
