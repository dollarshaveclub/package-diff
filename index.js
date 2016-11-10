#! /usr/bin/env node
'use strict';
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');

const base = readModules(process.argv[2]);
const compare = readModules(process.argv[3]);

Object.keys(base).forEach(baseKey => {
  if (baseKey in compare) {
    if (base[baseKey] == compare[baseKey]) {
      console.log(`  "${baseKey}": "${base[baseKey]}"`);
    } else {
      console.log(colors.red(`- "${baseKey}": "${base[baseKey]}"`));
      console.log(colors.green(`+ "${baseKey}": "${compare[baseKey]}"`));
    }
  } else {
    console.log(colors.red(`- "${baseKey}": "${base[baseKey]}"`));
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
