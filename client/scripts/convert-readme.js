
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const README_PATH = path.resolve(__dirname, '../../reactjs-interview-questions-master/README.md');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/questions.json');

function parseReadme() {
  try {
    const content = fs.readFileSync(README_PATH, 'utf-8');
    const lines = content.split('\n');

    const questions = [];
    let currentCategory = 'General';
    let currentQuestion = null;
    let buffer = [];

    // Helper to save current question
    const saveQuestion = () => {
      if (currentQuestion) {
        // Clean up buffer
        let answer = buffer.join('\n').trim();
        // Remove Back to Top links
        answer = answer.replace(/\*\*\[⬆ Back to Top\]\(#table-of-contents\)\*\*/g, '');
        // Remove trailing ---
        answer = answer.replace(/---$/, '');

        currentQuestion.answer = answer.trim();
        questions.push(currentQuestion);
        currentQuestion = null;
        buffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip TOC and intro
      if (i < 480 && !line.startsWith('## Core React')) continue;

      // Detect Category (## Category Name)
      // Note: The README seems to use ## for categories based on the view_file output showing "## Core React"
      if (line.match(/^##\s+/)) {
        saveQuestion();
        currentCategory = line.replace(/^##\s+/, '').trim();
        continue;
      }

      // Detect Question (### Question Text or Number. ### Question Text)
      // The view_file output shows "1.  ### What is React?" 
      const questionMatch = line.match(/^\d*\.?\s*###\s+(.+)$/);
      if (questionMatch) {
        saveQuestion();
        currentQuestion = {
          id: crypto.randomUUID(),
          technology: 'React',
          category: currentCategory,
          title: questionMatch[1].trim(),
          answer: ''
        };
        continue;
      }

      // Collect Answer
      if (currentQuestion) {
        buffer.push(line);
      }
    }

    // Save last question
    saveQuestion();

    if (!fs.existsSync(path.dirname(OUTPUT_PATH))) {
      fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(questions, null, 2));
    console.log(`Successfully parsed ${questions.length} questions to ${OUTPUT_PATH}`);

  } catch (error) {
    console.error('Error parsing README:', error);
  }
}

parseReadme();
