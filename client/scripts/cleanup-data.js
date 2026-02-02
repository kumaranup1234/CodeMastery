
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../src/data/questions.json');

const raw = fs.readFileSync(DATA_FILE, 'utf-8');
let questions = JSON.parse(raw);

console.log(`Original Count: ${questions.length}`);

// 1. Fix "Back to Top" and Whitespace
questions.forEach(q => {
    if (q.answer) {
        // Remove the specific footer
        q.answer = q.answer.replace(/\*\*\[⬆ Back to Top\]\(#table-of-contents\)\*\*/g, '');
        q.answer = q.answer.replace(/\[⬆ Back to Top\]\(#table-of-contents\)/g, '');
        // Trim
        q.answer = q.answer.trim();
    }
    if (q.title) {
        q.title = q.title.trim();
    }
});

// 2. Fix Merged Titles (Heuristic: Title contains '?' followed by text)
let fixedTitlesCount = 0;
questions.forEach(q => {
    // Regex: look for a question mark, then space, then at least 5 chars of non-whitespace
    // Be careful not to match just "Is it?"
    const match = q.title.match(/^(.+\?)\s+([A-Z].+)$/);
    if (match) {
        const realTitle = match[1];
        const leakContent = match[2];

        console.log(`Fixing merged title: "${q.title.substring(0, 50)}..."`);
        console.log(` -> New Title: "${realTitle}"`);
        console.log(` -> Prepend Answer: "${leakContent.substring(0, 20)}..."`);

        q.title = realTitle;
        q.answer = leakContent + '\n\n' + q.answer;
        fixedTitlesCount++;
    }
});
console.log(`Fixed ${fixedTitlesCount} merged titles.`);

// 3. Club System Design into ONE
const sysDesignQuestions = questions.filter(q => q.technology === 'System Design');
if (sysDesignQuestions.length > 1) {
    console.log(`Clubbing ${sysDesignQuestions.length} System Design questions into one.`);

    // Sort them? Maybe preserve order.
    // We will create ONE master question.

    let combinedAnswer = "# System Design Concepts\n\n";

    sysDesignQuestions.forEach(q => {
        combinedAnswer += `## ${q.title}\n${q.answer}\n\n---\n\n`;
    });

    const masterQuestion = {
        id: 'system-design-master',
        technology: 'System Design',
        category: 'Architecture',
        title: 'System Design Concepts (Compiled)',
        answer: combinedAnswer,
        level: 'Advanced'
    };

    // Remove old ones
    questions = questions.filter(q => q.technology !== 'System Design');
    // Add master
    questions.push(masterQuestion);
}

// 4. Save
console.log(`New Count: ${questions.length}`);
fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
console.log("Cleanup Saved.");
