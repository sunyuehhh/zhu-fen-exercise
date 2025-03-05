let nunjucks=require('nunjucks')
let path=require('path')
let express=require('express')
let app=express();
nunjucks.configure('view',{
  autoescape:true,
  express:app,//通过这个属性就实现了nunjucks和express的关联
})
/**
 * 1.response.render方法是express内部实现的
 * 2.先读取模板文件,然后把模板文件和数据对象作为参数传给nunjucks模板引擎
 * 3.然后由nunjucks模板引擎渲染出来最终的字符串 再由response发送给客户端
 */
app.get('/',function(req,res){
  res.render('index.html',{name:'jiagou'})
})

app.listen(8080)