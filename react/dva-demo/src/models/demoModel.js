const delay=(interval=1000)=>{
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve()
    },interval)
  })
}
export default {
  namespace:'demo',
  state:{
    num:10
  },
  reducers:{
    /**
     * 把原有reducer函数中的每一种switch/case情况都写成单独的方法[纯函数]
     * state:获取"本模块"的公共状态
     * action:派发时候传递的action对象[包含type和传递的其他值](一般基于payload字段传递)
     * 我们需要把获取的state克隆一份，然后函数最后返回的值替换当前模块的state
     * 
     */
    increment(state,{payload=1}){
      return {
        ...state,
        num:state.num+payload
      }
    }
  },
  effects:{
    /**
     * redux-saga中我们基于take/takeLatest/takeEvery等方式创建的监听器，此时写成一个个的"Generator函数"即可!!
     * ->默认是基于takeEvery的方式创建的监听器
     * +方法名是我们创建的监听器名字
     * +方法就是派发的任务被监听后，执行的working方法
     * +此处的函数名，不要和reducers中的函数名一致，因为：每一次派发，reducers和effects都会去匹配执行
     * 如果函数名一样，则状态修改两次！！我们一般在effects写的名字，都加Async!!
     * 
     * 方法中的参数
     * +action:在组件中进行派发时，传递的action对象
     * +第二个参数就是saga中提供的EffectsAPI  但是没有delay和debounce...
     *   +基于yield select()  可以获取所有模块的公共状态
     *      yield select(state=>state.demo) 这样就是获取指定的状态信息
     */
    // *incrementAsync({payload},{call,put,select}){
    //   // let xxx=yield select()
    //   // console.log(xxx,'xxx')

    //   yield call(delay,2000)
    //   yield put({
    //     type:'increment',
    //     payload
    //   })

    // }
    // 如果像设置不同类型的监听器，则这样写
    incrementAsync:[
      // 数组第一项式working函数
      function* ({payload},{call,put,select}){
      yield call(delay,2000)
      yield put({
        type:'increment',
        payload
      })
      },
      // 数组第二项中指定检测器的类型
      // {
      //   type:'takeLatest'
      // }
      // {
      //   type:'throttle',
      //   ms:500
      // }
    ]
  },
  // 这个板块的Model是加载页面就被立即注册
  // + subscriptions中写的方法，在页面一加载的时候，就会把所有的设定的方法执行
  // + 方法就是普通函数[不能是Generator函数]
  //    传递的实参对象中具备history/dispatch 两个属性
  //    history:包含路由跳转和监听的history对象
  //    dispatch:进行派发的方法
  //  +如果想页面一加载[或者是指定的某个条件下]，我们就像从服务器异步获取数据，修改此模块的状态值，
  //  则可以写在subscriptions中！！
  subscriptions:{
    init(params){

      console.log('INIT')
    },
    // 方法只有页面一加载的时候，订阅执行一次，在后期路由切换中，不再执行
    async setup({history,dispatch}){
      // await delay(2000)
      // dispatch({
      //   type:'increment',
      //   payload:2000
      // })

      // console.log('SETUP')

      // 在Model没有懒加载的情况下,我们可以让setup函数在页面第一次加载的过程中,就订阅到事件池里,并且通知执行!!
      // 我们在setup中基于history.listen创建路由跳转监听器:第一次会执行，以后每一次路由切换也会执行！！
      let unlisten=history.listen(async (location)=>{
        let {pathname}=location;
        console.log('执行',pathname)

        // unlisten() 移除监听器
      })



    }
  }
}



