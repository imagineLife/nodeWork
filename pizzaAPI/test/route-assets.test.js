const test = require('node:test');
const assert = require('node:assert/strict');

const helpers = require('../lib/helpers');
const routeHandlers = require('../lib/handlers');

function invoke(handler, data) {
  return new Promise((resolve) => {
    handler(data, (statusCode, payload, contentType) => {
      resolve({ statusCode, payload, contentType });
    });
  });
}

test('favicon handler method and success/error paths', async () => {
  const methodErr = await invoke(routeHandlers.favicon, { method: 'post' });
  assert.equal(methodErr.statusCode, 405);

  const originalGetStaticAsset = helpers.getStaticAsset;
  try {
    helpers.getStaticAsset = (_name, cb) => cb(false, Buffer.from('ico'));
    const ok = await invoke(routeHandlers.favicon, { method: 'get' });
    assert.equal(ok.statusCode, 200);
    assert.equal(ok.contentType, 'favicon');

    helpers.getStaticAsset = (_name, cb) => cb('err');
    const err = await invoke(routeHandlers.favicon, { method: 'get' });
    assert.equal(err.statusCode, 500);
  } finally {
    helpers.getStaticAsset = originalGetStaticAsset;
  }
});

test('public asset handler returns expected content types and status codes', async () => {
  const methodErr = await invoke(routeHandlers.public, { method: 'post', trimmedPath: 'public/app.css' });
  assert.equal(methodErr.statusCode, 405);

  const notFound = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/' });
  assert.equal(notFound.statusCode, 404);

  const originalGetStaticAsset = helpers.getStaticAsset;
  try {
    helpers.getStaticAsset = (_name, cb) => cb(false, Buffer.from('x'));

    const css = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/app.css' });
    assert.equal(css.statusCode, 200);
    assert.equal(css.contentType, 'css');

    const png = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/logo.png' });
    assert.equal(png.contentType, 'png');

    const jpg = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/photo.jpg' });
    assert.equal(jpg.contentType, 'jpg');

    const icon = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/favicon.ico' });
    assert.equal(icon.contentType, 'favicon');

    const plain = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/notes.txt' });
    assert.equal(plain.contentType, 'plain');

    helpers.getStaticAsset = (_name, cb) => cb('err');
    const err = await invoke(routeHandlers.public, { method: 'get', trimmedPath: 'public/app.css' });
    assert.equal(err.statusCode, 500);
  } finally {
    helpers.getStaticAsset = originalGetStaticAsset;
  }
});

test('notFound handler returns 404', async () => {
  const notFound = await invoke(routeHandlers.notFound, { method: 'get' });
  assert.equal(notFound.statusCode, 404);
});
