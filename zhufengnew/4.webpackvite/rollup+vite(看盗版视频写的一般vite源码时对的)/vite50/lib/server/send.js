const alias={
  js:'application/javascript',
  css:'text/css',
  html:'text/html',
  json:'application/json'
}

// express  res.send
function send(req,res,content,type){
  res.setHeader('Content-Type',alias[type])
  res.statusCode=200
  // 写入响应  并且结束响应
  return res?.end(content)

}

module.exports=send;