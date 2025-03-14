module.exports=(options,app)=>{
  return async function(ctx,next) {
    // 判断当前的客户端而理性  如果是特定类型的话  则返回403拒绝访问
    // 1.先拿到客户端的类型  就是UserAgent
    let agent=ctx.get('user-agent')
    let matched=options.ua.some(ua=>ua.test(agent))
    // if(matched){
    //   ctx.status=403
    //   ctx.body='You are forbidden'
    // }else{
    //   await next()
    // }

    await next()
    
  }
}