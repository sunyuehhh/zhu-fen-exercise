const {SyncHook} =require('tapable')
const syncHook=new SyncHook(['name','age'])
syncHook.intercept({
  register(){
    console.log('拦截器1开始register')
  },
  call(name,age){
    console.log(`拦截器1开始call`,name,age)
  },
  tap(){
    console.log(`拦截器1开始tap`)
  }
})

syncHook.intercept({
  register(){
    console.log('拦截器2开始register')
  },
  call(name,age){
    console.log(`拦截器2开始call`,name,age)
  },
  tap(){
    console.log(`拦截器2开始tap`)
  }
})

// 注册 register
syncHook.tap('回调1',(name,age)=>{
  console.log('回调1',name,age)

})

// 调用  call  tap
syncHook.call('zhufeng',14)