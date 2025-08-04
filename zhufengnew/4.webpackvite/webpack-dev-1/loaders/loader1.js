

function loader(source){
  let options=this.getOptions()

  console.log(options,'options')
  return source
}

module.exports=loader