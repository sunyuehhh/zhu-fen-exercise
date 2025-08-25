var modules={
  "./src/title.js":(module,exports,require)=>{
    require.r(exports)
    require.d(exports,{
      'default':()=>DEFAULT_EXPORT,
      'age':()=>age
    })

    const DEFAULT_EXPORT='title_name'
    const age='title_age'
  }
}

var cache={}
function require(moduleId){
  var cachedModule=cache[moduleId]
  if(cachedModule){
    return cachedModule.exports
  }

  var module=cache[moduleId]={exports:{}}
  modules[moduleId](module,module.exports,require)

  return module.exports

}



require.d=(exports,definition)=>{
  for(var key in definition){
    Object.defineProperty(exports,key,{
      get:definition[key]
    })
  }

}

require.r=(exports)=>{
  Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'})
  Object.defineProperty(exports,'__esModule',{value:true})

}



let title=require('./src/title.js')

console.log(title.default)
console.log(title.age)

