const Readable = require('./Readable')
const Writable = require('./Writable')

const {inherits}=require('util')

function Duplex(options){
  Readable.call(this,options)
  Writable.call(this,options)

}

inherits(Duplex,Readable)

const keys=Object.keys(Writable.prototype)
for(let v=0;v<keys.length;v++){
  const method=keys[v]
  Duplex.prototype[method]=Writable.prototype[method]
}

module.exports=Duplex