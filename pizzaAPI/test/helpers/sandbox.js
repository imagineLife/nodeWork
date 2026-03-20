const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dataLib = require('../../lib/data');
const logsLib = require('../../lib/logs');

const DEFAULT_MENU_ITEMS = [
  { name: 'Pepperoni', price: 10, id: 1 },
  { name: 'Plain', price: 8, id: 2 }
];

function createSandbox(options = {}) {
  const menuItems = Array.isArray(options.menuItems) ? options.menuItems : DEFAULT_MENU_ITEMS;
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pizza-api-contract-'));
  const dataRoot = path.join(tmpRoot, '.data');
  const logsRoot = path.join(tmpRoot, '.logs');

  fs.mkdirSync(path.join(dataRoot, 'users'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'tokens'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'cart'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'menuItems'), { recursive: true });
  fs.mkdirSync(path.join(logsRoot, 'charges'), { recursive: true });

  fs.writeFileSync(
    path.join(dataRoot, 'menuItems', 'menuItems.json'),
    JSON.stringify(menuItems),
    'utf8'
  );

  const oldDataBaseDir = dataLib.baseDir;
  const oldLogsBaseDir = logsLib.baseDir;
  dataLib.baseDir = `${dataRoot}${path.sep}`;
  logsLib.baseDir = `${logsRoot}${path.sep}`;

  return {
    tmpRoot,
    dataRoot,
    logsRoot,
    restore() {
      dataLib.baseDir = oldDataBaseDir;
      logsLib.baseDir = oldLogsBaseDir;
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  };
}

function invoke(handler, data) {
  return new Promise((resolve) => {
    handler(data, (statusCode, payload, contentType) => {
      resolve({ statusCode, payload, contentType });
    });
  });
}

function makeRequest(method, payload = {}, queryStrObj = {}, headers = {}) {
  return {
    method,
    payload,
    queryStrObj,
    headers,
    trimmedPath: ''
  };
}

module.exports = {
  createSandbox,
  invoke,
  makeRequest
};
