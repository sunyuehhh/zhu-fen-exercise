const Duplex=require('./Duplex')
let cell=['1','2','3','4','5']
let idx=0
const duplexStream=new Duplex({
  read(){
    if(idx>=cell.length){
      this.push(null)
    }else{
      this.push(cell[idx])
    }
    idx++
  },
  write(data,encoding,next){
    // 这里模拟的就是写入硬盘的过程  或者说真正吃馒头的过程
    console.log(data.toString())
    setTimeout(next,1000)

  }

})


module.exports=duplexStream