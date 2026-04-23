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
      content = content.replace(/import Header from '[^']+';?\n?/g, '');
      content = content.replace(/import Footer from '[^']+';?\n?/g, '');
      
      // Remove component usage
      content = content.replace(/<Header[^>]*>\s*<\/Header>/g, '');
      content = content.replace(/<Header[^>]*\/>/g, '');
      content = content.replace(/<Footer[^>]*>\s*<\/Footer>/g, '');
      content = content.replace(/<Footer[^>]*\/>/g, '');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'frontend/hiring-assistant/src/pages'));
processDir(path.join(__dirname, 'frontend/professor/src/pages'));
console.log('Stripped headers and footers from pages');
