
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../src/data/questions.json');
// Check if images folder exists at root or client? Found at d:/interviewDev/images
// We will move them to client/public/images/java-diagrams to be accessible by React
const SOURCE_IMAGES_DIR = path.resolve(__dirname, '../../images');
const DEST_IMAGES_DIR = path.join(__dirname, '../public/images/java-diagrams');

if (!fs.existsSync(DEST_IMAGES_DIR)) {
    fs.mkdirSync(DEST_IMAGES_DIR, { recursive: true });
}

// 1. Move Images if they exist
const imageMap = {};
if (fs.existsSync(SOURCE_IMAGES_DIR)) {
    const files = fs.readdirSync(SOURCE_IMAGES_DIR);
    files.forEach(f => {
        if (f.endsWith('.png') || f.endsWith('.jpg')) {
            const src = path.join(SOURCE_IMAGES_DIR, f);
            const dest = path.join(DEST_IMAGES_DIR, f);
            fs.copyFileSync(src, dest);
            console.log(`Moved image: ${f}`);
            imageMap[f.toLowerCase()] = `/images/java-diagrams/${f}`;
        }
    });
}

const raw = fs.readFileSync(DATA_FILE, 'utf-8');
let questions = JSON.parse(raw);

console.log(`Processing ${questions.length} questions...`);

const javaKeywords = {
    'Collections': ['list', 'set', 'map', 'queue', 'collection', 'iterator', 'arraylist', 'hashmap', 'hashset', 'linkedlist', 'treemap'],
    'Exceptions': ['exception', 'error', 'throw', 'catch', 'checked', 'unchecked', 'try'],
    'Threads': ['thread', 'runnable', 'synchronization', 'lock', 'concurrency', 'executor', 'callable', 'future', 'deadlock'],
    'OOP': ['polymorphism', 'inheritance', 'encapsulation', 'abstraction', 'interface', 'abstract class', 'overloading', 'overriding'],
    'JVM': ['jvm', 'jdk', 'jre', 'memory', 'heap', 'stack', 'garbage collection', 'gc', 'classloader'],
    'Java 8+': ['stream', 'lambda', 'functional interface', 'optional', 'method reference', 'date time api'],
    'String': ['string', 'stringbuilder', 'stringbuffer', 'substring', 'equals', 'intern'],
    'Generics': ['generic', 'type erasure', 'wildcard'],
    'Serialization': ['serialization', 'serializable', 'externalizable']
};

questions.forEach(q => {
    if (q.technology === 'Java') {

        // 1. Clean ##
        if (q.title) q.title = q.title.replace(/#/g, '').trim();
        if (q.answer) q.answer = q.answer.replace(/##/g, '').trim();

        // 2. Map Images
        // Logic: specific filename match in Title or Answer text?
        // Or heuristic mapping based on keywords matching filename
        // Images: CheckedVsUncheckedException, CollectionsHierarchy, JVMArchitecture, JVM_JRE_JDK, JavaIndependent

        const lowerTitle = q.title.toLowerCase();
        const lowerAnswer = q.answer.toLowerCase();

        if (lowerTitle.includes('checked') && lowerTitle.includes('unchecked')) {
            q.image = imageMap['checkedvsuncheckedexception.png'];
        } else if (lowerTitle.includes('collection') && lowerTitle.includes('hierarchy')) {
            q.image = imageMap['collectionshierarchy.png'];
        } else if (lowerTitle.includes('jvm') && lowerTitle.includes('architecture')) {
            q.image = imageMap['jvmarchitecture.png'];
        } else if ((lowerTitle.includes('jdk') && lowerTitle.includes('jre')) || lowerTitle.includes('difference between jdk')) {
            q.image = imageMap['jvm_jre_jdk.png'];
        } else if (lowerTitle.includes('platform independent')) {
            q.image = imageMap['javaindependent.png'];
        }

        // 3. Categorize
        // Only if currently 'General'
        if (q.category === 'General') {
            for (const [cat, keywords] of Object.entries(javaKeywords)) {
                if (keywords.some(k => lowerTitle.includes(k) || lowerAnswer.includes(k))) {
                    q.category = cat;
                    break;
                }
            }
        }
    }
});

fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
console.log("Java Cleanup & Enhancement Complete.");
