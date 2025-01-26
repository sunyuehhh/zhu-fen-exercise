import babel from '@babel/core'
import {createFilter} from 'rollup-pluginutils'
function babelPlugin(pluginOptions){
  const {include,exclude,extensions}=pluginOptions
  // (js|jsx|ts)$
  const extensionsRegExp=new RegExp(`(${extensions.join("|")})$`)
  const useDefinedFilter= createFilter(include,exclude)
  const filter=id=>extensionsRegExp.test(id)&&useDefinedFilter(id)
  return {
    name:'babel',
   async transform(code,id){  //类似于webpack的loader
    // 如果过滤没有通过，就不需要处理
    if(!filter(id))  return null
    return await babel.transformAsync(code,pluginOptions)
   } 
  }
}

export default babelPlugin