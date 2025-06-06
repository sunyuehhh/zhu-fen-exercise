// <div id="app">hello {{name}} <span>world</span></div>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名

// ?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{name}} 插值表达式





export function parseHTML(html){
  function createASTElement(tagName,attrs){
  return {
    tag:tagName,
    type:1,
    children:[],
    attrs,
    parent:null
  }

}

let root;
let currentParent;
let stack=[]
function start(tagName,attrs){
  console.log(tagName,attrs,'tagName  attrs')
  let element=createASTElement(tagName,attrs)
  if(!root){
    root=element
  }

  currentParent=element  //当前解析的标签 保存起来

  stack.push(element)
}

function end(tagName){
  console.log(tagName,'end TagName')
  let element=stack.pop()
  currentParent=stack[stack.length-1]//取出来之后  把栈中最后一个作为父节点
  if(currentParent){//在闭合时 可以知道这个标签的父亲是谁
    element.parent=currentParent
    currentParent.children.push(element)
  }




}

function chars(text){
  console.log(text,'text')
  text=text.replace(/\s/g,'')
  if(text){
    currentParent.children.push({
      type:3,
      text
    })
  }

}


  while(html){//只要html不为空字符串就一直解析
    let textEnd=html.indexOf('<')
    if(textEnd==0){
      // 肯定是标签
      const startTagMatch=parseTagStart();//开始标签匹配的结果
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs)

        continue

      }

      const endTagMatch=html.match(endTag)
      if(endTagMatch){
        end(endTagMatch[1])
        advance(endTagMatch[0].length)

        continue
      }


    }

    let text;
    if(textEnd>0){//是文本
      text=html.substring(0,textEnd)
    }

    if(text){
      chars(text)
      advance(text.length)
      continue
    }




    break

  }

  function advance(n){//将字符串进行截取操作  再更新html内容
    html=html.substring(n)

  }

  function parseTagStart(){
    const start=html.match(startTagOpen)

    if(start){
      const match={
        tagName:start[1],
        attrs:[]
      }

      advance(start[0].length);//删除开始标签

      // 如果直接是闭合标签了  说明没有属性
      let end;
      let attr;
      // 不是结尾标签  能匹配到属性
      while(!(end=html.match(startTagClose))&&(attr=html.match(attribute))){
        match.attrs.push({
          name:attr[1],
          value:attr[2]||attr[3]||attr[4]||true
        })
        advance(attr[0].length)
      }


      if(end){
        // 结尾了
        advance(end[0].length)

        return match
      }
    
    }

  }

  return root

}