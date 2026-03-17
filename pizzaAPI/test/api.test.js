const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dataLib = require('../lib/data');
const logsLib = require('../lib/logs');
const routeHandlers = require('../lib/handlers');

const FIXTURE_MENU_ITEMS = [
  { name: 'Pepperoni', price: 10, id: 1 },
  { name: 'Plain', price: 8, id: 2 }
];

function createSandbox() {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pizza-api-test-'));
  const dataRoot = path.join(tmpRoot, '.data');
  const logsRoot = path.join(tmpRoot, '.logs');

  fs.mkdirSync(path.join(dataRoot, 'users'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'tokens'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'cart'), { recursive: true });
  fs.mkdirSync(path.join(dataRoot, 'menuItems'), { recursive: true });
  fs.mkdirSync(path.join(logsRoot, 'charges'), { recursive: true });

  fs.writeFileSync(
    path.join(dataRoot, 'menuItems', 'menuItems.json'),
    JSON.stringify(FIXTURE_MENU_ITEMS),
    'utf8'
  );

  const oldDataBaseDir = dataLib.baseDir;
  const oldLogsBaseDir = logsLib.baseDir;
  dataLib.baseDir = `${dataRoot}${path.sep}`;
  logsLib.baseDir = `${logsRoot}${path.sep}`;

  return {
    tmpRoot,
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

function callNodeback(fn) {
  return new Promise((resolve, reject) => {
    fn((err, data) => {
      if (err) {
        return reject(new Error(String(err)));
      }
      return resolve(data);
    });
  });
}

test('user/token/cart/menu flow works end-to-end using handlers', async () => {
  const sandbox = createSandbox();

  try {
    const email = 'person@example.com';
    const firstPassword = 'first-pass';
    const newPassword = 'next-pass';

    const createUserRes = await invoke(
      routeHandlers.users,
      makeRequest('post', {
        firstName: 'Pat',
        lastName: 'Doe',
        email,
        address: '123 Main Street',
        passWord: firstPassword,
        tosAgreement: true
      })
    );
    assert.equal(createUserRes.statusCode, 200);

    const createTokenRes = await invoke(
      routeHandlers.tokens,
      makeRequest('post', { email, passWord: firstPassword })
    );
    assert.equal(createTokenRes.statusCode, 200);
    assert.equal(createTokenRes.payload.email, email);
    assert.ok(createTokenRes.payload.tokenId);

    const tokenId = createTokenRes.payload.tokenId;

    const getUserRes = await invoke(
      routeHandlers.users,
      makeRequest('get', {}, { email }, { token: tokenId })
    );
    assert.equal(getUserRes.statusCode, 200);
    assert.equal(getUserRes.payload.email, email);
    assert.equal(getUserRes.payload.hashedPW, undefined);

    const updateUserRes = await invoke(
      routeHandlers.users,
      makeRequest(
        'put',
        { firstName: 'Patricia', passWord: newPassword },
        { email },
        { token: tokenId }
      )
    );
    assert.equal(updateUserRes.statusCode, 200);

    const oldPasswordLoginRes = await invoke(
      routeHandlers.tokens,
      makeRequest('post', { email, passWord: firstPassword })
    );
    assert.equal(oldPasswordLoginRes.statusCode, 400);

    const newPasswordLoginRes = await invoke(
      routeHandlers.tokens,
      makeRequest('post', { email, passWord: newPassword })
    );
    assert.equal(newPasswordLoginRes.statusCode, 200);
    const freshTokenId = newPasswordLoginRes.payload.tokenId;

    const menuRes = await invoke(
      routeHandlers.menuItems,
      makeRequest('get', {}, { email }, { token: freshTokenId })
    );
    assert.equal(menuRes.statusCode, 200);
    assert.equal(menuRes.payload.MenuItems.length, 2);

    const cartCreateRes = await invoke(
      routeHandlers.cart,
      makeRequest(
        'post',
        { email, cart: [{ itemID: 1, count: 1, price: 10 }] },
        {},
        { token: freshTokenId }
      )
    );
    assert.equal(cartCreateRes.statusCode, 200);

    const cartReadRes = await invoke(
      routeHandlers.cart,
      makeRequest('get', {}, { email }, { token: freshTokenId })
    );
    assert.equal(cartReadRes.statusCode, 200);
    assert.equal(cartReadRes.payload.cartData.length, 1);

    const cartUpdateRes = await invoke(
      routeHandlers.cart,
      makeRequest(
        'put',
        { cart: [{ itemID: 2, count: 2, price: 8 }] },
        { email },
        { token: freshTokenId }
      )
    );
    assert.equal(cartUpdateRes.statusCode, 200);

    const updatedCartReadRes = await invoke(
      routeHandlers.cart,
      makeRequest('get', {}, { email }, { token: freshTokenId })
    );
    assert.equal(updatedCartReadRes.statusCode, 200);
    assert.deepEqual(updatedCartReadRes.payload.cartData, [{ itemID: 2, count: 2, price: 8 }]);

    const cartDeleteRes = await invoke(
      routeHandlers.cart,
      makeRequest('delete', {}, { email }, { token: freshTokenId })
    );
    assert.equal(cartDeleteRes.statusCode, 200);

    const userDeleteRes = await invoke(
      routeHandlers.users,
      makeRequest('delete', {}, { email }, { token: freshTokenId })
    );
    assert.equal(userDeleteRes.statusCode, 200);
  } finally {
    sandbox.restore();
  }
});

test('unsupported methods now return 405 for cart and charge handlers', async () => {
  const cartRes = await invoke(routeHandlers.cart, makeRequest('patch'));
  assert.equal(cartRes.statusCode, 405);

  const chargeRes = await invoke(routeHandlers.charge, makeRequest('get'));
  assert.equal(chargeRes.statusCode, 405);
});

test('logs library can list, compress, and decompress inside the selected subdirectory', async () => {
  const sandbox = createSandbox();

  try {
    await callNodeback((cb) => logsLib.append('charges', 'order-1', '{"ok":true}', cb));

    const filesBeforeCompress = await callNodeback((cb) => logsLib.listLogs('charges', false, cb));
    assert.ok(filesBeforeCompress.includes('order-1'));

    await callNodeback((cb) => logsLib.compress('charges', 'order-1', 'order-1-archive', cb));
    assert.ok(fs.existsSync(path.join(sandbox.logsRoot, 'charges', 'order-1-archive.gz.b64')));

    const decompressed = await callNodeback((cb) => logsLib.decompress('charges', 'order-1-archive', cb));
    assert.match(decompressed, /"ok":true/);
  } finally {
    sandbox.restore();
  }
});
