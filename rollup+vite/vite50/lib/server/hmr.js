/**
 * 当检测到文件发生改变后，处理热更新
 * @param {*} file   变化的文件
 * @param {*} server 
 */
// 文件变化时，会冒泡   冒到能够处理它的文件
async function handleHMRUpdate(file,server){

}

// 有限状态机
const LexerState={
  inCall:0,//方法调用中
  inQuoteString:1,//在字符串中，引号里面就是1
}
/**
 * import.meta.hot.accept(['./renderModule.js']
 *
 * @param {*} code  模块源代码 
 * @param {*} start   开始查找位置
 * @param {*} acceptedUrls 解析到热更新依赖后放到哪个集合里
 */
function lexAcceptedHmrDeps(code,start,acceptedUrls){
  let state=LexerState.inCall;
  let prevState=LexerState.inCall;
  let currentDep=``;//当前的依赖名

  function addDep(index){
    acceptedUrls.add({
      url:currentDep,
      start:index-currentDep.length-1,
      end:index+1

    })
    currentDep=''

  }
  for(let i=start;i<code.length;i++){
    const char=code.charAt(i)
    switch (state){
      case LexerState.inCall:
        if(char==`'`||char===`"`){
          prevState=state
          state=LexerState.inQuoteString
        }
        break
      case LexerState.inQuoteString:
        if(char==`'`||char===`"`){
          addDep(i)
          prevState=state
          state=LexerState.inCall
        }else{
          currentDep+=char
        }

        break;
    }
  }





}

exports.lexAcceptedHmrDeps=lexAcceptedHmrDeps

exports.handleHMRUpdate=handleHMRUpdate