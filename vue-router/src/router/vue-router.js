class HistoryRoute{
  constructor(){
    this.current=null
  }
}


class VueRouter{
  constructor(options){
    this.mode=options.mode||'hash'
    this.routes=options.routes||[]
    // 你传递的这个路由表是个数组
    this.routesMap=this.createMap(this.routes)

    // 路由中需要存放当前的路径  需要状态
    this.history=new HistoryRoute()
    this.init()//开始初始化
  }

  init(){
    if(this.mode=='hash'){
      // 先判断用户打开时有没有hash  没有就跳转到#/
      location.hash?'':location.hash='/'
      window.addEventListener('load',()=>{
        this.history.current=location.hash.slice(1)
      })
      window.addEventListener('hashchange',()=>{
        this.history.current=location.hash.slice(1)
      })

    }else{
      location.pathname?'':location.pathname='/'
      window.addEventListener('load',()=>{
        this.history.current=location.pathname
      })
      window.addEventListener('popstate',()=>{
        this.history.current=location.pathname
      })
    }
  }

  createMap(routes){
    return routes.reduce((memo,current)=>{
      memo[current.path]=current.component
      return memo
    },{})
  }

  push(){}

  pop(){}
  back(){}
  

}

VueRouter.install=(Vue)=>{
  console.log(Vue,'1')
  // 每个组件都有this.$router  this.$route
  Vue.mixin({
    beforeCreate(){
      console.log(this.$options,'this.$options')
      if(this.$options&&this.$options.router){//定位根组件
        this._root=this;//把当前实例挂载再_root上
        this._router=this.$options.router//把router实例挂载再_router上面
        // 如果history中的current属性变化  会刷新视图
        // this.xxx=this._router.history
        Vue.util.defineReactive(this,'xxx',this._router.history)
      }else{
        // vue组件的渲染顺序
        this._root=this.$parent._root

      }
      Object.defineProperty(this,'$router',{
        get(){
          return this._root._router 
        }

      })

      Object.defineProperty(this,'$route',{
        get(){
          return {
            // 当前路由所在的状态
            current:this._root._router.history.current
          }
        }
      })
    }
  })

  Vue.component('router-link',{
    render(h){
      return h('a',{},'首页')

    }
  })

  Vue.component('router-view',{//根据当前的状态current 路由表
    // 如何将current  变成动态   cuurent变化影响视图刷新
    // Vue实现双向绑定  Object.defineProperty
    render(h){
      let current=this._self._root._router.history.current
      let routesMap=this._self._root._router.routesMap
      return h(routesMap[current])

    }
  })

}

export default VueRouter