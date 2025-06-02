const babel=require('@babel/core')
const sourceCode=`<h1 id="title">hello<span>world</span></h1>`
const result=babel.transform(sourceCode,{
  plugins:[['@babel/plugin-transform-react-jsx',{runtime:'classic'}]]

})


console.log(result.code)