import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
function Vue(options){
  this._init(options)//入口方法  做初始化操作


}



initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)


export default Vue