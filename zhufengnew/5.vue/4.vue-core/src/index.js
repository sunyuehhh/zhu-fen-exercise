import { initMixin } from "./init"
function Vue(options){
  this._init(options)//入口方法  做初始化操作


}



initMixin(Vue)



export default Vue