const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const CONFIG_PATH = path.join(__dirname, '../lib/config.js');

function loadConfigWithNodeEnv(value) {
  const previousNodeEnv = process.env.NODE_ENV;

  if (typeof value === 'undefined') {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = value;
  }

  delete require.cache[require.resolve(CONFIG_PATH)];
  const config = require(CONFIG_PATH);

  if (typeof previousNodeEnv === 'undefined') {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = previousNodeEnv;
  }

  delete require.cache[require.resolve(CONFIG_PATH)];
  return config;
}

test('config exports staging when NODE_ENV is missing', () => {
  const config = loadConfigWithNodeEnv(undefined);

  assert.equal(config.friendlyEnvName, 'staging');
  assert.equal(config.httpPort, 3000);
  assert.equal(config.httpsPort, 3001);
});

test('config exports staging when NODE_ENV is unknown', () => {
  const config = loadConfigWithNodeEnv('qa');

  assert.equal(config.friendlyEnvName, 'staging');
  assert.equal(config.httpPort, 3000);
  assert.equal(config.httpsPort, 3001);
});

test('config exports production when NODE_ENV matches prod (case-insensitive)', () => {
  const config = loadConfigWithNodeEnv('PrOd');

  assert.equal(config.friendlyEnvName, 'production');
  assert.equal(config.httpPort, 5000);
  assert.equal(config.httpsPort, 5001);
});
