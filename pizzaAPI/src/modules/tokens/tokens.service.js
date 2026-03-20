const dataLib = require('../../../lib/data');
const helpers = require('../../../lib/helpers');

function checkForLengthAndType(data) {
  return typeof data === 'string' && data.trim().length > 0 ? data.trim() : false;
}

function isTokenId(data) {
  return typeof data === 'string' && data.trim().length === 19 ? data.trim() : false;
}

function isEmail(data) {
  return typeof data === 'string' && data.includes('@') && data.includes('.com') ? data.trim() : false;
}

function createTokensService(tokensRepo) {
  const service = {};

  service.post = (data, callback) => {
    const eml = isEmail(data.payload.email);
    const pw = checkForLengthAndType(data.payload.passWord);

    if (!eml || !pw) {
      callback(400, { Error: 'Missing email or pw' });
      return;
    }

    dataLib.read('users', eml, (err, userData) => {
      if (err || !userData) {
        callback(400, { Error: 'Couldnt find that user' });
        return;
      }

      const hashedPW = helpers.hash(pw);
      if (hashedPW !== userData.hashedPW) {
        callback(400, { Error: 'PW did not match the stored pw' });
        return;
      }

      const tokenId = helpers.createRandomString(20);
      const expDate = Date.now() + 1000 * 60 * 60;
      const tokenObj = {
        email: eml,
        tokenId,
        expires: expDate,
        stripeID: userData.stripeID || null
      };

      tokensRepo.create(tokenId, tokenObj, (createErr) => {
        if (createErr) {
          callback(500, { Error: 'Couldnt create new token' });
          return;
        }
        callback(200, tokenObj);
      });
    });
  };

  service.get = (data, callback) => {
    const id = isTokenId(data.queryStrObj.id);

    if (!id) {
      callback(400, { Error: 'Seems like incorrect token id' });
      return;
    }

    tokensRepo.read(id, (err, storedTokenData) => {
      if (err || !storedTokenData) {
        callback(404);
        return;
      }

      callback(200, storedTokenData);
    });
  };

  service.put = (data, callback) => {
    const id = isTokenId(data.payload.id);
    const extend = typeof data.payload.extend === 'boolean' && data.payload.extend === true;

    if (!id || extend !== true) {
      callback(400, { Error: 'missing id or extendTrueVal' });
      return;
    }

    tokensRepo.read(id, (err, tokenData) => {
      if (err || !tokenData) {
        callback(400, { Error: 'Specified token NOT recorded' });
        return;
      }

      if (!(tokenData.expires > Date.now())) {
        callback(400, { Error: 'The token has already expired & cannot be extended' });
        return;
      }

      tokenData.expires = Date.now() + 1000 * 60 * 60;

      tokensRepo.update(id, tokenData, (updateErr) => {
        if (updateErr) {
          callback(500, { Error: 'Couldnt update the token exp for some reason' });
          return;
        }
        callback(200);
      });
    });
  };

  service.delete = (data, callback) => {
    const id = isTokenId(data.queryStrObj.id);

    if (!id) {
      callback(400, { Error: 'Seems like Missing id field' });
      return;
    }

    tokensRepo.read(id, (err, storedTokenData) => {
      if (err || !storedTokenData) {
        callback(400, { Error: 'Couldnt Find token by id' });
        return;
      }

      tokensRepo.remove(id, (removeErr) => {
        if (removeErr) {
          callback(500, { Error: 'Couldnt delete this user for some odd reason' });
          return;
        }
        callback(200, { DELETED: 'Successfully' });
      });
    });
  };

  service.verifyTokenMatch = (tokenID, givenEmailAddr, callback) => {
    tokensRepo.read(tokenID, (err, storedTokenData) => {
      if (err || !storedTokenData) {
        callback(false);
        return;
      }

      if (storedTokenData.email === givenEmailAddr && storedTokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    });
  };

  return service;
}

module.exports = createTokensService;
