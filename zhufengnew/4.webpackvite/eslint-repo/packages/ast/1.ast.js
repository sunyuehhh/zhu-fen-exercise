const esprima=require('esprima')
const estraverse=require('estraverse')
const escodegen=require('escodegen')

let code=`function a(){}`;

// 1.就是将我们的代码转换成ast语法树
const ast=esprima.parseScript(code)



estraverse.traverse(ast,{
  enter(node){//Program  ->  FunctionDeclaration -> Identifier
    console.log('enter:'+node.type)
    if(node.type==='FunctionDeclaration'){
      node.id.name='ast'
    }

  },
  leave(node){
    console.log('enter:',node.type)

  }
})

console.log(escodegen.generate(ast))

// es6->es5语法  典型的语法转化  将箭头函数转换成普通函数


