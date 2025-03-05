let nunjucks=require('nunjucks')
let path=require('path')
// 第一个参数配置的是视图所在路径
nunjucks.configure(path.resolve('view'),{autoescape:true});//自动转义
let result=nunjucks.render('users.html',{users:[{id:1,name:'zhufeng'},{id:2,name:'jiagou'}]})
console.log(result)


