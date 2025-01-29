function core(a,b,c){//我们希望对这个core进行封装
  
  console.log('核心逻辑',a,b,c)
}

core.before=function(fn){
  return (...args)=>{
    fn()
    this(...args)//AOP  ,切片增加额外的逻辑  在原有的逻辑上增加额外的逻辑
  }
}


const newCore=core.before(()=>{
  console.log('额外逻辑')
})

newCore(1,2,3)