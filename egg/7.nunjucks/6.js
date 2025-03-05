let nunjucks=require('nunjucks')
// 将模板字符串跟变量组合起来  将里面的变量替换掉
nunjucks.configure({autoescape:true});//自动转义
let result=nunjucks.renderString(
  `
  <ul>
  {%for user in users%}
    <li data-id="{{user.id}}">{{loop.index0}}:{{user.name}}</li>
  {%endfor%}
  </ul>
  `
  ,{users:[{
  id:1,
  name:'zhufeng'
},{
  id:2,
  name:'zhufeng2'
}]})
console.log(result)