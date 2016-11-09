'use strict';
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');

const base =  process.argv[2];
const compare =  process.argv[3];

const baseModules = readModules(base);
const compareModules = readModules(compare);

Object.keys(baseModules).forEach(baseKey => {
  if (baseKey in compareModules) {
    if (baseModules[baseKey] == compareModules[baseKey]) {
      console.log(`  ${baseKey}: "${baseModules[baseKey]}"`);
    } else {
      console.log(colors.red(`- ${baseKey}: "${baseModules[baseKey]}"`));
      console.log(colors.green(`+ ${baseKey}: "${compareModules[baseKey]}"`));
    }
  } else {
    console.log(colors.red(`- ${baseKey}: "${baseModules[baseKey]}"`));
  }
});

function readModules(location) {
  const table = {};
  fs.readdirSync(location)
    .filter(name => name !== '.bin')
    .map(name => {
      const pkg = path.join(location, name, 'package.json');
      const exists = fs.existsSync(pkg);
      if (!exists) { return; }

      const data = fs.readFileSync(pkg, 'utf-8');
      let parsed;

      try { parsed = JSON.parse(data); }
      catch(e) { parsed = false; }
      if (!parsed) { return; }

      table[name] = parsed.version;
    });
  return table;
}
