let Vue;//vue的构造函数
const forEach=(obj,callback)=>{
  Object.keys(obj).forEach(key=>{
    callback(key,obj[key])
  })

}

class ModuleCollection{
  constructor(options){
    this.register([],options)

  }

  register(path,rootModule){
    let newModule={
      _raw:rootModule,
      _children:{},
      state:rootModule.state
    }

    if(path.length==0){
      this.root=newModule
    }else{
      let parent=path.slice(0,-1).reduce((root,current)=>{
        return root._children[current]

      },this.root)
      parent._children[path[path.length-1]]=newModule

    }
    if(rootModule.modules){
      forEach(rootModule.modules,(moduleName,module)=>{
        this.register(path.concat(moduleName),module)

      })
    }

  }
}
// 我需要递归树   将结果挂载  getters mutations  actions
const installModule=(store,state,path,rootModule)=>{
  // 先处理根模块的getters属性
  let getters=rootModule._raw.getters
  if(getters){//给store 增加getters属性
    forEach(getters,(getterName,fn)=>{
      Object.defineProperty(store.getters,getterName,{
        get:()=>{
          return fn(rootModule,state)
        }
      })

    })

  }

  let mutations=rootModule._raw.mutations
  if(mutations){
    forEach(mutations,(mutationName,fn)=>{
      let arr=store.mutations[mutationName]||(store.mutations[mutationName]=[])
      arr.push((payload)=>{
        fn(rootModule.state, payload)
      })

    })
  }

  let actions=rootModule._raw.actions
  if(actions){
    forEach(actions,(actionName,fn)=>{
      let arr=store.actions[actionName]||(store.actions[actionName]=[])
      arr.push((payload)=>{
        fn(store, payload)
      })

    })
  }

  forEach(rootModule._children,(moduleName,module)=>{
    installModule(store,state,path.concat(moduleName),module)

  })

}
class Store{
  constructor(options){
    this._vm=new Vue({
      data:{
        state:options.state//把对象变成了可以监控的对象
      }
    })
    let getters=options.getters||{};//用户传递过来的getters
    this.getters={}
    //把getters属性定义到this.getters中,并根据状态的变化  重新执行此函数
    forEach(getters,(getterName,value)=>{
      Object.defineProperty(this.getters,getterName,{
        get:()=>{
          console.log(getters,getterName,this._s,'getters')
          return value(this.state)
        },
      })

    })

    let mutations=options.mutations||{}
    this.mutations={}
   forEach(mutations,(mutationName,value)=>{
      this.mutations[mutationName]=(payload)=>{
        value.call(this,this.state,payload)
      }
    })

    let actions=options.actions||{}
    this.actions={}
    forEach(actions,(actionName,value)=>{
      this.actions[actionName]=(payload)=>{
        value.call(this,this,payload)

      }

    })

    // 我需要先格式化一下当前用户传递来的数据
    // let root={
    //   _raw:rootModule,
    //   state:rootModule.state,
    //   _children:{
    //     a:{
    //       _raw:aModule,
    //       _children:{

    //       }
    //     },
    //     b:{

    //     }
    //   }
    // }

    // 收集所有的模块
    this.modules=new ModuleCollection(options)

    console.log(installModule,'installModule')

    console.log(this.modules,'this.modules')


  }

  dispatch=(type,payload)=>{
    this.actions[type](payload)
  }

  commit=(type,payload)=>{
    this.mutations[type](payload)
  }

  get state(){//store.state
    return this._vm.state
  }

}
// vue的组件渲染  先渲染父组件  再渲染子组件  深度优先
const install=(_Vue)=>{
  Vue=_Vue
  // 我们需要给每个组件都注册一个this.$store的属性
  Vue.mixin({
    beforeCreate(){//声明周期  组件创建之前
      console.log(this.$options)
      // 需要先判断是父组件还是子组件,如果是子组件  应该把父组件的store增加给子组件
      if(this.$options&&this.$options.store){
        this.$store=this.$options.store
      }else{
        this.$store=this.$parent&&this.$parent.$store
      }

    }
  })
}

export default {
  install,
  Store
}