
const path=require('path')
class VueLoaderPlugin{
  apply(compiler){
    const rules=compiler.options.module.rules;
    // 在所有的模块解析规划的最前面加一个pitcher的规则 也就是添加一个rule
    const pitcher={
      loader:path.resolve('./pitcher'),
      resourceQuery:(query)=>{
        // 这个就相当于有vue的参数就进来了
        if(!query) return false
        let parsed=new URLSearchParams(query.slice(1))
        return parsed.get('vue')!=null

      }
    }

    const templateCompilerRule={
      loader:path.resolve('./templateLoader'),
      resourceQuery:(query)=>{
        if(!query) return false
        let parsed=new URLSearchParams(query.slice(1));
        return parsed.get('vue')!==null&&parsed.get('type')==='template'

      }

    }

    compiler.options.module.rules=[pitcher,templateCompilerRule,...rules]
  }
}


module.exports=VueLoaderPlugin