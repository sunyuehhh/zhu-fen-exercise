const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 全局匹配


function genProps(attrs){ //id  "app"  style "color:red"
  // 如果是style  拼成双{}的形式
  let str=''
  for(let i=0;i<attrs.length;i++){
    let attr=attrs[i]
    if(attr.name==='style'){
      let obj={}
      attr.value.split(";").forEach(item => {
        let [key,value]=item.split(':')
        obj[key]=value
        
      });

      attr.value=obj
    }

    str+=`${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0,-1)}}`
}

function gen(node){
  if(node.type==1){
    return generate(node);//生成元素节点的字符串
  }else{
    let text=node.text;//获取文本
    // 如果是普通文本  不带{{}}

    if(!defaultTagRE.test(text)){
      return `_v(${JSON.stringify(text)})`//_v(hello)
    }

    // _v('hello {{name}} world {{msg}}')=>_v('hello'+_s(name)+'world'+_s(msg))
    let tokens=[]
    let lastIndex=defaultTagRE.lastIndex=0;//如果正则式全局模式  需要每次使用前置为0
    let match,index;//每次匹配的结果



    while(match=defaultTagRE.exec(text)){
      if(!match.index){
        break
      }
      index=match.index;//保存匹配到的索引
      if(index>lastIndex){
        tokens.push(JSON.stringify(text.slice(lastIndex,index)))
      }

      tokens.push(`_s(${match[1].trim()})`);
      lastIndex=index+match[0].length


    }

    if(lastIndex<text.length){
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`




  }

}

function getChildren(el){
  const children=el.children
  if(children){//将所有转化后的儿子用,拼接起来
    return children.map(child=>gen(child)).join(',')

  }

}
export function generate(el){
  let children=getChildren(el)
  let code=`_c('${el.tag}',${
    el.attrs.length?`${genProps(el.attrs)}`:'undefined'
  
  }${
    children?`,${children}`:''
  })`


  return code

}