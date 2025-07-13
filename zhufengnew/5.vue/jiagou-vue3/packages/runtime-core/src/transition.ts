import {h} from 'vue'


function nextFrame(cb){
  requestAnimationFrame(()=>{
    requestAnimationFrame(cb);//确保动画再下一帧执行
  })

}

function resolveTransitionProps(rawProps){
  const {
    name='v',
    enterFromClass=`${name}-enter-from`,
    enterActiveClass=`${name}-enter-active`,
    enterToClass=`${name}-enter-to`,
    leaveFromClass=`${name}-leave-from`,
    leaveActiveClass=`${name}-leave-active`,
    leaveToClass=`${name}-leave-to`,
    onBeforeEnter,
    onEnter,
    onLeave

  }=rawProps


  return {
    onBeforeEnter(el){
      onBeforeEnter&&onBeforeEnter(el)

        el.classList.add(enterActiveClass)
        el.classList.add(enterFromClass)

    },
    onEnter(el,done){
      // 如何知道用户有没有写done
      function resolve(){
        el.classList.remove(enterActiveClass)
        el.classList.remove(enterToClass)
        done&&done()
      }

      onEnter&&onEnter(el,resolve)

      nextFrame(()=>{
        el.classList.remove(enterFromClass);//下一帧移除
        el.classList.add(enterToClass)

        if(!onEnter||onEnter.length<=1){
          // 你没有传递done方法 那么我要自己去做这个移除操作
          el.addEventListener('transitionend',resolve)
        }
      })
    },
    onLeave(el,done){
      function resolve(){
        el.classList.remove(leaveToClass)
        el.classList.remove(leaveActiveClass)
        done&&done()
      }

      onLeave&&onLeave(el,done)

      nextFrame(()=>{
        el.classList.remove(leaveFromClass)
        el.classList.add(leaveToClass)

        if(!onLeave||onLeave.length<=1){
          // 你没有传递don方法  那么我要自己去做这个移除操作
          el.addEventListener('transitionend',resolve)
        }
      })
    }
  }
}

export function Transition(props,{slots}){
  // 外层组件可以对props进行处理  处理后交给核心的组件
  return h(BaseTransition,resolveTransitionProps(props),slots)

}


function resolveTransitionHooks(props){
  const {onBeforeEnter,onLeave,onEnter}=props
  return {
    beforeEnter(el){
      onBeforeEnter(el)

    },
   enter(el,done){
    onEnter(el,done)

   },
   leave(el,remove){
    onLeave(el,remove);//当离开完成后 需要删除dom元素

   }
  }

}

const BaseTransition={
  props:['onBeforeEnter','onEnter','onLeave'],
  setup(props,{slots}){
    return ()=>{
      const innerChild=slots.default&&slots.default()

      const enterHooks=resolveTransitionHooks(props)

      innerChild.transition=enterHooks
      // 元素进去的时候 就调用对应的钩子就可以了
    }

  }

}

