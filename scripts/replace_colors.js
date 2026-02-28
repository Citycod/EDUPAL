const fs = require('fs');
const path = require('path');

const files = [
    'app/(app)/resource/[id]/page.tsx',
    'app/(app)/study/[resourceId]/page.tsx',
    'components/study/FlashcardGame.tsx',
    'components/study/QuizGame.tsx'
];

files.forEach(f => {
    const filePath = path.join(__dirname, f);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace indigo variants with primary variants
        content = content.replace(/indigo-500/g, 'primary');
        content = content.replace(/indigo-600/g, 'primary/90');
        // Use word boundary for 50 so it doesn't match 500
        content = content.replace(/indigo-50\b/g, 'primary/10');
        content = content.replace(/indigo-100/g, 'primary/20');
        content = content.replace(/indigo-200/g, 'primary/30');
        content = content.replace(/indigo-300/g, 'primary/40');
        content = content.replace(/indigo-700/g, 'primary/70');
        content = content.replace(/indigo-800/g, 'primary/80');
        content = content.replace(/indigo-900/g, 'primary/90');
        content = content.replace(/indigo-950/g, 'primary/95');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${f}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log('Finished updating colors.');
