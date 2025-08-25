const babel=require('@babel/core')
const path=require('path')
async function loaders(source){
  // 在loader里this其实是一个称为loaderContext的对象
  let options=this.getOptions()
  const {code}=await babel.transformAsync(source,options)

  return code


}


module.exports=loaders