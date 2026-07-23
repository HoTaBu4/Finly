/**
 * Syncs version from package.json to app.config.js
 * Run after standard-version bumps package.json
 */
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const configPath = path.join(__dirname, '..', 'app.config.js');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let config = fs.readFileSync(configPath, 'utf8');

config = config.replace(/version:\s*'[^']+'/, `version: '${pkg.version}'`);
fs.writeFileSync(configPath, config);

console.log(`✓ app.config.js updated to version ${pkg.version}`);
