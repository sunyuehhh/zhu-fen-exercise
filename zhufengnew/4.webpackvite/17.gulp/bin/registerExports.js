function registerExports(gulpInst,exported){
  const taskNames=Object.keys(exported);//
  if(taskNames.length){
    taskNames.forEach(register)
  }

  function register(taskName){
    const task=exported[taskName]
    // 把任务名字和任务和函数对应关系放在gulp的实例上
    gulpInst.task(taskName,task)

  }

}


module.exports=registerExports