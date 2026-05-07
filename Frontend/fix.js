const fs = require('fs');
const path = require('path');
const dir = 'd:/Working file/CODEB-main/Frontend/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'sidebar.js' && f !== 'DashboardLayout.js');

files.forEach(f => {
  const filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('Sidebar')) {
    content = content.replace(/import Sidebar from ["']\.\/sidebar["'];?\r?\n?/g, '');
    content = content.replace(/\s*<Sidebar[^>]*>\s*/g, '\n');
    fs.writeFileSync(filepath, content);
    console.log('Updated ' + f);
  }
});
