const { Transform } = require(`stream`)
const { scrypt } = require('crypto')

const SALT = 'andpepper';

const cts = () => {
  return new Transform({
    transform(ch,enc,cb){
      scrypt(ch, SALT, 32, (err, key) => {
        if (err) {
          console.log('scrypt err')
          console.log(err)
          cb(err)
          return
        }
        console.log('scrypt done')
        
        cb(null, key)
      })
    }
  })
}

const ts = cts()

// ts.write([1,2,3].toString())
ts.on('error',err => {
  console.log(`ERROR?!`)
  console.log(err)
  console.log('// - - - - - //')

})
ts.on('data', d => {
  console.log('data')
  console.log(d)
  
})

ts.write('animal')