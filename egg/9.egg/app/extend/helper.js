// exports=helper 就是helper对象  给他增加属性  就相当于给helper上扩展了
let moment=require('moment')
moment.locale('zh-CN')
exports.fromNow=(dateTime)=>{
  return moment(dateTime).fromNow()

}