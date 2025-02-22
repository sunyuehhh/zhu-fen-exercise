## express和koa的区别
-选择问题，如果你希望内核比较小  底层自动支持promise的写法   koa更合适。express功能强大  整体内置了很多

-node中有两个mvc框架   nextjs(express)    eggjs(koa)  koa和express是同一个团队开发的  使用起来基本一致
-express和koa的中间件的实现有区别   express 基于回调    koa基于promise
-koa采用的是es6语法  express采用的是es5语法

-koa中有一个context对象  封装了(req,res,request,response)  express直接再原生的req,res进行了扩展



-express  内置了一个路由系统   koa+koa-router