import { NodeTypes } from './ast'

function createParserContext(template){

  return {
    line:1,//行号
    column:1,//列号
    offset:0,//偏移量
    source:template,//会不停得截取  知道字符串为空得时候
    originalSource:template
  }

}

// 循环遍历模板得终止条件 如果为空说明遍历完毕
function isEnd(context){
  if(context.source.startsWith('</')){
    return true
  }
  const source=context.source

  
  return !source

}


function getSelection(context,start,end?){
  end=getCursor(context)

  return {
    start,
    end,
    source:context.originalSource.slice(start.offset,end.offset)
  }

}



function getCursor(context){
  let {line,column,offset}=context
  return {
    line,
    column,
    offset
  }
}


function advanceBy(context,endIndex){
  let source=context.source

  // 删除解析后得内容
  context.source=source.slice(endIndex)

}


function advancePositionWithMutation(context,source,endIndex){
  let linesCount=0;//计算经过多少行 \n
  let linePos=-1;//遇到换行标记换行得开始位置

  // 根据结束索引遍历内容  看一下经历了多少个\n字符
  for(let i=0;i<endIndex;i++){
    if(source[i]?.charCodeAt(0)===10){
      // 就是换行
      linesCount++;
      linePos=i
    }
  }

  context.line+=linesCount
  context.offset+=endIndex

  context.column=linePos==-1?context.column+endIndex:endIndex-linePos
  

}


function parserTextData(context,endIndex){
  const content=context.source.slice(0,endIndex)

  //截取后需要将context.中得内容删除掉  删除已经解析得内容
  advanceBy(context,endIndex) 

  let source=context.source

  advancePositionWithMutation(context,source,endIndex)



  return content
}

function parserText(context){
  // 如何计算文本得结束位置
  // 假设求末尾得索引  得到距离自己最近得< 或者{{ 就结束咧
  let endTokens=['<',"{{"]
  let endIndex=context.source.length;//默认末尾就是最后一位


  let start=getCursor(context)

  // 
  for(let i=0;i<endTokens.length;i++){
    // 因为开头肯定是文本 所以第一个字符肯定不是< {{  从下一个开始查找
    const index=context.source.indexOf(endTokens[i],1)
    if(index>-1&&index<endIndex){
      // 没到结尾就遇到了{{   <
      endIndex=index;//用最近得作为我们的结尾
    }
  }
  

  const content=parserTextData(context,endIndex)

  // let end=getCursor(context)

  return {
    type:NodeTypes.TEXT,
    content,
    loc:getSelection(context,start)
  }

}

function parserInterpolation(context){
  const start=getCursor(context);//表达式得开始信息

  const clonseIndex=context.source.indexOf("}}",2)

  advanceBy(context,2)

  const innerStart=getCursor(context)

  const rawContentEndIndex=clonseIndex-2;//获取原始用户大括号中得内容
  const preTrimContent=parserTextData(context,rawContentEndIndex)

  const innerEnd=getCursor(context)

  const content=preTrimContent.trim();//去掉内容得空格
  advanceBy(context,2);//去掉  }}

  return {
    type:NodeTypes.INTERPOLATION,
    content:{
      type:NodeTypes.SIMPLE_EXPRESSION,
      isStatic:false,
      content:content,
      loc:getSelection(context,innerStart,innerEnd)
    },
    loc:getSelection(context,start)
  }

}

function advanceBySpaces(context){
  const match=/^[ \t\r\n]+/.exec(context.source)
  if(match){
    advanceBy(context,match[0].length);//删除所有空格

  }

}


function parseAttributeValue(context){
  // 如果有引号  删除引号  没有引号  可以直接用
  const quate=context.source[0]
  const isQuoted=quate==="'"||quate==='"'
  let content;
  if(isQuoted){
    advanceBy(context,1)
    const endIndex=context.source.indexOf(quate)
    content=parserTextData(context,endIndex)

    advanceBy(context,1)
    return content
  }else{

  }

}

function parseAttribute(context){
  const start=getCursor(context);

const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);

const name = match[0]; // 获取属性名字

advanceBy(context, name.length); // 删除属性名

let value;

// 先匹配空格 和 = 删除掉 后面的就是数值
if (/^[\t\r\n\f ]*=/ .test(context.source)) {
  // = b
  advanceBySpaces(context);
  advanceBy(context, 1);
  advanceBySpaces(context);
  value = parseAttributeValue(context); // b
}

return {
  type:NodeTypes.ATTRIBUTE,
  name,
  value:{
    content:value
  },
  toc:getSelection(context,start)
}
}

function parseChildrenAttribute(context){
  // 解析属性
  const props=[];

  while(!context.source.startsWith(">")){
    // 遇到  >就停止循环
    const prop=parseAttribute(context)
    props.push(prop)

  }
  

  return props

}


function parserTag(context){
  const start = getCursor(context);

  const match = /^<\/?([a-z][^\t\r\n />]*)/i.exec(context.source);

  const tag = match[1]; // 'div'

  advanceBy(context, match[0].length); // <div
  advanceBySpaces(context)

  // 处理元素上的属性
  let props=parseChildrenAttribute(context);

  let isSelfClosing=context.source.startsWith("/>");//我需要删除闭合标签

  advanceBy(context,isSelfClosing?2:1)


  return {
    tag,
    props,
    type:NodeTypes.ELEMENT,
    isSelfClosing,
    loc:getSelection(context,start)
  }

}

function parserChildren(context){

  const nodes=[]

  while(!isEnd(context)){
    const s=context.source;//获取当前得内容

    let node;//当前处理得节点
    if(s[0]==='<'){
      // 我可以对元素进行处理
      node=parserTag(context)

      node.children=parserChildren(context);//需要再处理标签后 处理的子元素都是她的儿子

      if(context.source.startsWith('/>')){ //<div 
        parserTag(context);//删除标签的闭合标签  没有收集

      }

      node.loc=getSelection(context,node.loc.start)
    }else if(s.startsWith("{{")){
      // 我们可以对表达式进行处理
      node=parserInterpolation(context)
    }

    if(!node){
      // 这个东西就是文本
      node=parserText(context)
    }

    nodes.push(node)
  }


  return nodes

}


function createRoot(children,loc){

  return {
    type:NodeTypes.ROOT,
    children,
    loc
  }

}

export function parser(template){
  // 解析的时候   解析一点  删除一点儿  解析的终止条件是模板的内容最终为空
  // 状态机  有限状态机

  const context=createParserContext(template)

  const start=getCursor(context)

  return createRoot(parserChildren(context),getSelection(context,start))

}