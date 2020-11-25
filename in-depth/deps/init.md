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
  "scripts": "namespaced shell scripts",
  "keywords": "array of keywords, improves discoverability of a published package",
  "author": "the package author",
  "license": "the package license"
}
```
