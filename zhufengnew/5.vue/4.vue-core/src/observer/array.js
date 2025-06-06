// 拿到数组原型上的方法 (原来的方法)
let oldArrayProtoMethods=Array.prototype

// 继承一下  arrayMethods.__proto__=oldArrayProtoMethods
export let arrayMethods=Object.create(oldArrayProtoMethods)

let methods=[
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method=>{
  arrayMethods[method]=function(...args){
    const result=oldArrayProtoMethods[method].apply(this,args)
    let inserted;
    let ob=this.__ob__;
    switch(method){
      case 'push':
      case 'unshift':
      // 这两个方法都是追加  追加的内容可能是对象类型  应该再次被劫持
      inserted=args;
      break
      case 'splice'://Vue.$set原理
      inserted=args.slice(2);//arr.splice(0,1,{a:1})
      break
      default:
      break
    }

    if(inserted) ob.observeArray(inserted) //给数组新增的值也要进行观测
    return result
  }
})
