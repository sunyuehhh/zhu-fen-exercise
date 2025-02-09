export default function(pathname,req,res){
  if(pathname==='/user'){
    if(req.method==='GET'){
      res.end(JSON.stringify({
        user:"query"
      }))
    }

    if(req.method==='POST'){
      console.log(req.body,'res.body')
      res.end(JSON.stringify({
        user:'add'
      }))
    }

    if(req.method==='DELETE'){
      res.end(JSON.stringify({
        user:'delete'
      }))
    }


    return true;//已经匹配到user路径了，如果能匹配到动态服务，就不在执行静态服务了
  }

}