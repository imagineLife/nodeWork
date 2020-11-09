# Evaluating Code

- checking code
- using a node/js file across platforms, check syntax of a program that is directly as a shell script!

## Eval to evaluate

```bash
node --eval "2 * 4"
```

(no output)

```bash
node -e "console.log(14+7)"
```

```bash
21
```

## Print to evaluate and print

```bash
node --print "4 * 5"
```

`20`

```bash
node -p "console.log(3 * 7)"
```

```bash
2
undefined
```

- prints undefined because the console.log does not return anything other than _undefined_

## Importing node modules

- node "modules" come with the library/binary (_fs, http, etc_)
- these modules can be required direclty from cmd input
- **useful because node is cross-platform!!**

### using the print flag with modules

#### Example

```bash
node -p "Object.keys(require('fs'))"
```

```bash
[
  'appendFile',       'appendFileSync',    'access',
  'accessSync',       'chown',             'chownSync',
  'chmod',            'chmodSync',         'close',
  'closeSync',        'copyFile',          'copyFileSync',
  'createReadStream', 'createWriteStream', 'exists',
  'existsSync',       'fchown',            'fchownSync',
  'fchmod',           'fchmodSync',        'fdatasync',
  'fdatasyncSync',    'fstat',             'fstatSync',
  'fsync',            'fsyncSync',         'ftruncate',
  'ftruncateSync',    'futimes',           'futimesSync',
  'lchown',           'lchownSync',        'lchmod',
  'lchmodSync',       'link',              'linkSync',
  'lstat',            'lstatSync',         'lutimes',
  'lutimesSync',      'mkdir',             'mkdirSync',
  'mkdtemp',          'mkdtempSync',       'open',
  'openSync',         'opendir',           'opendirSync',
  'readdir',          'readdirSync',       'read',
  'readSync',         'readv',             'readvSync',
  'readFile',         'readFileSync',      'readlink',
  'readlinkSync',     'realpath',          'realpathSync',
  'rename',           'renameSync',        'rm',
  'rmSync',           'rmdir',             'rmdirSync',
  'stat',             'statSync',          'symlink',
  'symlinkSync',      'truncate',          'truncateSync',
  'unwatchFile',      'unlink',            'unlinkSync',
  'utimes',           'utimesSync',        'watch',
  'watchFile',        'writeFile',         'writeFileSync',
  'write',            'writeSync',         'writev',
  'writevSync',       'Dir',               'Dirent',
  'Stats',            'ReadStream',        'WriteStream',
  'FileReadStream',   'FileWriteStream',   '_toUnixTimestamp',
  'F_OK',             'R_OK',              'W_OK',
  'X_OK',             'constants',         'promises'
]
```
