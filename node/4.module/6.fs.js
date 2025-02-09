// // 掌握fs中常用的api

// // 我们的需求是删除某个文件夹  来掌握常用的api
// const fs=require('fs')
// const path=require('path')

// // fs.stat  获取文件的状态信息  isFile()   isDirectory()
// // fs.unlink  删除文件

// // fs.mkdir  创建
// // fs.rmdir
// // fs.readdir()  读取儿子级别的目录
// fs.stat(path.resolve(__dirname,'a'),function(err,statObj){
//   if(statObj.isFile()){
//     fs.unlink(path.resolve(__dirname,'c'),function(){

//     })
//   }else{
//     fs.readdir(path.resolve(__dirname,'a'),function(err,dir){


//     })
//     fs.rmdir(path.resolve(__dirname,'a'),{recursive:true},(err)=>{})
//   }


// })


// function rmdirSync(directory){
//   const statObj=fs.statSync(path.resolve(__dirname,directory))
//   if(statObj.isFile()){//文件是直接移除，目录需要读取儿子
//     fs.unlinkSync(directory)
//   }else{
//     let dirs=fs.readdirSync(directory)
//     dirs=dirs.map((item)=>{
//       // 递归删除  如果是文件夹则递归删除 文件直接删除
//       return rmdirSync(path.join(directory,item))
//     })


//   }
//   fs.rmdirSync(directory)

// }



const fs=require('fs')
const path=require('path')

// 层序遍历
function rmdirSync(directory){
  let index=0
  let stack=[directory]

  let current;
  while(current=stack[index++]){
    const statObj=fs.statSync(directory)
    if(statObj.isFile()){
      fs.unlinkSync(current);//文件直接删除
    }else{
      stack=[...stack,fs.readdirSync(current).map((item)=>path.join(directory,item))]
    }
  }

  let i=stack.length
  while(i--){
    fs.rmdirSync(stack[i])
  }
}



rmdirSync('a')