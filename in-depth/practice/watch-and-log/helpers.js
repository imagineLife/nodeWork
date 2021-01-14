function cString(txt){ return `\x1b[${txt}m` }
const c = {
  blue: cString(44),
  green: cString(42),
  white: cString(37),
  black: cString(30),
  reset: cString(0)
}

module.exports = {
  c
}