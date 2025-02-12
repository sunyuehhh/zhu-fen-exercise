let express = require('express');
const cookieParser=require('cookie-parser')
let app = express(express.json());
app.use(cookieParser())
let whiteList=["http://192.168.31.51:5500"]
app.use(function(req,res,next){
    let origin=req.headers.origin
    if(whiteList?.includes(origin)){
        //设置哪个源可以访问我 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //允许哪个源
        res.setHeader('Access-Control-Allow-Origin',origin)
        //服务端允许  客户端跨域传递过来的请求头
        // res.setHeader('Access-Control-Allow-Headers',name)   
        //允许哪个方法  默认get post
        res.setHeader('Access-Control-Allow-Methods','PUT')
        //允许跨域时携带cookie  并且Access-Control-Allow-Origin不能写*了
        res.setHeader('Access-Control-Allow-Credentials','true')
        //设置预检请求结果可以存活多久
        res.setHeader('Access-Control-Allow-Max-Age','3600')
        //执定向客户端暴露的响应头
        // res.setHeader('Access-Control-Allow-Expose-Headers',name)
        if(req.method=='OPTIONS'){
            res.end()//OPTIONS请求不做任何处理        
        }
            
    }
    
    next()
    
})
app.get('/count',function(req,res){
  // 从用户传递过来的cookie获取count的值
  let count=req?.cookies?.count||0
  console.log(count,req?.cookies,'count')
  count++;
  // 把+1后的值写回去
  res.cookie('count', count, {
    httpOnly: true,  // 只能通过 HTTP 请求访问，防止 XSS 攻击
    secure: true,    // 确保是通过 HTTPS 发送的
    sameSite: 'None' // 跨域时允许携带 cookie
  });
  res.json({count})
})

app.listen(4000,()=>{
  console.log(4000)
});

