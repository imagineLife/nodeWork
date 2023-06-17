const routes = {
  session: {
    root: '/mySession',
    updateWithRandom: '/update/:randomString',
    updateWithKeyVal: '/keyVal/:myKey/:myVal',
    clear: '/clear',
    removeKeyVal: '/remove-key/:myKey'
  },
};

const cookie = {
  name: 'test-session',
  secret: 'generic-secret-string',
  age: 24 * 60 * 60 * 1000 // 1 day
}
module.exports = {
  routes,
  cookie
}