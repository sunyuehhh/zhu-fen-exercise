import {parser} from './parse'
import { transform } from './transform';

export function compile(template){
  const ast= parser(template)

  console.log(ast,'ast')

  transform(ast);//对ast语法树进行转化   给ast节点是增加一些额外的信息  codegenNode 收集需要导入的方法


  // 代码生成

  return

}