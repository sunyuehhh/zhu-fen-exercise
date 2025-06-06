// <div id="app">hello {{name}} <span>world</span></div>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名

// ?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // <my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{name}} 插值表达式



function start(tagName,attrs){
  console.log(tagName,attrs,'&&&&&&&&&&&&')

}

function end(tagName){


}

function chars(text){

}


function parseHTML(html){
  while(html){//只要html不为空字符串就一直解析
    let textEnd=html.indexOf('<')
    if(textEnd==0){
      // 肯定是标签
      console.log('开始',html)
      const startTagMatch=parseTagStart();//开始标签匹配的结果
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs)

      }

      break
    }

  }

  function advance(n){//将字符串进行截取操作  再更新html内容
    html=html.substring(n)

  }

  function parseTagStart(){
    const start=html.match(startTagOpen)
    console.log(start,'start')
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
        console.log(attr,'attr')
        match.attrs.push({
          name:attr[1],
          value:attr[2]||attr[3]||attr[4]||true
        })
        advance(attr[0].length)
      }

      console.log(end,'end',match)

      if(end){
        // 结尾了
        advance(end[0].length)

        return match
      }
    
    }

  }


}

export function compileToFunction(template){
  // html模板 =>render函数
  // 1.需要将html代码转换成"ast"语法树  可以用ast树来描述语言本身

  // 虚拟dom  是用对象来描述节点的

  let ast=parseHTML(template)



  // 2.通过这棵树 重新生成的代码






}