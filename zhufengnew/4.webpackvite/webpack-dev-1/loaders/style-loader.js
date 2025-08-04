

function loader(source){
  // 我们可以在style-loader中导出一个脚本
  let str=`
  let style=document.createElement('style')
  style.innerHTML=${JSON.stringify(source)}
  document.head.appendChild(style)
  `

  return str

}



// 在style-loader上写了pitch
loader.pitch=function(remainingRequest){//剩余的请求


}

module.exports=loader