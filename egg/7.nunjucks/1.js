let nunjucks=require('nunjucks')
// 将模板字符串跟变量组合起来  将里面的变量替换掉
nunjucks.configure({autoescape:true});//自动转义
let result=nunjucks.renderString(`hello {{name}}`,{name:'珠峰'})
console.log(result)