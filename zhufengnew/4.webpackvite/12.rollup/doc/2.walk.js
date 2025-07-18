const acorn=require('acorn')
const sourceCode=`import $ from "jquery"`
const ast=acorn.parse(sourceCode,{
  locations:true,
  ranges:true,
  sourceType:"module",
  ecmaVersion:8
})

// 遍历语法树
ast.body.forEach((statement)=>{
  walk(statement,{
    enter(node){
      console.log('进入',node.type)
    },
    leave(node){
      console.log('离开',node.type)
    }
  })

})

function walk(astNode,{enter,leave}){
  visit(astNode,null,enter,leave)

}

function visit(node,parent,enter,leave){
  if(enter){
    enter(node,parent)
  }
  const keys=Object.keys(node).filter(key=>typeof node[key]==='object')
  keys.forEach(key=>{
    let value=node[key]
    if(Array.isArray(value)){
      value.forEach(val=>visit(val,node,enter,leave))
    }else{
      visit(value,node,enter,leave)
    }
  })

  if(leave){
    leave(node,parent)
  }

}