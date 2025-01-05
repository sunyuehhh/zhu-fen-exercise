// 服务端
import createApp from './main'
// 服务端需要调用当前这个文件产生一个vue的实力
export default (context)=>{
  return new Promise((resolve,reject)=>{

  // 服务端会执行方法
  const {app,router} =createApp()
  console.log('执行',context.url,router,'context.url')
  router.push(context.url)
  router.onReady(()=>{
    let matchs=router.getMatchedComponents()
    if(matchs?.length===0){
      reject({code:404})
    }
    resolve(app)
  },reject)
  })
}

// 服务端配置好后 需要给Node使用