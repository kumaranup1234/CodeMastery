
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, '../src/data/questions.json');

const newQuestions = [
    {
        "id": "sb-1",
        "technology": "Spring Boot",
        "category": "Core Spring",
        "title": "What is Spring Boot?",
        "answer": "Spring Boot is an open-source Java-based framework used to create a micro Service. It is developed by Pivotal Team and is used to build stand-alone and production ready spring applications."
    },
    {
        "id": "sb-2",
        "technology": "Spring Boot",
        "category": "Dependency Injection",
        "title": "What is Dependency Injection?",
        "answer": "Dependency Injection (DI) is a design pattern used to implement IoC. It allows the creation of dependent objects outside of a class and provides those objects to a class through different ways (Constructor, Setter, Interface)."
    },
    {
        "id": "js-1",
        "technology": "JavaScript",
        "category": "ES6+",
        "title": "What is the difference between let and var?",
        "answer": "**var** is function scoped and **let** is block scoped. Variables declared with var are hoisted to the top of their function scope, while let variables are strictly scoped to the block they are defined in."
    }
];

try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    const updatedData = [...data, ...newQuestions];
    fs.writeFileSync(DATA_PATH, JSON.stringify(updatedData, null, 2));
    console.log(`Appended ${newQuestions.length} questions. Total: ${updatedData.length}`);
} catch (error) {
    console.error('Error appending data:', error);
}
