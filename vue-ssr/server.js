const koa=require('koa')
const Router=require('koa-router')
const Static=require('koa-static')



const app=new koa()
const router=new Router()
const Vue=require('vue')
const fs=require('fs')
const VueServerRenderer=require('vue-server-renderer')

const vm=new Vue({
  data(){
    return {
      msg:'hello1'
    }
  },
  template:'<div>{{msg}}</div>'
})

// 创建一个渲染器
const template=fs.readFileSync('./template.html','utf8')
// 创建渲染函数
let render=VueServerRenderer.createRenderer({
  template//模板里必须有vue-ssr-outlet
})
router.get('/',async (ctx)=>{
  // 通过渲染函数  渲染我们的vue实例
  ctx.body=await render.renderToString(vm)

})
app.use(router.routes())
app.listen(3000)