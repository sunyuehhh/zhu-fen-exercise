const koa=require('koa')
const Router=require('koa-router')
const Static=require('koa-static')



const app=new koa()
const router=new Router()
const Vue=require('vue')
const fs=require('fs')
const VueServerRenderer=require('vue-server-renderer')
const path=require('path')

let ServerBundle=require('./dist/vue-ssr-server-bundle.json')
let template=fs.readFileSync('./dist/index.ssr.html','utf8')
const clientManifest=require('./dist/vue-ssr-client-manifest.json')
// 渲染打包后的结果
const render=VueServerRenderer.createBundleRenderer(ServerBundle,{
  template,
  clientManifest
})




router.get('/',async (ctx)=>{
  // 通过渲染函数  渲染我们的vue实例
  ctx.body=await new Promise((resolve,reject)=>{
    render.renderToString({url:'/test'},(err,data)=>{
      if(err) reject(err)
        resolve(data)

    })
  })

})
app.use(router.routes())
// koa静态服务中间件
app.use(Static(path.resolve(__dirname,'./dist')))
// 如果匹配不到会执行此逻辑
// 如果服务器没有此路径  会渲染当前的app.vue
app.use(async ctx=>{
  // 通过渲染函数  渲染我们的vue实例
  try{
    ctx.body=await new Promise((resolve,reject)=>{
      render.renderToString({url:ctx.url},(err,data)=>{
        if(err) reject(err)
          resolve(data)
  
      })
    })
  }catch(err){
    ctx.body='404'

  }
})
app.listen(3000)