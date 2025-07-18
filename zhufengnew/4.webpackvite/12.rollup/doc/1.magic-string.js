var MagicString=require('magic-string')
var sourceCode='export var name="zhufeng"'
var ms=new MagicString(sourceCode)

console.log(ms,'ms')
console.log(ms.snip(0,6).toString());//export slice(0,6)
console.log(ms.snip(0,4).toString());//var name="zhufeng"

// 还可以用来拼接字符串  Bundle一束 一包
let bundle=new MagicString.Bundle()

bundle.addSource({
  content:`var a=1`,
  separator:'\n'
})