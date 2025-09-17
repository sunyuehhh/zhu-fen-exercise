function loader(sourceCode){
  console.log('111111111')
  return `module.exports=${JSON.stringify(sourceCode)}`
}

module.exports=loader