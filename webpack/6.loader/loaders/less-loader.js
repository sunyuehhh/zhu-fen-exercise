const less=require('less')
function loader(source){
  let callback=this.async()
  // 下面方法是同步的
  less.render(source,{
    filename:this.resource,
  },(err,output)=>{
    callback(err,`module.exports=${JSON.stringify(output.css)}`)
  })
}

module.exports = loader