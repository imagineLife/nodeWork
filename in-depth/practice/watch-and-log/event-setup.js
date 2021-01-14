// Dependencies
const EventEmitter = require('events');
const { update } = require('./lib/async')
/*
  Setup Event-Manager
*/ 
const Ev = new EventEmitter()

function logObj(action,file){
  return {
    date: new Date(),
    action,
    file
  }
}

function registerEventLoggers(logFile, filesSet){
  Ev.on('file-created', async function(file){
    filesSet.add(file)
    update(logFile, logObj('file-created',file))
  })

  Ev.on('file-deleted',function(file){
    filesSet.delete(file)
    update(logFile, logObj('file-deleted',file))
  })
}

module.exports = { Ev, registerEventLoggers };