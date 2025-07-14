    function createCurrentLocation(base){
      const { pathname, search, hash } = window.location;

      const hasPos=base?.indexOf('#')
      if(hasPos>-1){
        return base.slice(1)||'/'
      }
      return pathname + search + hash;
    }

    function buildState(back, current, forward, replace = false, computedScroll = false){
      return {
        back,
        current,
        forward,
        replace,
        scroll: computedScroll ? { left: window.pageXOffset, top: window.pageYOffset } : null,
        position: window.history.length - 1
      }
    }

    function useHistoryStateNavigation(base){
      const currentLocation = { value: createCurrentLocation(base) }
      const historyState = { value: window.history.state }

      function changeLocation(to, state, replace){
        const hasPos=base.indexOf('#');
        const url = hasPos > -1 ? base + to : to;

        window.history[replace ? 'replaceState' : 'pushState'](state, null, url)
        historyState.value = state
      }

      if (!historyState.value) {
        changeLocation(currentLocation.value, buildState(null, currentLocation.value, null, true), true)
      }

      function push(to, data){
        const currentState = Object.assign({}, historyState.value, {
          forward: to,
          scroll: {
            left: window.pageXOffset,
            top: window.pageYOffset
          }
        })
        changeLocation(currentState.current, currentState, true)

        const state = Object.assign({}, buildState(currentLocation.value, to, null), {
          position: currentState.position + 1
        }, data)

        changeLocation(to, state, false)
        currentLocation.value = to
      }

      function replace(to, data){
        const state = Object.assign({}, buildState(historyState.value.back, to, historyState.value.forward,true), data)
        changeLocation(to, state, true)
        currentLocation.value = to
      }

      return {
        location: currentLocation,
        state: historyState,
        push,
        replace
      }
    }

    // 前进后退得时候  要更新historyState 和 currentLocation 这两个边路
    function useHistoryListeners(historyState,currentLocation){
      let listeners=[]
      const popStateHandler=({state})=>{
        console.log(state)
        const to=createCurrentLocation()
        const from=currentLocation.value
        const fromState=historyState.value;//从哪来得状态

        currentLocation.value=to
        historyState.value=state

        let isBack=state.position-fromState.position<0

        // 用户再这扩展
        listeners.forEach(listener=>{
          listener(to,from,{isBack})
        })

      }

      window.addEventListener('popstate',popStateHandler);//只能监听浏览器得前进后退

      function listen(cb){
        listeners.push(cb)

      }

      return {
        listen
      }


    }

 export function createWebHistory(base=''){
      const historyNavigation= useHistoryStateNavigation(base)

      const historyListeners=useHistoryListeners(historyNavigation.state,historyNavigation.location)

      const routerHistory=Object.assign({},historyNavigation,historyListeners)

      Object.defineProperty(routerHistory,'location',{
        get:()=>historyNavigation.location.value
      })

      Object.defineProperty(routerHistory,'state',{
        get:()=>historyNavigation.state.value
      })

      return routerHistory
    }

    // const history = createWebHistory()
    // window.myRouter = history

    // history.listen((to,from,{isBack})=>{
    //   console.log(to,from,isBack,'FFFFFFFF')

    // })


   export  function createWebHashHistory(){
      return createWebHistory('#')
    }


