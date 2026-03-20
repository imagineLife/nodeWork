const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const https = require('node:https');

const helpers = require('../lib/helpers');
const config = require('../lib/config');

function callNodeback(fn) {
  return new Promise((resolve, reject) => {
    fn((err, data, contentType) => {
      if (err) {
        return reject(err);
      }
      resolve({ data, contentType });
    });
  });
}

test('helpers utility primitives', () => {
  const hashed = helpers.hash('pizza');
  assert.equal(typeof hashed, 'string');
  assert.equal(hashed.length, 64);
  assert.equal(helpers.hash(''), false);

  assert.equal(helpers.isString('x'), true);
  assert.equal(helpers.isString(''), false);
  assert.equal(helpers.isLength([1, 2], 2), true);

  assert.deepEqual(helpers.parseJsonToObject('{"ok":true}'), { ok: true });
  assert.deepEqual(helpers.parseJsonToObject('not-json'), { error: 'nothing to do here' });

  const random = helpers.createRandomString(10);
  assert.equal(typeof random, 'string');
  assert.equal(random.length, 9);
  assert.equal(helpers.createRandomString(0), false);

  assert.equal(helpers.btoa('ab'), 'YWI=');
  assert.equal(helpers.btoa(Buffer.from('ab')), 'YWI=');
});

test('helpers.request resolves parsed json and raw fallback', async () => {
  const originalRequest = https.request;

  try {
    https.request = (_opts, cb) => {
      const req = new EventEmitter();
      req.write = () => {};
      req.end = () => {
        const res = new EventEmitter();
        res.setEncoding = () => {};
        cb(res);
        res.emit('data', '{"ok":true}');
        res.emit('end');
      };
      return req;
    };

    const parsed = await helpers.request({}, 'x');
    assert.deepEqual(parsed, { ok: true });

    https.request = (_opts, cb) => {
      const req = new EventEmitter();
      req.write = () => {};
      req.end = () => {
        const res = new EventEmitter();
        res.setEncoding = () => {};
        cb(res);
        res.emit('data', 'not-json');
        res.emit('end');
      };
      return req;
    };

    const fallback = await helpers.request({}, 'x');
    assert.deepEqual(fallback, { 'Request error': 'not-json' });
  } finally {
    https.request = originalRequest;
  }
});

test('helpers.request rejects on network error', async () => {
  const originalRequest = https.request;

  try {
    https.request = () => {
      const req = new EventEmitter();
      req.write = () => {};
      req.end = () => {
        req.emit('error', new Error('boom'));
      };
      return req;
    };

    await assert.rejects(
      () => helpers.request({}, 'x'),
      (err) => typeof err?.Error === 'string' && err.Error.includes('There was an error sending the request')
    );
  } finally {
    https.request = originalRequest;
  }
});

test('helpers template/rendering methods', async () => {
  const interpolated = helpers.interpolate('Hello {name} {global.appName}', { name: 'Jake' });
  assert.match(interpolated, /Hello Jake/);
  assert.match(interpolated, /Sall-ease Pizza/);

  const template = await callNodeback((cb) => helpers.getTemplate('index', {}, cb));
  assert.match(template.data, /Sal-ease Apizza/);

  await assert.rejects(() => callNodeback((cb) => helpers.getTemplate('', {}, cb)));
  await assert.rejects(() => callNodeback((cb) => helpers.getTemplate('not-a-template', {}, cb)));

  const wrapped = await callNodeback((cb) => helpers.addHeaderFooter('<p>Center</p>', {}, cb));
  assert.match(wrapped.data, /<p>Center<\/p>/);
  assert.match(wrapped.data, /<html>/);
  assert.match(wrapped.data, /<\/html>/);

  const staticAsset = await callNodeback((cb) => helpers.getStaticAsset('logo.png', cb));
  assert.ok(Buffer.isBuffer(staticAsset.data));
  assert.ok(staticAsset.data.length > 0);

  await assert.rejects(() => callNodeback((cb) => helpers.getStaticAsset('missing.file', cb)));
});

test('helpers.interpolate handles inherited keys and invalid input', () => {
  const originalGlobalTemplate = config.globalTemplate;
  const inheritedGlobal = { inheritedName: 'proto-value' };
  config.globalTemplate = Object.assign(Object.create(inheritedGlobal), {
    appName: 'Sall-ease Pizza'
  });

  try {
    const inheritedData = Object.assign(Object.create({ inherited: 'skip-me' }), {
      name: 'Casey'
    });

    const interpolated = helpers.interpolate(
      'Hello {name} {inherited} {global.inheritedName} {global.appName}',
      inheritedData
    );

    assert.match(interpolated, /Hello Casey/);
    assert.match(interpolated, /\{inherited\}/);
    assert.match(interpolated, /\{global.inheritedName\}/);
    assert.match(interpolated, /Sall-ease Pizza/);

    assert.equal(helpers.interpolate(null, null), '');
  } finally {
    config.globalTemplate = originalGlobalTemplate;
  }
});

test('helpers.getFrontend success and error branches', async () => {
  const okResponse = await new Promise((resolve) => {
    helpers.getFrontend('index', {}, (statusCode, payload, contentType) => {
      resolve({ statusCode, payload, contentType });
    });
  });
  assert.equal(okResponse.statusCode, 200);
  assert.equal(okResponse.contentType, 'html');
  assert.match(okResponse.payload, /Sal-ease Apizza/);

  const originalGetTemplate = helpers.getTemplate;
  try {
    helpers.getTemplate = (_view, _data, cb) => cb('err');
    const errResponse = await new Promise((resolve) => {
      helpers.getFrontend('index', {}, (statusCode, payload, contentType) => {
        resolve({ statusCode, payload, contentType });
      });
    });
    assert.equal(errResponse.statusCode, 500);
    assert.equal(errResponse.contentType, 'html');
  } finally {
    helpers.getTemplate = originalGetTemplate;
  }

  const originalAddHeaderFooter = helpers.addHeaderFooter;
  try {
    helpers.addHeaderFooter = (_str, _data, cb) => cb('err');
    const errResponse = await new Promise((resolve) => {
      helpers.getFrontend('index', {}, (statusCode, payload, contentType) => {
        resolve({ statusCode, payload, contentType });
      });
    });
    assert.equal(errResponse.statusCode, 500);
    assert.equal(errResponse.contentType, 'html');
  } finally {
    helpers.addHeaderFooter = originalAddHeaderFooter;
  }
});

test('helpers.checkForRecentAddition handles recent and old dates', () => {
  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  assert.equal(helpers.checkForRecentAddition(sixHoursAgo.toISOString()), true);
  assert.equal(helpers.checkForRecentAddition(threeDaysAgo.toISOString()), false);
});
