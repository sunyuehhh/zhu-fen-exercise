// const b=require('./module-b')
// console.log(b)

// module.exports='module-a'


// 模块有自己的加载方式  原生模块  第三方模块  路径没有./ 或者 ../的就是原生模块或者第三方
// loadNativeModule  paths

// 1.如何引入的模块是一个内置模块  直接返回即可 从自己的目录递归向上查找是否存在模块
// 2.找到node_module  则会找到文件夹下同名的文件夹  看这个文件夹里的package.json  main.js
// 3.文件模块  通过./  ../引入 或者绝对路径引入的资源。如果文件不存在会尝试加.js  .json  .node
// 4.如果仍然未找到就报错了

// console.log(require('./a))//相对路径会先找文件 再去找文件夹  _resolveFilename

// 自己编写一个全局模块  需要先起一个包名(唯一的)
// 写一个bin作为入口指定的文件  （开发的时候我们想测试  可以采用npm link命令将包创建一个软链，链接到全局下）


// 版本管理
// major.minor.patch   主版本  小版本  补丁版本   semver规范

// 预发版本  做测试的   
// 1.0.0-alpha.4  内部测试的
// 1.0.0-beta.1  公开测试
// 1.0.0-rc.2  马上可以正式发布了

// 版本号标识  ^2.2.0  意味这只能是2  不能是1，3  ~1.1.0  限制了 只能是1.1开头的
// >=2.2.0   <=2.20   1.0.0-2.0.0

// script  设置执行脚本  设置后可以通过npm run 来执行脚本
// 全局包可以安装到本地(安装到本地的好处就是可以防止每个人安装的版本一致)
// 全局包安装到本地  在node_modules下生成.bin文件夹对应的命令
// 通过npm run 命令在执行命令前会将当前的node_module/.bin目录放置到环境变量中  执行后再移除

// npx  命令是npm5.2之后提供的  (命令不存在会安装使用再销毁)


// npm \ nvm \ nrm(.npmrc)
// 切换到官方源   nrm use npm
// 注册账号
// npm publish 




// node中和浏览器的差异

// node中的全局对象  global  global中的属性可以直接再任何模块下访问
// 有些人会把mysql的实例放在global上
// 有些属性不再global上也可以被访问  exports  require  module.exports  __dirname  __filename


// process
// Buffer
// setImmediate
// setTimeout

// process:
// platform  
// nextTick
// cwd
// env
// argv


const path=require('path')

// 我们编写的前端工具  需要做一些系统配置文件   可以通过平台来区分  系统文件存在哪里
console.log(process.platform)//darwin  mac ,window  win32
// cwd叫当前工作目录  会随着命令的执行位置而变化

console.log(process.cwd(),path.resolve());//等价方法   resolve方法就是根据cwd来解析的
console.log(__dirname)

// 不同的平台设置方式不一样  mac  export来设置  ，windows  下用set来进行设置
console.log(process.env) //区分环境变量
// 链接数据库   再本地路径要是localhost   生产环境是192.xxx.xxx.xxx  dotenv

console.log(require('dotenv').config())