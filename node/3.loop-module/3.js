const path=require('path')
const fs=require('fs')
const vm=require('vm')
function Module(id){
  this.id=id;
  this.exports={}

}

Module._extensions={
  '.js'(module){
    const content=fs.readFileSync(module.id,'utf8')
    const fn=vm.compileFunction(content,['exports','require','module','__filename','__dirname'])
    // this->module.exports
    const exports=module.exports
    let thisValue=exports
    let require=req
    let filename=module.id;
    let dirname=path.dirname(filename)
    Reflect.apply(fn,thisValue,[exports,require,module,filename,dirname

    ])

  },
  '.json'(module){
    const content=fs.readFileSync(module.id,'utf8')
    module.exports=JSON.parse(content)

  }
}

Module._resolveFilename=function(id){
  const filename=path.resolve(__dirname,id)
  if(fs.existsSync(filename)){
    return filename
  }

  const keys=Object.keys(Module._extensions)
  for(let i=0;i<keys.length;i++){
    const ext=keys[i]
    const filename=path.resolve(__dirname,id+ext)
    if(fs.existsSync(filename)){
      return filename
    }

  }

  throw new Error('cannot found module')

}

Module.prototype.load=function(){
  let ext=path.extname(this.id)
  Module._extensions[ext](this)
}
function req(id){
  const filename=Module._resolveFilename(id)
  console.log(filename,'filename')
  const module=new Module(filename)//这个对象里最重要的就是exports对象
  module.load()
  return module.exports;//导出这个对象

}


const a=req('./a.js')
console.log(a)