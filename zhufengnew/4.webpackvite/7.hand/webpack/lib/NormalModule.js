const path=require('path')
const types=require('babel-types')
const generate=require('babel-generator').default;
const traverse=require('babel-traverse').default;
const async=require('neo-async')
class NormalModule{
  constructor({name,context,rawRequest,resource,parser,moduleId,async}){
    this.name=name;
    this.context=context;
    this.rawRequest=rawRequest;
    this.resource=resource;
    this.parser=parser
    this.moduleId=moduleId||('./'+path.posix.relative(context,resource))
    // 此模块对应的源代码
    this._resource;
    // 此模块对应的AST抽象语法树
    this._ast;
    // 当前模块依赖的模块信息
    this.dependencies=[]
    // 当前模块依赖哪些异步模块  import(哪些模块)
    this.blocks=[]
    // 表示当前的模块是属于一个异步代码块  还是一个同步代码块
    this.async=async
  }

    /**
   * 编译本模块
   * @param {*} compilation 
   * @param {*} callback 
   */
  build(compilation,callback){
    this.doBuild(compilation,err=>{
      // 得到语法树
      this._ast=this.parser.parse(this._source)
      // callback()
      // 遍历语法树 找到里面的依赖进行收集依赖
      traverse(this._ast,{
        // 当遍历到CallExpression节点的时候  就会进入回调
        CallExpression:(nodePath)=>{
          let node=nodePath.node;//获取节点
          if(node.callee.name==='require'){//如果方法名是require方法的话
            // 把帆帆发名用require改成__webpack_require__
            node.callee.name='__webpack_require__'
            let moduleName=node.arguments[0].value;//模块的名称
            let depResource;
            if(moduleName.startsWith('.')){
              // 获取扩展名
            let extName=moduleName.split(path.posix.sep).pop().indexOf('.')==-1?'.js':''
            // 获取依赖模块(./src/title.js)的绝对路径  win \ linux /
            // C:\XXX\src\index.js
            depResource=path.posix.join(path.posix.dirname(this.resource),moduleName+extName)

            }else{
              // 如果说模块的名字是以.开头 说明是本地模块
              // 否则是一个第三方模块 也就是放在node_modules里的
              depResource=path.resolve(path.posix.join(this.context,'node_modules',moduleName))
              depResource=depResource.replace(/\\/g,'/');//把window里的\转成/

            }

            // 依赖的模块ID  ./+从根目录触发到依赖模块的绝对路径的相对路径
            // let depModuleId='./'+path.posix.relative(this.context,depResource)
            let depModuleId='.'+depResource.slice(this.context.length)
            // 把require模块路径从./title.js变成./src/title.js
            node.arguments=[types.stringLiteral(depModuleId)]
            this.dependencies.push({
              name:this.name,//main
              context:this.context,//根目录
              rawRequest:moduleName,//模块的相对路径 原始路径
              moduleId:depModuleId,//模块ID 它是一个相对于根目录的相对路径 以./开头
              resource:depResource,//依赖模块的绝对路径
            })


          //判断这个节点CallExpression它的callee是不是import类型
          }else if(types.isImport(node.callee)){
            let moduleName=node.arguments[0].value;//1.模块的名称 ./title.js
            // 2.获得了可能的扩展名
            let extName=moduleName.split(path.posix.sep).pop().indexOf('.')==-1?'.js':''
            // 3.获取依赖的模块和绝对路径
            let depResource=path.posix.join(path.posix.dirname(this.resource),moduleName+extName)
            // 4.依赖的模块ID ./+从根目录出发的绝对路径的相对路径 ./src/index.js
            let depModuleId='./'+path.posix.relative(this.context,depResource)
            // webpackChunkName:'title'
            let chunkName='0'
            if(Array.isArray(node.arguments[0].leadingComments)&&node.arguments[0].leadingComments?.length){
            let leadingComments=node.arguments[0].leadingComments[0].value
            let regexp=/webpackChunkName:\s*['"]([^'"]+)['"]/;
             chunkName=leadingComments.match(regexp)[1];

            }

            nodePath.replaceWithSourceString(`__webpack_require__.e("${chunkName}").
              then(__webpack_require__.t.bind(null,"${depModuleId}",7))`)

            this.blocks.push({
              context:this.context,
              entry:depModuleId,
              name:chunkName,
              async:true,//异步的代码块

            })


          }

        }
      })

      // 把转换后的语法树重新生成源代码
      let {code}=generate(this._ast)
      this._source=code
      // 循环构建每一个异步代码块 都构建完成才会代表当前的模块编译完成
      async.forEach(this.blocks,(block,done)=>{
        let {context,entry,name,async}=block
        compilation._addModuleChain(context,entry,name,async,done)

      },callback)
      // callback()

    })

  }


  /**
   * 1.读取模块的源代码
   * @param {*} compilation 
   * @param {*} callback 
   */
  doBuild(compilation,callback){
    this.getSource(compilation,(err,source)=>{
      // 把最原始的代码存放到当前模块的_source属性上
      this._source=source
      callback()

    })

  }


  getSource(compilation,callback){
    compilation.inputFileSystem.readFile(this.resource,'utf8',callback)

  }
}

module.exports=NormalModule