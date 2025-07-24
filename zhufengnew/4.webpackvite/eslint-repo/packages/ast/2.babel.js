const babel=require('@babel/core')
const types=require('@babel/types')

// const transformFunction=require('babel-plugin-transform-es2015-arrow-functions')

const transformFunction={
  visitor:{
    ArrowFunctionExpression(path){//path就是访问的路径  path->node
      let {node}=path
      node.type="FunctionExpression"

      hoistFunctionEvn(path)


      let body=node.body;//老节点中的  a+b

      if(!types.isBlockStatement(body)){
        node.body = types.blockStatement([types.returnStatement(body)])
      }

    }
  }
}

function getThisPath(path){
  let arr=[]
  path.traverse({
    ThisExpression(path){
      arr.push(path)

    }
  })

  return arr

}


function hoistFunctionEvn(path){
  const thisEnv=path.findParent((parent)=>((parent.isFunction()&&!parent.isArrowFunctionExpression())||parent.isProgram()))
  const bingingThis="_this";//var _this=this

  const thisPaths=getThisPath(path)

  // 1.修改当前路径中的this  变为_this
  thisPaths.forEach(path=>{
    // this->_this
    path.replaceWith(types.identifier(bingingThis))
  })

  thisEnv.scope.push({
    id:types.identifier(bingingThis),
    init:types.thisExpression()
  })
}

const code=`const sum=()=>a+b`

const result=babel.transform(code,{
  plugins:[transformFunction]
})

console.log(result.code)