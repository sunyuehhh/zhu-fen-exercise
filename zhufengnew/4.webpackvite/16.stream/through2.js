const {PassThrough} =require('stream')
function through2(transform){
  const transformStream=new PassThrough({
    transform
  })

  return transformStream

}

module.exports=through2