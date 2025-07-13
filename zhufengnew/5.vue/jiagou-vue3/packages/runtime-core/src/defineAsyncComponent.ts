import {ref} from '@vue/reactivity'
import { Fragment } from './createVnode'
import {h} from './h'



export const defineAsyncComponent=({loader,...options})=>{
  return {
    setup(){
      const loaded=ref(false)
      const loading=ref(false)

      let timer;



       timer=setTimeout(()=>{
        loading.value=true;//正在加载中应该显示loading文字
      },options.delay||200)

      

      let InternalComp;

      loader().then((comp)=>{
        // promise已经加载完成
        loaded.value=true
        InternalComp=comp
      })

      return ()=>{
       if(loaded.value){
        return h(InternalComp)
       }else if(loading.value){
        return h(options.loadingComponent)

       }else{
        return h(Fragment,[])
       }
      }
    }
  }

}