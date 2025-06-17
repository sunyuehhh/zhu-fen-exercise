export function proxy(vm,data,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[data][key]  //vm.a
    },
    set(newValue){
      vm[data][key]=newValue

    }
  })


}


export function defineProperty(target,key,value){
      Object.defineProperty(target,key,{
      enumerable:false,//不能被枚举  不能被循环出来
      configurable:false,
      value:value
    })
}

export const LIFECYCLE_HOOKS=[
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

const strats={}
strats.data=function(parentVal,childValue){
  return childValue

}
strats.computed=function(){

}
strats.watch=function(){

}

function mergeHook(parentVal,childValue){//生命周期的合并
  if(childValue){
    if(childValue){
      if(parentVal){
        return parentVal.concat(childValue)
      }else{
        return [childValue];//{}  {created:function}
      }
    }

  }else{
    return parentVal;//不合并了  采用父亲的
  }

}

LIFECYCLE_HOOKS.forEach(hook=>{
  strats[hook]=mergeHook
})

export function mergeOptions(parent,child){
  console.log(parent,child,'patent  child')
  // 遍历父亲  可能时父亲有  儿子没有
  const options={}

  for(let key in parent){//父亲和儿子都有在这儿就处理了
    mergeField(key)
    console.log(1,key)
  }

  // 儿子有  父亲没有  在这儿处理
  for(let key in child){ //将儿子多的赋予给父亲
    if(!parent.hasOwnProperty(key)){
      console.log(2,key)
      mergeField(key)
    }

  }

  function mergeField(key){//合并字段
    // 根据key  不同的策略来进行合并
    if(strats[key]){
      options[key]= strats[key](parent[key],child[key])
    }else{
      // todo
      options[key]=child[key]
    }

  }



  return options

}