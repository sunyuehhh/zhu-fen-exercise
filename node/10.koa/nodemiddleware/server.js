// 除了nginx外，我们还可以通过node来实现代理
const express=require('express')
const {createProxyMiddleware}=require('http-proxy-middleware')

const app=express()

app.use(express.static('public'))

// 当客户端访问以/api开头的路径的时候会走后面这个中间件
app.use('/api',createProxyMiddleware({
  target:'http://localhost:3000',
  pathRewrite:{
    // 重写路径  把路径开头/api替换成空
    "^/api":""
  },
  // 如果此字段为true,那么代理服务器再转化时会修改请求头中的host为目标服务器的host 
  changeOrigin:true
}))

app.listen(4000,()=>console.log(4000))