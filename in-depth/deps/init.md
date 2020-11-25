# NPM And Packaging

- `npm` command leverages the npm tool bundled with node
- `npm install -h` will show list of commands that can be used to install _things_ using npm
- `npm init` can be used to creat a `package.json` file in a directory, starting a node service/package/library
  - `npm init -y` will auto-populate fields in the `package.json` file

## Default package fields

```json
{
  "name": "the name of the package",
  "version": "the current version number of the package",
  "description": "a package description which is used for meta analysis in package registries",
  "main": "the entry-point file to load when the package is loaded",
  "scripts": "shell scripts used by name",
  "keywords": "array of keywords, improves discoverability of a published package",
  "author": "the package author",
  "license": "the package license"
}
```

## Adding Dependencies to a package

`npm install express`  
This adjusts the `package.json` file, and introduces a `dependencies` key/value pair:

```json
{
  "dependencies": {
    "express": "^version-number-here"
  }
}
```

This also creates a `node_modules` directory.  
This also downloads the installed 'package', and stores the package in the node_modules directory

## Reviewing dependencies

`npm ls` can describe the dependency tree in the `node_modules` directory

## Removing dependence on node modules directory

- `npm install` will read dependencies from the `package.json` file and install all of them. This makes the contents of the node_modules file irrelevant for storing

## Dev Dependencies

- not all dependencies are needed for prod
- some deps are tools for development
- `npm install --save-dev eslint`
  - this installs the eslint package as a dev dependency
  - This adjusts the `package.json` file, and introduces a `devDependencies` key/value pair:

```json
{
  "devDependencies": {
    "eslint": "^version-number-here"
  }
}
```
