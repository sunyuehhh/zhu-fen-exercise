const {Writable}=require('./Writable')



const writableStream=new Readable({
  write(data,encoding,next){
    console.log(data.toString())
    setTimeout(next,1000)

  }
})


module.exports=writableStream