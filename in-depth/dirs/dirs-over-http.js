const { createServer } = require('http')
const { Readable, Transform, pipeline } = require('stream')
const { opendirSync } = require('fs')
const PORT = 3000;
const createTransformFormatStream = () => {
  let syntax = '[\n'
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: false,
    transform (entry, enc, next) {
      next(null, `${syntax} "${entry.name}"`)
      syntax = ',\n'
    },
    final (cb) {
      this.push('\n]\n')
      cb()
    }
  })
}

function handlePipelineErr(err){
  if (err) console.error(err)
}

createServer((req, res) => {
  if (req.url !== '/') {
    res.statusCode = 404
    res.end('Not Found')
    return
  }
  const directoryStream = Readable.from(opendirSync(__dirname))
  const entryStream = createTransformFormatStream()
  res.setHeader('Content-Type', 'application/json')
  pipeline(directoryStream, entryStream, res, handlePipelineErr)
}).listen(PORT)


/*
  Use Browser
  localhost:3000
  shows dirs of this file
*/ 