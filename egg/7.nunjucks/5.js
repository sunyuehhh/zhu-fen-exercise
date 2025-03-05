let nunjucks=require('nunjucks')
// 将模板字符串跟变量组合起来  将里面的变量替换掉
nunjucks.configure({autoescape:true});//自动转义
let result=nunjucks.renderString(
  `
  {%if score >=90 %}
    优秀
  {% elseif score >=80%}
  良好
  {% elseif score >=70%}
  中等
  {% elseif score >=60%}
  及格
  {% else %}
  不及格
  {% endif %}

  `,{score:55})
// >90 优秀 >80 良好 70 中等  >60 及格
console.log(result)