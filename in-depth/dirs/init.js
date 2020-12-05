'use strict'
const { readdirSync, readdir } = require('fs')
const { readdir: readdirProm } = require('fs').promises

// SYNCHRONOUS
try { 
  console.log('sync', readdirSync(__dirname))
} catch (err) {
  console.error(err)
}

function handleReadCB(err, files){
  if (err) {
    console.error(err)
    return
  }
  console.log('callback', files)
}

// callbacks
readdir(__dirname, handleReadCB)

// promises
async function run () {
  const files = await readdirProm(__dirname)
  console.log('promise', files)
}

run().catch((err) => {
  console.error(err)
})