// function isType(val,typing){//判断某个变量是不是某个类型
//   return Object.prototype.toString.call(val).slice(8,-1)===typing
// }

// // 判断某个变量是不是字符串
// isType('hello','String')
// isType('abc','String')


// function isType(val,typing){//判断某个变量是不是某个类型
//   return (val)=>{
//     return Object.prototype.toString.call(val).slice(8,-1)===typing
//   }
// }

// let isString=isType('String')//闭包  定义的函数的作用域和执行函数的作用域不是同一个就会产生闭包
// console.log(isString('abc'))

// 自己动手实现一个通用柯里化函数
function sum(a,b,c){
  return a+b+c;
}


function curry(func){//柯里化函数一定是高阶函数
  const curried=(...args)=>{//用户本次执行的时候传递的参数
    if(args.length<func.length){
      return (...others)=>curried(...args,...others)
    }else{
      return func(...args)
    }
  }
  return curried
}

let curriedSum=curry(sum)


console.log(curriedSum(1,2)(3))

function isType(typing,val){
  return Object.prototype.toString.call(val).slice(8,-1)===typing
}

let isString=curry(isType)('String')
console.log(isString(123))
