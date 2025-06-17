import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
import { initGlobalApi } from "./global-api/index"
function Vue(options){
  this._init(options)//入口方法  做初始化操作


}



initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)


initGlobalApi(Vue)



export default Vue