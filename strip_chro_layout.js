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
      content = content.replace(/import Layout from '[^']+';?\n?/g, '');
      
      // Replace opening layout tags
      content = content.replace(/<Layout[^>]*>/g, '<>');
      // Replace closing layout tags
      content = content.replace(/<\/Layout>/g, '</>');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'frontend/chro/src/pages'));
console.log('Stripped Layout from CHRO pages');
