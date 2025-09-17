const path=require('path')
const DllPlugin=require('webpack/lib/DllPlugin')
module.exports={
  mode:'development',
  devtool:false,
  entry:{
    utils:['isArray','is-promise']
  },
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'utils.dll.js',//打包后的文件名
    library:'_dll_utils'//打包后的变量名  var _dll_utils=?
  },
  plugins:[
    new DllPlugin({
      name:'_dll_utils',
      path:path.join(__dirname,'dist','utils.manifest.json')
    })
  ]

}