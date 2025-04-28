/**
 * vote板块要派发的行为对象管理
 * voteAction包含好多方法，每一个方法执行，都返回要派发的行为对象
 */
import * as TYPES from '../action-types'

// 延迟函数：返回promise实例，在指定的时候后，才会让实例成功
const delay=(internal=1000)=>{
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve()
    },internal)
  })
}


const voteAction={
  support(){
    return async(dispatch)=>{
      await delay()
      dispatch({
        type:TYPES.VOTE_SUP
    })
    }
  },
  async oppose(){
    await delay()
    return {
      type:TYPES.VOTE_OPP
    }
  }

}

export default voteAction