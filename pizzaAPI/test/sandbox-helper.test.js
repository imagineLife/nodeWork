const test = require('node:test');
const assert = require('node:assert/strict');

const dataLib = require('../lib/data');
const { createSandbox, invoke, makeRequest } = require('./helpers/sandbox');

test('sandbox helper supports custom menu items and utility helpers', async () => {
  const sandbox = createSandbox({
    menuItems: [{ name: 'Custom Slice', price: 12, id: 99 }]
  });

  try {
    const storedMenu = JSON.parse(dataLib.readSync('menuItems', 'menuItems'));
    assert.equal(storedMenu.length, 1);
    assert.equal(storedMenu[0].id, 99);

    const req = makeRequest('get', { x: 1 }, { y: 2 }, { z: 3 });
    assert.equal(req.method, 'get');
    assert.equal(req.trimmedPath, '');

    const result = await invoke((_data, cb) => cb(201, { ok: true }, 'json'), req);
    assert.equal(result.statusCode, 201);
    assert.deepEqual(result.payload, { ok: true });
    assert.equal(result.contentType, 'json');
  } finally {
    sandbox.restore();
  }
});
