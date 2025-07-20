let envPlugin={
  name:'env',//插件的名字
  // setup函数在每次BUILD API调用时都会运行一次
  setup(build){//设置函数


    // 使用添加的回调  onResolve 将在esbuild构建的每个模块中的每个导入路径上运行
    // 在编译每个模块的时候  会把模块的路径和此回调的filter上进行匹配  匹配不上则跳过此回调
    build.onResolve({filter:/^env$/},(onResolveArgs)=>{
      console.log(onResolveArgs,'onResolveArgs')

      return {
        external:false,//是否是外部模块  如果时外部的话不处理
        namespace:'env-namespace',//表示此模块属于env-namespace命名空间
        path:onResolveArgs.path//env解析得到的路径  在默认情况下  如果是普通的话  会返回普通模块文件系统中的绝对路径
      }

    })

    build.onLoad({filter:/^env$/,namespace:'env-namespace'},()=>{
      return {
        contents:'{"OS":"WindowNT"}',
        loader:'json'
      }

    })

  }
}




require('esbuild')
.build({
  entryPoints:['entry.js'],
  bundle:true,
  plugins:[envPlugin],
  loader:{
    '.js':'jsx'
  },
  outfile:'out.js'
}).catch(error=>{
  console.log(error,'error')
})