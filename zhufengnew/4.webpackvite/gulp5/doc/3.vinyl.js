var File=require('vinyl')
// 虚拟文件对象  就是一个JS对象  用来描述一个文件的
var indexFile=new File({
  cwd:'/',//当前路径
  base:'/test/',//文件名
  path:'/test/index.js',//路径
  contents:new Buffer('zhufeng'),//文件内容
})

console.log(File.isVinyl(indexFile));//是否是vinyl
console.log(indexFile.isBuffer());//内容是否是Buffer
console.log(indexFile.isStream());//内容是否是Stream