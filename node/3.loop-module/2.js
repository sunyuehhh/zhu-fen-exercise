// 如果不带路径  会被识别成原生模块或者第三方模块
// 内部会自动帮我们添加  .js后缀   .json 后缀
// 同步导入模块
const r=require('./a')

console.log(r,'r')


const path=require('path')

console.log(path.join('a','b'))//简单拼接

console.log(path.join(__dirname,'a','b','/'));//__dirname是当前文件的绝对路径

console.log(path.resolve(__dirname,'a','b','/'));//resolve会解析出一个绝对路径  resolve会以当前执行路径作为解析路径

// join!==resolve 在一定的场景下join和resolve没有区别  遇到/的时候只能用join不能用resolve

console.log(path.extname('a.min.js'))//获取扩展名

const fs=require('fs')

// 读取文件  文件不存在会发生异常
const result=fs.readFileSync(path.resolve(__dirname,'test.md'),'utf8')
console.log(result,'result')


// eval  隔离效果没有  性能差
// new Function
const vm=require('vm')
vm.runInThisContext('console.log(a)');//沙箱就是一个干净的不受外界印象的盒子
