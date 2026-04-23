const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove imports
      content = content.replace(/import Breadcrumb from '[^']+';?\n?/g, '');
      
      // Remove component usage
      content = content.replace(/<Breadcrumb[^>]*>\s*<\/Breadcrumb>/g, '');
      content = content.replace(/<Breadcrumb[^>]*\/>/g, '');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'frontend/hiring-assistant/src/pages'));
processDir(path.join(__dirname, 'frontend/professor/src/pages'));
console.log('Stripped old Breadcrumb from pages');
