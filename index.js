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

console.log("\n" + colors.bold(`Diffing ${base.name} against ${compare.name}`) + "\n");

Object.keys(base.deps).forEach(baseKey => {
  if (baseKey in compare.deps) {
    if (base.deps[baseKey] == compare.deps[baseKey]) {
      console.log(`  "${baseKey}": "${base.deps[baseKey]}"`);
    } else {
      console.log(colors.red(`- "${baseKey}": "${base.deps[baseKey]}"`));
      console.log(colors.green(`+ "${baseKey}": "${compare.deps[baseKey]}"`));
    }
  } else {
    console.log(colors.red(`- "${baseKey}": "${base.deps[baseKey]}"`));
  }
});

function readModules(location) {
  const table = {};

  // Resolve package dependencies
  if (location.indexOf('package.json') !== -1) {
    const data = fs.readFileSync(location.replace(':dev', ''), 'utf-8');
    let parsed;
    try { parsed = JSON.parse(data); }
    catch(e) { parsed = false; }
    if (!parsed) { return; }
    const depsKey = location.indexOf(':dev') !== -1 ? 'devDependencies' : ('dependencies' || 'devDependencies');
    const deps = parsed[depsKey];
    Object.keys(deps).forEach(key => {
      deps[key] = deps[key].replace(/\^|~/g, '');
    });
    return {
      name: `${location} {${depsKey}}`,
      deps,
    };
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
  return {
    name: location,
    deps: table
  }
}
