import { NodeTypes } from './ast';
import { CREATE_ELEMENT_BLOCK, CREATE_ELEMENT_VNODE, createCallExpression, createObjectExpression, createVNodeCall, FRAGMENT, OPEN_BLOCK, TO_DISPLAY_STRING } from './runtimeHelpers';


function transformExpression(node,context){
  if(node.type===NodeTypes.INTERPOLATION){
  console.log('表达式进入',node,context)

  node.content.content=`_ctx.${node.content.content}`

  return ()=>{



  }
  }

}

function transformElement(node,context){
  if(node.type===NodeTypes.ELEMENT){
  console.log('元素进入',node,context)

  return ()=>{
    console.log('元素推出')

    const properties=[]
    const props=node.props

    for(let i=0;i<props.length;i++){
      let {name,value}=props[i]

      properties.push({
        key:name,
        value:value.content
      })
    }

    const vnodeProps=properties.length>0?createObjectExpression(properties):null

    const vnodeTag=JSON.stringify(node.tag)

    // 儿子可能是  一个节点  或者是多个
    let vnodeChildren=null

    if(node.children.length===1){
      vnodeChildren=node.children[0]
    }else{
      if(node.children.length>1){
        vnodeChildren=node.children
      }
    }

    return (node.codegenNode=createVNodeCall(
      context,
      vnodeTag,
      vnodeProps,
      vnodeChildren

    ))

  }
  }
}

function isText(node){
  return node.type===NodeTypes.INTERPOLATION||node.type==NodeTypes.TEXT

}

function transformText(node,context){
  if(node.type===NodeTypes.TEXT||node.type===NodeTypes.INTERPOLATION){
  console.log('文本进入',node,context)
  

    return ()=>{
        let hasText=false

  const children=node.children;//先获取所有儿子
  let currentContainer;
  for(let i=0;i<children.length;i++){
    let child=children[i]
    if(isText(child)){
      // 是文本
      hasText=true

      for(let j=i+1;j<children.length;j++){
        const nextNode=children[j]
        if(isText(nextNode)){//要将两个节点合并再一起
          if(!currentContainer){
            // 用第一个节点作为拼接的节点 将下一个节点拼接上去即可
            currentContainer=children[i]={
              type:NodeTypes.COMPOUND_EXPRESSION,//组合表达式
              children:[child]
            }
          }


          currentContainer.children.push(nextNode)

          children.splice(j,1)

          j--

        }else{
          currentContainer=null
        }
      }
    }
  }

  if(!hasText||children.length==1){
    return 
  }


  // 对于文本我们需要采用createTextVnode 来进行方法生成
  for(let i=0;i<children.length;i++){
    const child=children[i]
    if(isText(child)||child.type==NodeTypes.COMPOUND_EXPRESSION){
      const callArgs=[]
      callArgs.push(child)

      if(child.type!==NodeTypes.TEXT){
        callArgs.push("PatchFlags.TEXT"+"");//createVnode(div,aa,1)
      }

      // 将此元素  进行处理  处理成 createTextVnode的格式
      children[i]={
        // type是ast的标识
        type:NodeTypes.TEXT_CALL,//生成文本调用
        content:child,
        // 生成代码  再transform中会生成一些额外的信息 用于代码生成ed
        codegenNode:createCallExpression(context,callArgs)
      }
    }
  }

      console.log('文本推出')
    
  }
  }
}

function createTransformContext(root){
  const context={
    currentNode:root,
    parent:null,

    helpers:new Map(),//用于存储用的方法
    helper(name){
      const count=context.helpers.get(name)||0
      context.helpers.set(name,count+1);
      return name

    },
    removeHelper(name){
      const count=context.helpers.get(name)
      const currentCount=count-1
      if(!currentCount){
        context.helpers.delete(name)
      }else{
        context.helpers.set(name,currentCount)
      }

    },
    nodeTransform:[
      transformExpression,
      transformElement,
      transformText,
    ]
  }

  return context

}

// vue2 中转化只做了标记  vue3中的patchFlags block处理
function traverseNode(node,context){
  console.log(node,context,'traverseNode')
  context.currentNode=node

  const transforms=context.nodeTransform;//获取所有的转化方法
  let exitFns=[]
  for(let i=0;i<transforms.length;i++){
    let exitFn=transforms[i](node,context)
    exitFn&&(exitFns.push(exitFn))

  }

  switch(node.type){
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      for(let i=0;i<node.children.length;i++){
        context.parent=node
        traverseNode(node.children[i],context)
      }

    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break
  }

  // 整个儿子执行完毕后  依次调用再推出函数
  let len=exitFns.length
  context.currentNode=node
  while(len--){
    exitFns[len]();
  }

}

function createRootCodegen(root,context){
  const {children}=root

  if(children.length==1){
    const child=children[0]

    if(child.type===NodeTypes.ELEMENT){
      root.codegenNode=child.codegenNode;//如果是元素 则直接用元素就可以了
      context.removeHelper(CREATE_ELEMENT_VNODE)
      context.helper(OPEN_BLOCK)
      context.helper(CREATE_ELEMENT_BLOCK)
      root.codegenNode.isBlock=true;//标记为block节点
    }else{
      root.codegenNode=child
    }
  }else{
    context.helper(OPEN_BLOCK)
    context.helper(CREATE_ELEMENT_BLOCK)

    root.codegenNode=createVNodeCall(
      context,
      context.helper(FRAGMENT),
      null,
      children
    )
  }

}

export function transform(root){
  // 可以将一直使用的东西  通过上下文存储  co的源码  遍历树
  const context=createTransformContext(root)

  // dom树遍历 只能采用深度遍历
  traverseNode(root,context)


  createRootCodegen(root,context)

  root.helpers=[...context.helpers.keys()]

}