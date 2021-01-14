// Dependencies
const EventEmitter = require('events');
const { update } = require('./lib/async')
const { c } = require('./helpers');

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

  console.log(c.green, c.black,'Events are Registered', c.reset);
}

module.exports = { Ev, registerEventLoggers };