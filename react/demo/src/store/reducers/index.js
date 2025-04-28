// 合并各个模块的reducer,最后创建出一个总的reducer
import { combineReducers } from "redux";
import voteReducer from "./voteReducer";
import personalReducer from "./personalReducer";
// 此时容器中的公共状态会按照我们设置的成员名字，分模块进行管理
// state={
//   vote:{
//     supNum:5
//   },
//   personal:100
// }
const reducer=combineReducers({
  vote:voteReducer,
  personal:personalReducer
})


export default reducer