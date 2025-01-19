// css文本代码  export default
const path=require('path')
function loader(source){
  // // source是css文本代码
  // let script=`
  // let style=document.createElement('style')
  // style.innerHTML=${JSON.stringify(source)}
  // document.head.appendChild(style);
  // `
  // return script
}

function normalize(str){
  return str.replace(/\\/g,'/')
}

loader.pitch=function(remainingRequest){
  // remainingRequest  D:\xuexishipin\exercise\zhu-fen-exercise\webpack\6.loader\loaders\less-loader.js!D:\xuexishipin\exercise\zhu-fen-exercise\webpack\6.loader\src\index.less
  // 参数中最后一个参数是文件路径
  console.log(remainingRequest,'remainingRequest')
  // 1.获取剩下的请求
  // 2.用!分割得到各个部分的绝对路径  前面是loader路径,后面是文件路径
  // 3.把路径从绝对路径变成相对于根目录的相对路径
  // 前面要加!!,使用行内的loader，不使用rule里面配置的loader，不然就会死循环
  // const request="!!"+remainingRequest.split("!").map((requestAbsPath)=>("./"+path.posix.relative(this.context,requestAbsPath)))
  const request="!!"+remainingRequest.split("!").map((requestAbsPath)=>("./"+path.posix.relative(normalize(this.context),normalize(requestAbsPath)))).join("!")
  
  console.log('request',this.context,request)
    // source是css文本代码
    let script=`
    let styleCss=require(${JSON.stringify(request)})
    let style=document.createElement('style')
    style.innerHTML=styleCss
    document.head.appendChild(style);
    `
    return script
}

module.exports=loader