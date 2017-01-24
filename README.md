# package-diff
Shows a diff of node modules between two directories

## Install
```sh
npm i -g package-diff
```

## Usage
```sh
# Use folders
package-diff /path/to/node_modules /path/to/comparing/node_modules

# Use packages
package-diff /foo/bar/package.json /path/to/comparing/node_modules

# Specify devDependencies in packages
package-diff package.json:dev /other/package.json
```

<img src="http://i.imgur.com/t62kyql.jpg">
