const webpack=require('./webpack')
const webpackConfig=require('./webpack.config')
const compiler=webpack(webpackConfig)
// 调用compiler的run方法开始启动编译
compiler.run((err,stats)=>{
  console.log(err)
  // stats代表统计结果的对象
  console.log(stats.toJson({
    files:true,//代表打包后生成的文件
    assets:true,//它是一个代码块到文件的对应关系
    chunks:true,//从入口模块出发  找到此入口模块依赖的模块 或者依赖的模块依赖的模块
    modules:true//打包的模块
  }))

})