import express,{Express,Request,Response} from 'express'
import {createServer} from 'vite'
import fs from 'fs-extra'
import path from 'path'



const app:Express=express()

(async function () {
  const vite=await createServer({
    // 如果配置为html的话  这不是一个原原本本的vite开发服务器
    server:{
      middlewareMode:'ssr'

    }
  })

  app.use(vite.middlewares)
  app.use("*",async (req,res)=>{
    // 服务 index.html - 下面我们来处理这个问题
    const template=await fs.readFile(path.join(__dirname,'index.html'),'utf8')
    const hmrTemplate=await vite.transformIndexHtml(req.url,template)
    const {render}=await vite.ssrLoadModule('/src/server-entry.tsx')

    const appHtml=await render(req.url)
    const html=hmrTemplate.replace('<!--ssr-outlet-->',appHtml)
    res.set('Content-Type','text/html;charset=utf8')
    res.send(html);


  })
  app.listen(8000,()=>{
    console.log('ssr server started on 8000')
  })
  
})()