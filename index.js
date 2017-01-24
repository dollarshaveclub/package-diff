#! /usr/bin/env node
'use strict';
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');

const basePath = process.argv[2];
const comparePath = process.argv[3];

if (!basePath || !comparePath) {
  console.log(colors.red('A base and compare path must be provided'))
  return process.exit(1);
}

const base = readModules(basePath);
const compare = readModules(comparePath);

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

  if (location.indexOf('package.json') !== -1) {
    const data = fs.readFileSync(location, 'utf-8');
    let parsed;
    try { parsed = JSON.parse(data); }
    catch(e) { parsed = false; }
    if (!parsed) { return; }
    Object.keys(parsed.dependencies).forEach(key => {
      parsed.dependencies[key] = parsed.dependencies[key].replace(/\^|~/g, '');
    });
    return parsed.dependencies;
  }

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
