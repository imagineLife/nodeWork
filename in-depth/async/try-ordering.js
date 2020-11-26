const print = (err, contents) => { 
  if (err) console.error(err)
  else console.log(contents )
}

const doOne = (cb) => {
  setTimeout(() => {
    cb(null, 'A')
  }, 500)
}

const doTwo = (cb) => {
  setTimeout(() => {
    cb(null, 'B')
  }, 250)
}

const doThree = (cb) => {
  setTimeout(() => {
    cb(null, 'C')
  }, 125)
}

function cb (_,letter){ console.log(letter)};

doOne(cb)
doTwo(cb)
doThree(cb)
