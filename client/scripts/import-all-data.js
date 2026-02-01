
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root is 2 levels up from scripts/ (scripts -> client -> interviewDev)
const ROOT_DIR = path.resolve(__dirname, '../../');
console.log(`Debug: Root Dir is ${ROOT_DIR}`);

// Configuration
const REPOS = [
    {
        folder: 'java-interview-questions-main',
        file: 'README.md',
        tech: 'Java'
    },
    {
        folder: 'custom-content/spring-boot',
        file: 'README.md',
        tech: 'Spring Boot'
    },
    {
        folder: 'custom-content/spring-boot',
        file: 'ADVANCED.md',
        tech: 'Spring Boot'
    },
    {
        folder: 'custom-content/spring-boot',
        file: 'CODING.md',
        tech: 'Spring Boot'
    },
    {
        folder: 'custom-content/spring-boot',
        file: 'EXTRAS.md',
        tech: 'Spring Boot'
    },
    {
        folder: 'docker-cheat-sheet-master',
        file: 'README.md',
        tech: 'Docker'
    },
    {
        folder: 'system-design-concepts-main',
        file: 'README.md',
        tech: 'System Design'
    },
    {
        folder: 'javascript-interview-questions-master',
        file: 'README.md',
        tech: 'JavaScript'
    }
];

const OUTPUT_FILE = path.join(__dirname, '../src/data/questions.json');

// Customized parser
function robustParse(content, tech) {
    const lines = content.split('\n');
    const questions = [];
    let currentCategory = 'General';
    let currentQuestion = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes('badgen.net') || line.includes('Table of Contents') || line.trim() === '---') continue;

        // Detect Category (H1 or H3? - Java repo uses # for Title, ## for Categories, ### for Questions usually)
        if (line.startsWith('## ') || (line.startsWith('# ') && !line.toLowerCase().includes('interview'))) {
            // Clean emojis?
            currentCategory = line.replace(/^#+\s*/, '').trim();
        }

        // Java repo questions often look like "1. Question...?" or "### Question"
        const isHeader = line.startsWith('### ') || line.startsWith('#### ');
        const isNumber = /^\d+\.\s/.test(line);

        if (isHeader || isNumber) {

            // Avoid TOC: TOC usually has links `[Title](#anchor)`
            // If it's a number and has a link, skip it.
            if (isNumber && line.includes('](')) continue;

            if (currentQuestion) {
                currentQuestion.answer = currentQuestion.answer.trim();
                questions.push(currentQuestion);
            }

            let title = line.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '').trim();
            title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // clean links if any remain

            currentQuestion = {
                id: crypto.randomUUID(),
                technology: tech,
                category: currentCategory,
                title: title,
                answer: '',
            };
        } else if (currentQuestion) {
            // Stop at horizontal rules or next header
            if (line.startsWith('---')) {
                // End of question?
            } else {
                currentQuestion.answer += line + '\n';
            }
        }
    }

    if (currentQuestion) {
        currentQuestion.answer = currentQuestion.answer.trim();
        questions.push(currentQuestion);
    }

    return questions;
}


async function main() {
    console.log("🚀 Starting Import...");

    let allQuestions = [];

    if (fs.existsSync(OUTPUT_FILE)) {
        const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
        const newTechs = new Set(REPOS.map(r => r.tech));
        allQuestions = existing.filter(q => !newTechs.has(q.technology));
        console.log(`ℹ️  Kept ${allQuestions.length} existing questions.`);
    }

    for (const repo of REPOS) {
        let fullPath = path.join(ROOT_DIR, repo.folder, repo.file);

        // Check for nested folder (common in unzips: repo-main/repo-main/README.md)
        if (!fs.existsSync(fullPath)) {
            const nestedPath = path.join(ROOT_DIR, repo.folder, repo.folder, repo.file);
            if (fs.existsSync(nestedPath)) {
                console.log(`   (Found nested structure: ${nestedPath})`);
                fullPath = nestedPath;
            }
        }

        console.log(`📂 Processing ${repo.tech} from ${fullPath}...`);

        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️  File not found: ${fullPath}`);
            continue;
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        const questions = robustParse(content, repo.tech);

        console.log(`✅ Extracted ${questions.length} questions for ${repo.tech}`);
        if (questions.length === 0) {
            console.log("   ⚠️  Parsed 0 questions! Check parsing logic.");
        }
        allQuestions = [...allQuestions, ...questions];
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allQuestions, null, 2));
    console.log(`🎉 Import Complete! Total Questions: ${allQuestions.length}`);
}

main();
