function loader(source){//css文本代码
  let scripts=`
  let style=document.createElement('style');
  style.innerHTML=${JSON.stringify(source)};
  document.head.appendChild(style)
  `;

  return scripts


}


module.exports=loader