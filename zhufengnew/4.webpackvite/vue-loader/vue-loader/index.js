const compiler=require('vue/compiler-sfc')
const {stringifyRequest} =require('./utils')
const VueLoaderPlugin=require('./plugin')
const hash=require('hash-sum')
const select=require('./select')
function loader(source){
  const loaderContext=this;
  // resourcePath  资源文件的绝对路径
  // resourceQuery=资源的query 参数
  const {resourcePath,resourceQuery}=loaderContext
  // 现在写的是为了第三轮的执行
  const rawQuery=resourceQuery.slice(1)
  const incomingQuery=new URLSearchParams(rawQuery)
  const {descriptor}=compiler.parse(source)
  const id=hash(resourcePath);//后面在实现scoped css的会有用  .title[data-v-id='']
  if(incomingQuery.get('type')){
    return select.selectBlock(descriptor,id,loaderContext,incomingQuery)
  }
  const code=[]
  const {script}=descriptor
  if(script){
    const query=`?vue&type=script`
    const request=stringifyRequest(loaderContext,resourcePath+query)
    code.push(`import script from ${request}`)
  }
  
  code.push(`export default script`)

  if(descriptor.template){
    const query=`?vue&type=template&id=${id}`
    const request=stringifyRequest(loaderContext,resourcePath+query)
    code.push(`import {render} from ${request}`)
  }
  code.push(`script.render=render`)
  console.log(code.join('\n'),'!!!!!!!!!')
  return code.join('\n')
}


loader.VueLoaderPlugin=VueLoaderPlugin

module.exports=loader