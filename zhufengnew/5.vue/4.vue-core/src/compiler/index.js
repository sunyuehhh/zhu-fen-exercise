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
  const render=generate(ast)

  console.log(render,'render')






}