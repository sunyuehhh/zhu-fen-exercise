import {take,takeEvery,takeLatest,throttle,debounce,call,apply,fork,delay,put,select,all} from 'redux-saga/effects'
import * as TYPES from './action-types'


const api={
  queryData(id,name){
    console.log('接口被调用',id,name)
    return new Promise(resolve=>{
      setTimeout(()=>{
        let result={
          code:0,
          data:[10,20,30,40]
        }
        resolve(result)
      },2000)
    })
  },
  queryBanner(id,name){
    console.log('轮播图',id,name)
    return new Promise(resolve=>{
      setTimeout(()=>{
        let result={
          code:0,
          data:[10,20,30,40]
        }
        resolve(result)
      },1000)
    })
  }
}
// 创建执行函数，再任务被监听后，去做异步操作[Generator函数]
const workingCount=function* workingCount(action){
  // 基于yield call处理，实现的是标准的串行效果:上一个请求成功，才会发送下一个请求
  // let {data}=yield call(api.queryData,100,'珠峰')
  // console.log(data,'第一个请求成功')
  // let {data:data2}=yield call(api.queryBanner,100,'珠峰')
  // console.log(data2,'第二个请求成功')

  // 并行
  let {data,banner}=yield all({
    data:call(api.queryData,100,'珠峰'),
    banner:call(api.queryBanner)
  })

  console.log(data,banner)
}

// 创建监听器，监听派发的仍无
const saga=function* saga(){
  yield takeLatest(`${TYPES.DEMO_COUNT}@SAGA@`,workingCount)

}


export default saga