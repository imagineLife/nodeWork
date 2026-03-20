function createLegacyRouter(handlers) {
  if (!handlers || typeof handlers !== 'object') {
    throw new TypeError('handlers object is required');
  }

  return {
    '': handlers.doIndex,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/menuItems': handlers.menuItems,
    'api/cart': handlers.cart,
    'api/charge': handlers.charge,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'menu': handlers.menu,
    'cart': handlers.cartView,
    'checkout': handlers.checkout,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'notFound': function(_data, callback) {
      callback(404);
    }
  };
}

module.exports = createLegacyRouter;
