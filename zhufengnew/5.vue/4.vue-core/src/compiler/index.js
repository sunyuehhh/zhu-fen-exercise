import { parseHTML } from "./parse"
import { generate } from "./generate"

export function compileToFunction(template){
  // html模板 =>render函数
  // 1.需要将html代码转换成"ast"语法树  可以用ast树来描述语言本身

  // 虚拟dom  是用对象来描述节点的

  let ast=parseHTML(template)

   console.log(ast,'ast')

  //  2.优化i静态节点


  // 3.通过这棵树 重新生成的代码
  const code=generate(ast)

  // 4.将字符串变成函数  限制取值范围  通过with来进行取值  稍后调用render函数
  // 就可以通过改变this  让这个函数内部取到结果了
  let render=new Function(`with(this){return ${code}}`)


  console.log(render)

  return render






}