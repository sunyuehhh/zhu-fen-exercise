const EventEmitter=require('events')
const Stream = require('stream')

const {inherits}=require('util')
function Stream(options){
  this.options=options
  EventEmitter.call(this)
}


inherits(Stream,EventEmitter)