const { Writable } = require('stream');

let resArr = [];

const mws = (d) => {
  return new Writable({
    objectMode: true,
    write(ch,enc,cb){
      d.push(ch)
      cb()
    }
  })
}

const ws = mws(resArr)

ws.on('finish', () => {console.log('finished?! ', resArr)})
ws.write('asdf')
ws.write(1234)
ws.write(false)
ws.write([1,2,3])
// ws.end('MUST CALL END!')
ws.end()