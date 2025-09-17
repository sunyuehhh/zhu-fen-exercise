const path=require('path')
const DllReferencePlugin=require('webpack/lib/DllReferencePlugin')
module.exports={
  mode:'development',
  devtool:false,
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'bundle.js',
  },
  plugins:[
    new DllReferencePlugin({
      manifest:require('./dist/utils.manifest.json')
    })
  ]

}