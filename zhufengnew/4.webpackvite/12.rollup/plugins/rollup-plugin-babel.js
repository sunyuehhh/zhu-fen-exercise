import babel from '@babel/core'
function babel(){
  return {
    name:'babel',
    async transform(code,id){
      const {code,ast,map}=await babel.transformAsync(code)

      return {code,ast,map}

    }
  }
}

export default babel