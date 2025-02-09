// 为什么需要buffer
// Buffer是我们node中的处理二进制数据的对象，展现形式是16进制
// 就是为了js再我们node中运行的时候可以处理二进制数据的能力  
// Blob 不能直接进行文件的处理 ArrayBuffer不能直接进行二进制数据处理

// 二进制都是0b开头的   八进制是0开头  十六进制0x开头
console.log(parseInt('010101',2))//将任意进制转换为10进制

console.log((100).toString(2))//可以转换成其他任意进制

console.log(0.1+0.2);//进制转化导致  需将0.1放入内存中
// 小数转整数是×2取整法

// 常见的编码有哪些？  utf8  gb2312 unicode  ascii(我们node默认只支持utf8)

// gb2312  简体中文，用两个字节来表示
// gbk 扩展字体  再基础上，支持了繁体、日语、韩语
// gb18030
// unicode  将所有的符号全部统一管理
// utf组织  基于unicode来进行编码   1-4个字节来标识   1个字节就是基于ascii  3个字节就是1个汉字(gbk编码是一个汉字两个字节,node中不支持gnk编码)

// base64编码(base32)
// 1个字节8个位   1个汉字由3个字节组成  1个汉字24
// 64   每个字节不得大于64  缺点是以前是3个字节->4个字节  大了1/3

let code='ABCDEFGHIJKLMNOPQRSTUVWXYZ'//26
code+=code.toLowerCase()//52
code+='0123456789'//62
code+='+/'//64
// 总共64位


