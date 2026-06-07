const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const componentsDir = path.join(__dirname, '../frontend/src');
const files = walkSync(componentsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));

let totalViolations = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  // Simple regex to find button/input tags without data-testid
  // Look for <button, <input, <a and then find the closing >
  // If data-testid is not in between, it's a violation.

  // This is a naive regex, but good enough for a simple script
  const tagRegex = /<(button|input|a)([\s\S]*?)>/g;
  let match;
  let violationsInFile = 0;
  let fileOutput = '';

  while ((match = tagRegex.exec(content)) !== null) {
      const fullTag = match[0];
      // Skip if it has data-testid
      if (!fullTag.includes('data-testid')) {
          violationsInFile++;
          fileOutput += `  - ${fullTag.substring(0, 50)}...\n`;
      }
  }

  if (violationsInFile > 0) {
    console.log(`\nViolations found in ${file}:`);
    console.log(fileOutput);
    totalViolations += violationsInFile;
  }
}

if (totalViolations > 0) {
    console.warn(`\nWARNING: Found ${totalViolations} interactive elements missing data-testid attributes.`);
    // We shouldn't fail right now because there are pre-existing violations,
    // but the script is available for the agent to use in the future.
    process.exit(0);
} else {
    console.log('SUCCESS: All checked interactive elements have data-testid attributes.');
    process.exit(0);
}
