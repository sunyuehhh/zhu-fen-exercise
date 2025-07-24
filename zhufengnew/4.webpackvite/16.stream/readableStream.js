const {Readable}=require('stream')


// 用迭代器模拟数据源   水井
// const iterator=(function (count){
//   return {
//     next(){
//       count++
//       if(count<=5){
//         return {
//           done:false,
//           value:count+''
//         }
//       }else{
//         return {
//           done:true,
//           value:undefined
//         }
//       }
//     }
//   }

// })(0)

function* dataSource(){
  for(let i=1;i<=5;i++){
    yield i+''
  }
}

const iterator=dataSource()


const readableStream=new Readable({
  read(){
    let {done,value}=iterator.next()
    if(done){
      this.push(null)
    }else{
      this.push(value)
    }
  }
})


module.exports=readableStream