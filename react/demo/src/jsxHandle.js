/**
 * createElement:创建虚拟DOM对象
 * @param {*} ele 
 * @param {*} props 
 * @param  {...any} children 
 */
export function createElement(ele,props,...children){
  let virtualDOM={
    $$typeof:Symbol('react.element'),
    type:null,
    ref:null,
    props:{},

  }
  let len=children.length;

  virtualDOM.type=ele;
  if(props!==null){
    virtualDOM.props={
      ...props
    }
  }
  if(len==1){
    virtualDOM.props.children=children[0]
  }else if(len>1){
    virtualDOM.props.children=children
  }


  return virtualDOM


}

/**
 * 封装一个对象迭代方法  
 * 基于传统的for/in循环，会存在一些弊端  性能较差(即可以迭代私有的，也可以迭代共有的)；只能迭代可枚举、非Symbol类型的属性
 * 
 * 一般来讲，内置的属性都是不可枚举的[枚举:例如被for/in、Object.keys等列举出来]
 * 自定义的属性都是可枚举的
 * 但是我们可以设置成员的枚举性  Object.defineProperty()
 * 
 * 解决思路：获取对象所有的私有属性[私有的、不论是否可枚举、不论类型]
 * Object.getOwnPropertyNames(arr)=>获取对象非Symbol类型的私有属性[无关可枚举]
 * Object.getOwnPropertySymbols(arr)=>获取Symbol类型的私有属性[无关可枚举型] 
 * 
 * 
 * 还有一个方法  不考虑兼容性可以使用Reflect.ownKeys(arr)[弊端：不兼容ie]
 */

const each=function each(obj,callback){
  if(obj===null || typeof obj!=="object") throw new TypeError('obj is not a object');
  if(typeof callback!=='function')  throw new TypeError('callback is not a function');
  let keys=Reflect.ownKeys(obj);
  keys.forEach(key=>{
    let value=obj[key]
    // 每一次迭代,都会把回调函数执行
    callback(value,key)
  })

}




/**
 * render:把虚拟DOM变为真实DOM
 */
export function render(virtualDOM,container){
  let {type,props}=virtualDOM
  if(typeof type=='string'){//存储的是标签名;动态创建一个标签
    let ele=document.createElement(type);

    //为标签设置相关的属性&子节点
    each(props,(value,key)=>{
      // className的处理
      if(key=='className'){
        ele.className=value
        return
      }

      // style的处理  value存储的是样式对象
      if(key=='style'){
        each(value,(val,attr)=>{
          ele.style[attr]=val
        })
        return
      }

      // 子节点处理:value存储的children值
      if(key==='children'){
        let children=value
        if(!Array.isArray(children)) children=[children]
        children.forEach(child=>{
          // 子节点是文本节点：直接插入即可
          if(typeof child=='string'){
            ele.appendChild(document.createTextNode(child))

          }else{
          // 子节点又是一个virtualDOM:递归处理
          render(child,ele)
          }

          
        })
        return

      }



      ele.setAttribute(key,value)

    }) 

    // 把新增的标签，增加到指定容器中
    container.appendChild(ele);


  }  

  if(typeof type=="function"){
    // ...函数组件
  }


}