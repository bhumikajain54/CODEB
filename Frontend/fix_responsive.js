const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Fix main padding
  content = content.replace(/<main className="flex-1 p-8 overflow-y-auto">/g, '<main className="flex-1 p-4 md:p-8 overflow-y-auto">');
  
  // 2. Fix form card padding
  content = content.replace(/className="p-8 sm:p-12"/g, 'className="p-6 sm:p-12"');
  
  // 3. Fix table headers
  content = content.replace(/className="px-8 py-5"/g, 'className="px-4 md:px-8 py-4 md:py-5"');
  content = content.replace(/className="px-8 py-5 text-right"/g, 'className="px-4 md:px-8 py-4 md:py-5 text-right"');
  
  // 4. Fix table cells
  content = content.replace(/className="px-8 py-6"/g, 'className="px-4 md:px-8 py-4 md:py-6"');
  content = content.replace(/className="px-8 py-6 text-sm/g, 'className="px-4 md:px-8 py-4 md:py-6 text-sm');
  content = content.replace(/className="px-8 py-6 text-right"/g, 'className="px-4 md:px-8 py-4 md:py-6 text-right"');
  
  // 5. Fix empty state padding
  content = content.replace(/className="px-8 py-20 text-center"/g, 'className="px-4 md:px-8 py-10 md:py-20 text-center"');
  content = content.replace(/className="px-8 py-20 text-center text-slate-400 italic"/g, 'className="px-4 md:px-8 py-10 md:py-20 text-center text-slate-400 italic"');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
