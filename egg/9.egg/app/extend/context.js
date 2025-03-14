// ctx   get  用来获取请求头  接收的语言版本
exports.language=function(){
  return this.get('accept-language')
}