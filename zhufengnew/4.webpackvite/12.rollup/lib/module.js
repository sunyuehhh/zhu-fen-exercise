const MagicString=require('magic-string')
const {parse}=require('acorn')
const analyse=require('./ast/analyse')
const { hasOwnProperty } = require('./utils')
const SYSTEM_VARS=['console','log']


class Module{

  constructor({code,path,bundle}){
    this.code=new MagicString(code)
    this.path=path
    this.bundle=bundle

    this.ast=parse(code,{
      ecmaVersion:8,
      sourceType:'module'
    })

    // 存本模块内导入哪些变量
    this.imports={}
    // 存放本模块中导出哪些变量
    this.exports={}
    // 存放本模块的顶级变量的定义语句时哪条
    this.definitions={}

    // 存放变量修改语句
    this.modifications={}


    // 重命名的变量
    this.canonicalName={}

    // 分析语法树
    analyse(this.ast,this.code,this)

    // 导入
    console.log('this.imports',this.imports)
    // 定义顶级变量的语句
    console.log('this.definitions',this.definitions)

  }

  expandAllStatement(){
    let allStatements=[]
    this.ast.body.forEach(statement=>{
      if(statement.type==='ImportDeclaration') return
      // 默认情况下我们不包含所有的变量声明语句
      if(statement.type==='VariableDeclaration') return
      let statements=this.expandStatement(statement)
      allStatements.push(...statements)
    })

    return allStatements
  }

  expandStatement(statement){
    statement._included=true
    let result=[]
    // 找到此语句使用的变量  把这些变量的定义语句取出来  放到result数组中
    const _dependsOn=Object.keys(statement._dependsOn)
    _dependsOn.forEach(name=>{
      // 找到此变量的定于语句 添加到结果里
      let definitions=this.define(name)
      result.push(...definitions)
    })
    result.push(statement)
    // 还要找到此语句定义的变量  把此变量对应的修改语句也包含进来
    const defines=Object.keys(statement._defines)
    defines.forEach(name=>{
      const modifications=hasOwnProperty(this.modifications,name)&&this.modifications[name]
      if(modifications){
        modifications.forEach(modification=>{
          if(!modification._included){
            let statements=this.expandStatement(modification)
            result.push(...statements)
          }
        })
      }
    })
    return result
  }

  define(name){
    // 区分此变量时函数内自己声明的 还是外部导入的
    if(hasOwnProperty(this.imports,name)){
      // 获取是从哪个模块引入的哪个变量
      const {source,importName}=this.imports[name]
      // 获取导入的模块  source相对于当前模块路径的相对路径  path是当前模块的绝对路径
      const importedModule=this.bundle.fetchModule(source,this.path)
      const {localName}=importedModule.exports[importName]

      return importedModule.define(localName)

    }else{
      // 如果非导入模块  是本地模块的话  获取此变量的变量定义语句
      let statement=this.definitions[name]
      if(statement){
        if(statement._included){
          return []
        }else{
          return this.expandAllStatement(statement)
        }
      }else{
        if(SYSTEM_VARS.includes(name)){
          return []
        }else{
          throw new Error(`变量${name}既没有从外部导入，也灭有再当前的模块内声明`)
        }
      }


    }

  }

  rename(name,replacement){
    this.canonicalName[name]=replacement

  }

  getCanonicalName(name){
    return this.canonicalName[name]||name

  }

}


module.exports=Module