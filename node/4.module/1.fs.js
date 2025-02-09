const fs=require('fs')

const path=require('path')
// copy

// 1.读取文件不存在报错
// 2.写入的时候如果文件不存在会创建，而且如果存在则会清空文件的内容
fs.readFile(path.resolve(__dirname,'test.md'),function(err,data){
  if(err) return console.log(err)
    fs.writeFile(path.resolve(__dirname,'copy.md'),data,function(err){
  console.log(err)
  })

})
// 内存的空间是有限的  数据过大  都写到内存中（淹没可用内存）  64kb以下的文件可以采用readFile


const buf=Buffer.alloc(3);
// 1.打开  2.指定读取的位置  3.关闭文件
// flags
// r:我打开文件的目录是读取文件
// w:我打开文件的目的是写入
// a:我们打开文件是追加内容的append
// r+:如果文件不存在会报错。具备读取和写入的能力
// w+:如果不存在会创建，具备读取和写入的能力

// 权限位置 0o  8进制
// 二进制的组合：权限的组合  1用户的执行操作  2用户的写入操作  4用户的读取操作
// 001
// 010
// 100
// 0o666:我能读能写  别人能读能写
// 按照位来组合  可以将权限组合起来
fs.open(path.resolve(__dirname,'test.md'),'r',0o666,function(err,fd){
  // fs就是描述符  linux中的一个标识符  number类型
  // 将这个文件中的数据读取到buffer中  从buffer的第0个开始写入  写入三个  读取的文件位置是0
  fs.open(path.resolve(__dirname,'copy.md'),'w',function(err,wfd){

    let readPosition=0;
    let writePosition=0

    function close(){
      
    }




    function next(){
      fs.read(fd,buf,0,3,readPosition,function(err,bytesRead){
        if(bytesRead==0){
          return  close()
        }
          readPosition+=bytesRead
          // 将buffer的第0个位置开始的第3个字节写入到文件的第0个字节的位置上
          fs.write(wfd,buf,0,bytesRead,writePosition,function(err,written){
            writePosition+=written
            console.log('write ok')

            next()
            
    
          })
    
        })
    }


    next()

  })


})
