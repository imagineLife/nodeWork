const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const zlib = require('node:zlib');

const doCart = require('../lib/handlers/api/cart');
const doTokens = require('../lib/handlers/api/tokens');
const doUsers = require('../lib/handlers/api/users');
const doCharge = require('../lib/handlers/api/charge');
const routeHandlers = require('../lib/handlers');
const doMail = require('../lib/handlers/api/mail');
const dataLib = require('../lib/data');
const logsLib = require('../lib/logs');
const helpers = require('../lib/helpers');

function invokeNodeback(fn) {
  return new Promise((resolve) => {
    fn((...args) => resolve(args));
  });
}

function invokeHandler(handler, data) {
  return new Promise((resolve) => {
    handler(data, (statusCode, payload, contentType) => {
      resolve({ statusCode, payload, contentType });
    });
  });
}

function invokeCartMethod(method, data) {
  return new Promise((resolve) => {
    doCart[method](data, (statusCode, payload) => {
      resolve({ statusCode, payload });
    });
  });
}

test('cart handler branches: validation and downstream failures', async () => {
  const originalVerify = doTokens.verifyTokenMatch;
  const originalRead = dataLib.read;
  const originalCreate = dataLib.create;
  const originalUpdate = dataLib.update;
  const originalDeleteSync = dataLib.deleteSync;

  try {
    const badEmail = await invokeCartMethod('post', {
      headers: { token: 'x' },
      payload: { email: 'bad-email', cart: [] }
    });
    assert.equal(badEmail.statusCode, 500);

    const nonStringEmail = await invokeCartMethod('post', {
      headers: { token: 'x' },
      payload: { email: 42, cart: [] }
    });
    assert.equal(nonStringEmail.statusCode, 500);

    const missingDotComEmail = await invokeCartMethod('post', {
      headers: { token: 'x' },
      payload: { email: 'cart@example', cart: [] }
    });
    assert.equal(missingDotComEmail.statusCode, 500);

    const badCartPrice = await invokeCartMethod('post', {
      headers: { token: 'x' },
      payload: { email: 'cart@example.com', cart: [{ price: 0 }] }
    });
    assert.equal(badCartPrice.statusCode, 500);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(false);
    const invalidToken = await invokeCartMethod('post', {
      headers: { token: 'bad-token' },
      payload: { email: 'cart@example.com', cart: [{ price: 10 }] }
    });
    assert.equal(invalidToken.statusCode, 403);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.read = (_dir, _name, cb) => cb(false, { cartData: [] });
    const existingCart = await invokeCartMethod('post', {
      headers: { token: 'ok' },
      payload: { email: 'cart@example.com', cart: [{ price: 10 }] }
    });
    assert.equal(existingCart.statusCode, 400);

    dataLib.read = (_dir, _name, cb) => cb(true, undefined);
    dataLib.create = (_dir, _name, _obj, cb) => cb('create-failed');
    const createErr = await invokeCartMethod('post', {
      headers: { token: 'ok' },
      payload: { email: 'cart@example.com', cart: [{ price: 10 }] }
    });
    assert.equal(createErr.statusCode, 500);

    const putMissingEmail = await invokeCartMethod('put', {
      queryStrObj: {},
      payload: { cart: [{ price: 1 }] },
      headers: { token: 'x' }
    });
    assert.equal(putMissingEmail.statusCode, 400);

    const putMissingCart = await invokeCartMethod('put', {
      queryStrObj: { email: 'put@example.com' },
      payload: {},
      headers: { token: 'x' }
    });
    assert.equal(putMissingCart.statusCode, 400);

    const putBadCartData = await invokeCartMethod('put', {
      queryStrObj: { email: 'put@example.com' },
      payload: { cart: [{ price: 0 }] },
      headers: { token: 'x' }
    });
    assert.equal(putBadCartData.statusCode, 400);

    const putMissingToken = await invokeCartMethod('put', {
      queryStrObj: { email: 'put@example.com' },
      payload: { cart: [{ price: 10 }] },
      headers: {}
    });
    assert.equal(putMissingToken.statusCode, 404);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(false);
    const putInvalidToken = await invokeCartMethod('put', {
      queryStrObj: { email: 'put@example.com' },
      payload: { cart: [{ price: 10 }] },
      headers: { token: 'bad' }
    });
    assert.equal(putInvalidToken.statusCode, 403);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.read = (_dir, _name, cb) => cb('missing');
    const putReadError = await invokeCartMethod('put', {
      queryStrObj: { email: 'put@example.com' },
      payload: { cart: [{ price: 10 }] },
      headers: { token: 'ok' }
    });
    assert.equal(putReadError.statusCode, 400);

    dataLib.read = (_dir, _name, cb) => cb(false, { cartData: [] });
    dataLib.update = (_dir, _name, _obj, cb) => cb('update-failed');
    const putUpdateError = await invokeCartMethod('put', {
      queryStrObj: { email: 'put@example.com' },
      payload: { cart: [{ price: 10 }] },
      headers: { token: 'ok' }
    });
    assert.equal(putUpdateError.statusCode, 500);

    const getMissingEmail = await invokeCartMethod('get', {
      queryStrObj: {},
      headers: {}
    });
    assert.equal(getMissingEmail.statusCode, 400);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(false);
    const getInvalidToken = await invokeCartMethod('get', {
      queryStrObj: { email: 'get@example.com' },
      headers: { token: 'bad' }
    });
    assert.equal(getInvalidToken.statusCode, 403);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.read = (_dir, _name, cb) => cb(false, undefined);
    const getNotFound = await invokeCartMethod('get', {
      queryStrObj: { email: 'get@example.com' },
      headers: { token: 'ok' }
    });
    assert.equal(getNotFound.statusCode, 404);

    dataLib.read = (_dir, _name, cb) => cb('boom', { cartData: [{ id: 1 }] });
    const getReadError = await invokeCartMethod('get', {
      queryStrObj: { email: 'get@example.com' },
      headers: { token: 'ok' }
    });
    assert.equal(getReadError.statusCode, 404);

    const deleteMissingEmail = await invokeCartMethod('delete', {
      queryStrObj: {},
      headers: {}
    });
    assert.equal(deleteMissingEmail.statusCode, 400);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(false);
    const deleteInvalidToken = await invokeCartMethod('delete', {
      queryStrObj: { email: 'delete@example.com' },
      headers: { token: 'bad' }
    });
    assert.equal(deleteInvalidToken.statusCode, 403);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.deleteSync = () => {
      throw new Error('cannot delete');
    };
    const deleteError = await invokeCartMethod('delete', {
      queryStrObj: { email: 'delete@example.com' },
      headers: { token: 'ok' }
    });
    assert.equal(deleteError.statusCode, 500);
  } finally {
    doTokens.verifyTokenMatch = originalVerify;
    dataLib.read = originalRead;
    dataLib.create = originalCreate;
    dataLib.update = originalUpdate;
    dataLib.deleteSync = originalDeleteSync;
  }
});

