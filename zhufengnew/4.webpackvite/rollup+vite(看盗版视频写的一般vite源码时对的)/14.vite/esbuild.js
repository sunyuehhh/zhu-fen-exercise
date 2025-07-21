let envPlugin={
  name:'env',//插件的名字
  // 每次编译时都会执行依次
  setup(build){//设置函数
    // webpack resolveLoader   rollup resolve  它们都是在获取此模块的绝对路径
    // 使用添加的回调  onResolve将  在esbuild  构建的每个米快中的每个导入路径上运行
    // 在编译每个模块的时候，会用模块的路径和此回调的filter正则进行匹配  匹配上执行回调  
    // namespace  默认是file
    build.onResolve({filter:/^env$/,namespace:'file'},(onResolveArgs)=>{
      console.log(onResolveArgs,'onResolveArgs')

      return {
        external:false,//是否是外部模块,如果是外部的话不处理了
        namespace:'env-namespace',//表示此模块属于env-namespace命名空间
        path:onResolveArgs.path,//env  解析得到的路径    在默认情况下，如果是普通模块的话，会返回普通模块文件系统中的绝对路径

      }

    })

    build.onLoad({
      filter:/^env$/,
      namespace:'env-namespace'
    },()=>{
      return {
        contents:'{"OS":"windowNT"}',
        loader:'json'
      }
    })



  }
}





require('esbuild').build({
  entryPoints:['entry.js'],
  bundle:true,
  plugins:[envPlugin],
  outfile:'out.js'
}).catch((error)=>{
  console.log(error)

})

/**
 * 
 * onResolveArgs
 *path: 'env',
  importer: 'D:\\xuexishipin\\exercise\\zhu-fen-exercise\\rollup+vite\\14.vite\\entry.js',
  namespace: 'file',
  resolveDir: 'D:\\xuexishipin\\exercise\\zhu-fen-exercise\\rollup+vite\\14.vite',
  kind: 'import-statement',
  pluginData: undefined,
 
 */