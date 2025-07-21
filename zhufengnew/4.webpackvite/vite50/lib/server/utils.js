function normalizePath(path){
  return path.replace(/\\/g,'/');

}

const knowJsSrcRE=/\.(js|vue)($|\?)/;

const isJSRequest=(url)=>{
  return knowJsSrcRE.test(url)

  
}

exports.isJSRequest=isJSRequest


exports.normalizePath=normalizePath