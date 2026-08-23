const fs = require('fs');
const path = require('path');
const babel = require('/usr/share/nodejs/@babel/core');
const presetTs = require('/usr/share/nodejs/@babel/preset-typescript');
const presetReact = require('/usr/share/nodejs/@babel/preset-react');
const pluginCjs = require('/usr/share/nodejs/@babel/plugin-transform-modules-commonjs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));
console.log(`Checking ${files.length} TypeScript / TSX files for syntax and compilation...`);

let errors = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  try {
    babel.transformSync(content, {
      filename: file,
      presets: [presetReact, presetTs],
      plugins: [pluginCjs],
      configFile: false,
      babelrc: false,
    });
  } catch (err) {
    console.error(`❌ Syntax/Compilation Error in ${file}:`, err.message);
    errors++;
  }
}

if (errors === 0) {
  console.log(`✅ All ${files.length} source files compiled and passed cleanly with 0 errors!`);
} else {
  console.error(`❌ ${errors} compilation errors found!`);
  process.exit(1);
}
