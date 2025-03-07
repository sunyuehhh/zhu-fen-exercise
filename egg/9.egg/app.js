module.exports=app=>{
  // 编写一个钩子函数  再系统启动成功之后执行以下计划任务
  app.beforeStart(async ()=>{
    await app.runSchedule('updatecache')
  })
}