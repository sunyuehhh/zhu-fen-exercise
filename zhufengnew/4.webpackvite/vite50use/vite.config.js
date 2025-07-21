const path=require('path');
const vue=require('./plugins/plugin-vue')

module.exports={
  plugins:[
    vue()
  ],
  resolve:{
    alias:{
      '@':path.resolve('src')
    }
  }
}