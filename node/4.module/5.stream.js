const {Readable,Writable,Duplex,Transform}=require('stream')

// // node中可以实现进程间通信  通信就可以通过流来通信   (进程通信就通过这三个方法)

// process.stdin//标准输入，用户输入的内容会触发此方法
// process.stdout
// process.stderr

// // process.stdin.on('data',function(chunk){
// //   process.stdout.write(chunk);//标准输出 底层和console.log一个方法

// // })

// class MyTransform extends Transform{
//   _transform(chunk,encoding,callback){//参数是可写流的参数
//     // 将处理后的结果  可以使用push方法传给可读流中
//     this.push(chunk.toString().toUpperCase())
//     callback()
//   }

// }

// const transform=new MyTransform


// process.stdin.pipe(transform).pipe(process.stdout)


const zlib=require('zlib')
const fs=require('fs');//gzip压缩  将重复的内容尽可能的替换  重复率越高压缩效果越好

// const rs=fs.createReadStream('./1.txt')
// const ws=fs.createWriteStream('./1.txt.gz')
// rs.pipe(zlib.createGzip()).pipe(ws)
// // zlib.createGzip()

const crypto=require('crypto')

// 加密  和  摘要不一样  (加密标识可逆，摘要是不可逆的)
// 典型的摘要算法  md5

// 1.md5  相同的内容摘要的结果一定是相同的
// 2.如果内容有差异  结果会发生很大变化  雪崩效应
// 3.无法反推
// 4.不同的内容摘要的长度相同
crypto.createHash('md5').update('ab').update('cd').update('e').digest('base64')