import { isString } from '@vue/shared';
import { NodeTypes } from './ast';
import {parser} from './parse'
import { CREATE_ELEMENT_BLOCK, CREATE_ELEMENT_VNODE, CREATE_TEXT, FRAGMENT, helpNameMap, OPEN_BLOCK, TO_DISPLAY_STRING } from './runtimeHelpers';
import { transform } from './transform';


function createCodegenContext(){
  const context={
    helper:(type)=>"_"+helpNameMap[type],
    code:``,//存储拼接后的代码
    push(code){
      context.code+=code;//拼接字符串

    },
    level:0,
    indent(){
      context.newLine(++context.level)

    },
    deindent(needNewLine=false){
      // 是否换行向内缩进  还是直接缩进
      if(!needNewLine){
        --context.level
      }else{
        context.newLine(--context.level)
      }

    },
    newLine(level=context.level){
      context.push('\n'+' '.repeat(level))

    }
  }

  return context

}


function genText(node,context){
  context.push(JSON.stringify(node.content))
}

function genFunctionPreamble(ast,context){
  // 放导入
  if(ast.helpers.length>0){
    context.push(
      `import {${ast.helpers
        .map((helper)=>`${helpNameMap[helper]} as _${helpNameMap[helper]}`)
        .join(",")
      }} from "vue"`
    )

    context.newLine()
  }


}


function genInterpolation(node,context){
  // 我们的 

  context.push(`${
    context.helper(TO_DISPLAY_STRING)
  }(`)
  genNode(node.content,context)
  context.push(')')

}

function genExpression(node,context){
  context.push(node.content)


}


function genList(list,context){
  // tag {} children

  for(let i=0;i<list.length;i++){
    let node=list[i]

    if(isString(node)){
      context.push(node)
    }else if(Array.isArray(node)){
      // 多个孩子
      genList(node,context)
    }else{
      // 可能是属性 也有可能是一个儿子
      genNode(node,context)
    }

    if(i<list.length-1){
      context.push(",")
    }
  }

}


function genVNodeCall(node,context){
  const {push,helper}=context
  const {tag,props,children,isBlock}=node

  if(isBlock){
    push(`(${helper(OPEN_BLOCK)}(),`)
  }

  if(isBlock){
    push(helper(CREATE_ELEMENT_BLOCK))
  }else{
    push(helper(CREATE_ELEMENT_VNODE))
  }

  push("(")

  // 标签  属性   儿子

  let list=[tag,props,children].filter(Boolean)
  // if(list.length>2){
      genList([tag,props,children].map((item)=>item||'undefined'),context)
  // }else{
  // genList([tag,props,children],context)
  // }

  push(")")

  if(isBlock){
    push(")")
  }

}


function genObjectExpression(node,context){
  // []=>{a:1,b:2}
  const {properties}=node
  const {push}=context

  if(!properties){
    return
  }

  push("{")
  for(let i=0;i<properties.length;i++){
    const {key,value}=properties[i]
    push(key)
    push(":")
    push(JSON.stringify(value))

    if(i<properties.length-1){
      push(",")
    }
  }

  push("}")
}


function genCallExpression(node,context){
  context.push(context.helper(CREATE_TEXT))
  context.push("(")
  genList(node.arguments,context)
  context.push(")");//createTextVnode("123")

}


function genCompoundExpression(node,context){
  // createTextVnode(aa+aa)
  for(let i=0;i<node.children.length;i++){
    const child=node.children[i]
    if(isString(child)){
      context.push(child)
    }else{
      // 文本  或者表达式
      genNode(child,context)
    }
  }
}


function genNode(node,context){
    if(typeof node==='symbol'){
      context.push(context.helper(FRAGMENT))
      return
    }

    switch (node.type){
    case NodeTypes.TEXT:
      genText(node,context)

      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node,context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node,context)
      break
    case NodeTypes.VNODE_CALL:
      genVNodeCall(node,context)
      break
    case NodeTypes.JS_OBJECT_EXPRESSION:
      genObjectExpression(node,context)
      break;
    case NodeTypes.ELEMENT:
      genNode(node.codegenNode,context)
      break
    case NodeTypes.TEXT_CALL:
      genNode(node.codegenNode,context)
      break
    case NodeTypes.JS_CACHE_EXPRESSION:
      genCallExpression(node.codegenNode,context)
      break
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node,context)
  }

}


function generate(ast){
  const context=createCodegenContext()

  genFunctionPreamble(ast,context)


  context.push(
    `export function (_ctx, _cache, $props, $setup, $data, $options){`
  )
  context.indent()

  context.push(`return `)

  if(ast.codegenNode){
    // 如果有codegen 用codegen
    genNode(ast.codegenNode,context)
  }else{
    context.push(null);//如果没有节点则直接null
  }


  context.newLine()
  context.push('}')

  console.log(context.code,'context.code')

  return context.code


}

export function compile(template){
  const ast= parser(template)

  console.log(ast,'ast')

  transform(ast);//对ast语法树进行转化   给ast节点是增加一些额外的信息  codegenNode 收集需要导入的方法


  // 代码生成
  generate(ast)

  return

}