test('data library branches: create/update/readLog/listFiles error paths', async () => {
  const originalFsOpen = fs.open;
  const originalFsWriteFile = fs.writeFile;
  const originalFsClose = fs.close;
  const originalFsFtruncate = fs.ftruncate;
  const originalFsReadFile = fs.readFile;
  const originalFsReaddir = fs.readdir;

  try {
    fs.open = (_path, _flags, cb) => cb(new Error('open-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.create('users', 'a', { x: 1 }, cb));
      assert.match(String(err), /Couldn't create a new file/);
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.writeFile = (_fd, _data, cb) => cb(new Error('write-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.create('users', 'a', { x: 1 }, cb));
      assert.equal(err, 'Error writing to new file');
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.writeFile = (_fd, _data, cb) => cb(false);
    fs.close = (_fd, cb) => cb(new Error('close-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.create('users', 'a', { x: 1 }, cb));
      assert.equal(err, 'error CLOSING new file');
    }

    fs.open = (_path, _flags, cb) => cb(new Error('open-failed'));
    {
      assert.throws(
        () => dataLib.update('users', 'a', { x: 1 }, () => {}),
        /calback is not defined/
      );
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.ftruncate = (_fd, cb) => cb(new Error('truncate-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.update('users', 'a', { x: 1 }, cb));
      assert.equal(err, 'Error truncating file');
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.ftruncate = (_fd, cb) => cb(false);
    fs.writeFile = (_fd, _data, cb) => cb(new Error('write-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.update('users', 'a', { x: 1 }, cb));
      assert.equal(err, 'Error Writing to existing file');
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.ftruncate = (_fd, cb) => cb(false);
    fs.writeFile = (_fd, _data, cb) => cb(false);
    fs.close = (_fd, cb) => cb(new Error('close-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.update('users', 'a', { x: 1 }, cb));
      assert.equal(err, 'Error CLOSING file');
    }

    fs.readFile = (_path, _enc, cb) => cb(new Error('read-log-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.readLog('charges', 'x', cb));
      assert.equal(err.message, 'read-log-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(false, '{"ok":true}');
    {
      const [err, parsed] = await invokeNodeback((cb) => dataLib.readLog('charges', 'x', cb));
      assert.equal(err, false);
      assert.deepEqual(parsed, { ok: true });
    }

    fs.readdir = (_path, cb) => cb(new Error('readdir-failed'));
    {
      const [err] = await invokeNodeback((cb) => dataLib.listFiles('.data', 'users', cb));
      assert.equal(err.message, 'readdir-failed');
    }

    fs.readdir = (_path, cb) => cb(false, ['first.json', 'second.json']);
    {
      const [err, files] = await invokeNodeback((cb) => dataLib.listFiles('.data', 'users', cb));
      assert.equal(err, false);
      assert.deepEqual(files, ['first', 'second']);
    }
  } finally {
    fs.open = originalFsOpen;
    fs.writeFile = originalFsWriteFile;
    fs.close = originalFsClose;
    fs.ftruncate = originalFsFtruncate;
    fs.readFile = originalFsReadFile;
    fs.readdir = originalFsReaddir;
  }
});

test('logs library branches: append/compress/decompress/truncate errors', async () => {
  const originalFsOpen = fs.open;
  const originalFsAppendFile = fs.appendFile;
  const originalFsClose = fs.close;
  const originalFsReadFile = fs.readFile;
  const originalFsWriteFile = fs.writeFile;
  const originalFsTruncate = fs.truncate;
  const originalFsReaddir = fs.readdir;
  const originalGzip = zlib.gzip;
  const originalUnzip = zlib.unzip;

  try {
    fs.open = (_path, _flags, cb) => cb(new Error('open-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.append('charges', 'one', 'x', cb));
      assert.equal(err, 'Couldnt open file for appending');
    }
    {
      const [err] = await invokeNodeback((cb) => logsLib.append(undefined, 'one', 'x', cb));
      assert.equal(err, 'Couldnt open file for appending');
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.appendFile = (_fd, _str, cb) => cb(new Error('append-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.append('charges', 'one', 'x', cb));
      assert.equal(err, 'error appending and closing the file');
    }

    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.appendFile = (_fd, _str, cb) => cb(false);
    fs.close = (_fd, cb) => cb(new Error('close-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.append('charges', 'one', 'x', cb));
      assert.equal(err, 'error closing file being appended');
    }

    fs.readdir = (_path, cb) => cb(new Error('list-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.listLogs('charges', true, cb));
      assert.equal(err.message, 'list-failed');
    }
    {
      const [err] = await invokeNodeback((cb) => logsLib.listLogs(undefined, false, cb));
      assert.equal(err.message, 'list-failed');
    }

    fs.readdir = (_path, cb) => cb(false, ['first.log', 'second.gz.b64', 'ignore.txt']);
    {
      const [err, names] = await invokeNodeback((cb) => logsLib.listLogs('charges', false, cb));
      assert.equal(err, false);
      assert.deepEqual(names, ['first']);
    }
    {
      const [err, names] = await invokeNodeback((cb) => logsLib.listLogs('charges', true, cb));
      assert.equal(err, false);
      assert.deepEqual(names, ['first', 'second']);
    }

    fs.readFile = (_path, _enc, cb) => cb(new Error('compress-read-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.compress('charges', 'src', 'dest', cb));
      assert.equal(err.message, 'compress-read-failed');
    }
    {
      const [err] = await invokeNodeback((cb) => logsLib.compress(undefined, 'src', 'dest', cb));
      assert.equal(err.message, 'compress-read-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(false, 'hello');
    zlib.gzip = (_input, cb) => cb(new Error('gzip-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.compress('charges', 'src', 'dest', cb));
      assert.equal(err.message, 'gzip-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(false, 'hello');
    zlib.gzip = (_input, cb) => cb(false, Buffer.from('zip'));
    fs.open = (_path, _flags, cb) => cb(new Error('open-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.compress('charges', 'src', 'dest', cb));
      assert.equal(err.message, 'open-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(false, 'hello');
    zlib.gzip = (_input, cb) => cb(false, Buffer.from('zip'));
    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.writeFile = (_fd, _str, cb) => cb(new Error('write-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.compress('charges', 'src', 'dest', cb));
      assert.equal(err.message, 'write-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(false, 'hello');
    zlib.gzip = (_input, cb) => cb(false, Buffer.from('zip'));
    fs.open = (_path, _flags, cb) => cb(false, 1);
    fs.writeFile = (_fd, _str, cb) => cb(false);
    fs.close = (_fd, cb) => cb(new Error('close-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.compress('charges', 'src', 'dest', cb));
      assert.equal(err.message, 'close-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(new Error('decompress-read-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.decompress('charges', 'src', cb));
      assert.equal(err.message, 'decompress-read-failed');
    }
    {
      const [err] = await invokeNodeback((cb) => logsLib.decompress(undefined, 'src', cb));
      assert.equal(err.message, 'decompress-read-failed');
    }

    fs.readFile = (_path, _enc, cb) => cb(false, Buffer.from('ok').toString('base64'));
    zlib.unzip = (_input, cb) => cb(new Error('unzip-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.decompress('charges', 'src', cb));
      assert.equal(err.message, 'unzip-failed');
    }

    fs.truncate = (_path, _len, cb) => cb(new Error('truncate-failed'));
    {
      const [err] = await invokeNodeback((cb) => logsLib.truncate('charges', 'src', cb));
      assert.equal(err.message, 'truncate-failed');
    }
    {
      const [err] = await invokeNodeback((cb) => logsLib.truncate(undefined, 'src', cb));
      assert.equal(err.message, 'truncate-failed');
    }

    fs.truncate = (_path, _len, cb) => cb(false);
    {
      const [err] = await invokeNodeback((cb) => logsLib.truncate('charges', 'src', cb));
      assert.equal(err, false);
    }
  } finally {
    fs.open = originalFsOpen;
    fs.appendFile = originalFsAppendFile;
    fs.close = originalFsClose;
    fs.readFile = originalFsReadFile;
    fs.writeFile = originalFsWriteFile;
    fs.truncate = originalFsTruncate;
    fs.readdir = originalFsReaddir;
    zlib.gzip = originalGzip;
    zlib.unzip = originalUnzip;
  }
});

test('tokens and users handlers cover persistence failure branches', async () => {
  const originalRead = dataLib.read;
  const originalCreate = dataLib.create;
  const originalUpdate = dataLib.update;
  const originalDelete = dataLib.delete;
  const originalHash = helpers.hash;
  const originalRandom = helpers.createRandomString;
  const originalVerify = doTokens.verifyTokenMatch;

  try {
    dataLib.read = (_dir, _name, cb) => cb(false, { hashedPW: 'hash', stripeID: null });
    helpers.hash = () => 'hash';
    helpers.createRandomString = () => '1234567890123456789';
    dataLib.create = (_dir, _name, _obj, cb) => cb('create-failed');
    const tokenCreateErr = await invokeHandler(doTokens.post, {
      payload: { email: 'branch@example.com', passWord: 'secret' }
    });
    assert.equal(tokenCreateErr.statusCode, 500);

    let createdTokenObj;
    dataLib.read = (_dir, _name, cb) => cb(false, { hashedPW: 'hash', stripeID: 'cus_123' });
    dataLib.create = (_dir, _name, obj, cb) => {
      createdTokenObj = obj;
      cb(false);
    };
    const tokenCreateOk = await invokeHandler(doTokens.post, {
      payload: { email: 'branch@example.com', passWord: 'secret' }
    });
    assert.equal(tokenCreateOk.statusCode, 200);
    assert.equal(createdTokenObj.stripeID, 'cus_123');

    dataLib.read = (_dir, _name, cb) => cb(false, { tokenId: '1234567890123456789', email: 'branch@example.com' });
    const tokenGetOk = await invokeHandler(doTokens.get, {
      queryStrObj: { id: '1234567890123456789' }
    });
    assert.equal(tokenGetOk.statusCode, 200);

    dataLib.read = (_dir, _name, cb) => cb(false, { expires: Date.now() + 1000, email: 'branch@example.com' });
    dataLib.update = (_dir, _name, _obj, cb) => cb(false);
    const tokenPutOk = await invokeHandler(doTokens.put, {
      payload: { id: '1234567890123456789', extend: true }
    });
    assert.equal(tokenPutOk.statusCode, 200);

    dataLib.read = (_dir, _name, cb) => cb(false, { expires: Date.now() + 1000, email: 'branch@example.com' });
    dataLib.update = (_dir, _name, _obj, cb) => cb('update-failed');
    const tokenPutErr = await invokeHandler(doTokens.put, {
      payload: { id: '1234567890123456789', extend: true }
    });
    assert.equal(tokenPutErr.statusCode, 500);

    dataLib.read = (_dir, _name, cb) => cb(false, { tokenId: '1234567890123456789' });
    dataLib.delete = (_dir, _name, cb) => cb(false);
    const tokenDeleteOk = await invokeHandler(doTokens.delete, {
      queryStrObj: { id: '1234567890123456789' }
    });
    assert.equal(tokenDeleteOk.statusCode, 200);

    dataLib.delete = (_dir, _name, cb) => cb('delete-failed');
    const tokenDeleteErr = await invokeHandler(doTokens.delete, {
      queryStrObj: { id: '1234567890123456789' }
    });
    assert.equal(tokenDeleteErr.statusCode, 500);

    dataLib.read = (_dir, _name, cb) => cb(false, {
      email: 'different@example.com',
      expires: Date.now() + 1000
    });
    const tokenMismatch = await new Promise((resolve) => {
      doTokens.verifyTokenMatch('1234567890123456789', 'branch@example.com', (ok) => resolve(ok));
    });
    assert.equal(tokenMismatch, false);

    dataLib.read = (_dir, _name, cb) => cb(new Error('missing-user'));
    helpers.hash = () => false;
    const userHashErr = await invokeHandler(doUsers.post, {
      payload: {
        firstName: 'A',
        lastName: 'B',
        email: 'branch@example.com',
        address: '123 Main',
        passWord: 'secret',
        tosAgreement: true
      }
    });
    assert.equal(userHashErr.statusCode, 500);

    helpers.hash = () => 'hash';
    dataLib.create = (_dir, _name, _obj, cb) => cb('create-failed');
    const userCreateErr = await invokeHandler(doUsers.post, {
      payload: {
        firstName: 'A',
        lastName: 'B',
        email: 'branch@example.com',
        address: '123 Main',
        passWord: 'secret',
        tosAgreement: true
      }
    });
    assert.equal(userCreateErr.statusCode, 500);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.read = (_dir, _name, cb) => cb(new Error('read-failed'), undefined);
    const userPutReadErr = await invokeHandler(doUsers.put, {
      queryStrObj: { email: 'branch@example.com' },
      payload: { firstName: 'Next' },
      headers: { token: 'ok' }
    });
    assert.equal(userPutReadErr.statusCode, 400);

    dataLib.read = (_dir, _name, cb) => cb(false, {
      firstName: 'A',
      lastName: 'B',
      hashedPW: 'hash'
    });
    dataLib.update = (_dir, _name, _obj, cb) => cb('update-failed');
    const userPutUpdateErr = await invokeHandler(doUsers.put, {
      queryStrObj: { email: 'branch@example.com' },
      payload: { lastName: 'Updated' },
      headers: { token: 'ok' }
    });
    assert.equal(userPutUpdateErr.statusCode, 500);

    dataLib.read = (_dir, _name, cb) => cb(false, { firstName: 'A', lastName: 'B' });
    dataLib.update = (_dir, _name, _obj, cb) => cb(false);
    const userPatchOk = await invokeHandler(doUsers.patch, {
      email: 'branch@example.com',
      firstName: 'Patched'
    });
    assert.equal(userPatchOk.statusCode, 200);

    dataLib.update = (_dir, _name, _obj, cb) => cb('update-failed');
    const userPatchErr = await invokeHandler(doUsers.patch, {
      email: 'branch@example.com',
      firstName: 'Patched'
    });
    assert.equal(userPatchErr.statusCode, 500);

    dataLib.read = (_dir, _name, cb) => cb(false, undefined);
    const userGetNotFound = await invokeHandler(doUsers.get, {
      queryStrObj: { email: 'branch@example.com' },
      headers: { token: 'ok' }
    });
    assert.equal(userGetNotFound.statusCode, 404);

    dataLib.read = (_dir, _name, cb) => cb(new Error('boom'), {
      firstName: 'A',
      lastName: 'B',
      hashedPW: 'hash'
    });
    const userGetErr = await invokeHandler(doUsers.get, {
      queryStrObj: { email: 'branch@example.com' },
      headers: { token: 'ok' }
    });
    assert.equal(userGetErr.statusCode, 500);

    dataLib.read = (_dir, _name, cb) => cb(false, { firstName: 'A' });
    dataLib.delete = (_dir, _name, cb) => cb('delete-failed');
    const userDeleteErr = await invokeHandler(doUsers.delete, {
      queryStrObj: { email: 'branch@example.com' },
      headers: { token: 'ok' }
    });
    assert.equal(userDeleteErr.statusCode, 500);
  } finally {
    dataLib.read = originalRead;
    dataLib.create = originalCreate;
    dataLib.update = originalUpdate;
    dataLib.delete = originalDelete;
    helpers.hash = originalHash;
    helpers.createRandomString = originalRandom;
    doTokens.verifyTokenMatch = originalVerify;
  }
});

test('charge handler covers sync-catch and customer creation fallback branches', async () => {
  const originalMakeStripeReq = doCharge.makeStripeReq;
  const originalPrepChargeReqStr = doCharge.prepChargeReqStr;
  const originalVerify = doTokens.verifyTokenMatch;
  const originalRead = dataLib.read;
  const originalMailSend = doMail.send;
  const originalLogsAppend = logsLib.append;
  const originalUserPatch = doUsers.patch;

  try {
    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.read = (_dir, _name, cb) => cb(false, {
      cartData: [{ price: 10, count: 1 }]
    });
    doUsers.patch = (_payload, cb) => cb(200);

    doCharge.makeStripeReq = () => {
      throw new Error('sync-create-customer-fail');
    };
    const createCustomerCatch = await invokeHandler(doCharge.post, {
      headers: { token: 'ok' },
      payload: { email: 'branch@example.com' }
    });
    assert.equal(createCustomerCatch.statusCode, 400);
    assert.equal(createCustomerCatch.payload.Error, 'Could not create a new customer');

    doCharge.makeStripeReq = originalMakeStripeReq;
    const payloadWithThrowingStripeId = { email: 'branch@example.com' };
    Object.defineProperty(payloadWithThrowingStripeId, 'stripeID', {
      get() {
        throw new Error('no-customer');
      }
    });
    const noCustomerCatch = await invokeHandler(doCharge.post, {
      headers: { token: 'ok' },
      payload: payloadWithThrowingStripeId
    });
    assert.equal(noCustomerCatch.statusCode, 400);
    assert.equal(noCustomerCatch.payload.Error, 'No Customer present');

    doCharge.makeStripeReq = async () => ({ id: 'ch_123' });
    doMail.send = async () => ({ id: 'mail_123' });
    logsLib.append = (_dir, _name, _line, cb) => cb('append-failed');
    const appendErrButSuccess = await new Promise((resolve) => {
      doCharge.chargeStripeCustomer(
        { path: '/x', method: 'post' },
        { cartTotal: 1000, source: { customer: 'cus_123' } },
        {
          logFileName: 'branch-test',
          logString: '{"ok":true}',
          callback: (statusCode, payload) => resolve({ statusCode, payload })
        }
      );
    });
    assert.equal(appendErrButSuccess.statusCode, 200);

    doCharge.prepChargeReqStr = () => 'amount=1000&currency=usd';
    doCharge.makeStripeReq = () => {
      throw new Error('sync-charge-failure');
    };

    const res = await new Promise((resolve) => {
      doCharge.chargeStripeCustomer(
        { path: '/x', method: 'post' },
        { cartTotal: 1000, source: { customer: 'cus_123' } },
        {
          logFileName: 'branch-test',
          logString: '{"ok":true}',
          callback: (statusCode, payload) => resolve({ statusCode, payload })
        }
      );
    });

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.Error, 'Could not charge');
  } finally {
    doCharge.makeStripeReq = originalMakeStripeReq;
    doCharge.prepChargeReqStr = originalPrepChargeReqStr;
    doTokens.verifyTokenMatch = originalVerify;
    dataLib.read = originalRead;
    doMail.send = originalMailSend;
    logsLib.append = originalLogsAppend;
    doUsers.patch = originalUserPatch;
  }
});

test('menuItems, mail, and helper edge branches', async () => {
  const originalVerify = doTokens.verifyTokenMatch;
  const originalReadSync = dataLib.readSync;
  const originalRequest = helpers.request;
  const originalGetTemplate = helpers.getTemplate;

  try {
    const missingToken = await invokeHandler(routeHandlers.menuItems, {
      method: 'get',
      queryStrObj: { email: 'menu@example.com' },
      headers: {},
      payload: {},
      trimmedPath: ''
    });
    assert.equal(missingToken.statusCode, 400);

    const invalidEmailShape = await invokeHandler(routeHandlers.menuItems, {
      method: 'get',
      queryStrObj: { email: 'menu@example' },
      headers: { token: 'ok' },
      payload: {},
      trimmedPath: ''
    });
    assert.equal(invalidEmailShape.statusCode, 400);

    doTokens.verifyTokenMatch = (_token, _email, cb) => cb(true);
    dataLib.readSync = () => {
      const err = new Error('boom');
      err.code = 'EFAIL';
      throw err;
    };
    const readSyncError = await invokeHandler(routeHandlers.menuItems, {
      method: 'get',
      queryStrObj: { email: 'menu@example.com' },
      headers: { token: 'ok' },
      payload: {},
      trimmedPath: ''
    });
    assert.equal(readSyncError.statusCode, 403);
    assert.equal(readSyncError.payload.Error, 'EFAIL');

    helpers.request = async () => {
      throw new Error('mail-down');
    };
    await assert.rejects(() => doMail.send({
      from: 'from@example.com',
      to: 'to@example.com',
      subject: 'subject',
      text: 'hello'
    }));

    const invalidFileNameError = await new Promise((resolve) => {
      helpers.getStaticAsset('', (err) => resolve(err));
    });
    assert.equal(invalidFileNameError, 'Valid filename was not specified');

    helpers.getTemplate = (templateName, _data, cb) => {
      if (templateName === '_header') {
        return cb(false, '<header>');
      }
      if (templateName === '_footer') {
        return cb('no footer');
      }
      return cb(false, '<body>');
    };
    const footerError = await new Promise((resolve) => {
      helpers.addHeaderFooter('body', {}, (err) => resolve(err));
    });
    assert.equal(footerError, "Couldn't find footer template");
  } finally {
    doTokens.verifyTokenMatch = originalVerify;
    dataLib.readSync = originalReadSync;
    helpers.request = originalRequest;
    helpers.getTemplate = originalGetTemplate;
  }
});
