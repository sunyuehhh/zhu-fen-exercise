/**
 * 1.设置环境变量
 */


// 1.设置环境变量为生产环境
process.env.NODE_ENV='production'
const fs=require('fs-extra')

// 2.获取webpack的配置文件
const configFactory=require('../config/webpack.config')

const paths=require('../config/paths')
const webpack=require('webpack')
const chalk=require('chalk')

const config=configFactory('production')

// 3.如果build目录  不为空  要把build目录 清空
fs.emptyDirSync(paths.appBuild);
// 4.拷贝public下面的静态文件到build目录
copyPublicFolder()

// 编译
build()


function build(){
  // compiler是总的编译对象
  let compiler=webpack(config)
  // 开始编译
  compiler.run((err,stats)=>{
    console.log(err)
    console.log(chalk.green('Compiled successfully!'))

  })

}

function copyPublicFolder(){
  fs.copySync(paths.appPublic,paths.appBuild,{
    filter:file=>file!=paths.appHtml//index.html文件由插件编译处理 她不需要拷贝
  })
}