let nunjucks=require('nunjucks')
let path=require('path')
// 第一个参数配置的是视图所在路径
nunjucks.configure(path.resolve('view'),{autoescape:true});//自动转义
let result=nunjucks.render('login.html',{name:'zhufeng'})
console.log(result)


