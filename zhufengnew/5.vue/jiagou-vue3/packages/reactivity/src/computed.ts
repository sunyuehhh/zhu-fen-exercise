import { isFunction } from '@vue/shared';
import { ReactiveEffect, trackEffects, triggerEffects } from './effect';
class ComputedRefImpl{
  public effect;
  public _value;
  public _dirty=true;
  public dep=new Set()
  public __v_isRef=true;//表示后续我们可以增加拆包的逻辑
  constructor(getter,public setter){
    this.effect=new ReactiveEffect(getter,()=>{
      if(!this._dirty){
        this._dirty=true  //依赖的值 发生变化了 会将dirty变为true

        // 当依赖的值发生变化了 也应该触发更新
        triggerEffects(this.dep)
      }

    })
  }

  get value(){
    trackEffects(this.dep)
    if(this._dirty){
    this._value=this.effect.run();//this._value就是取值后的结果
    this._dirty=false

    }
    return this._value

  }

  set value(newVal){
    this.setter(newVal)

  }
}
export function computed(getterOrOptions){
  let getter;
  let setter;

  const isGetter=isFunction(getterOrOptions)
  if(isGetter){
    getter=getterOrOptions
    setter=()=>{
      console.log('warn')
    }
    
  }else{
    getter=getterOrOptions.get
    setter=getterOrOptions.set
  }

  return new ComputedRefImpl(getter,setter)
}