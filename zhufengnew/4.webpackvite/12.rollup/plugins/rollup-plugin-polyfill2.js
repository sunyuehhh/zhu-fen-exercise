function polyfill(){
  return {
    name:'inject-polyfill2',//插件得名字
    async transform(code,id){
      console.log(code,id,'***********')
      return `
      console.log('polyfill')
      ${code}
      `

    }
  }
}

export default polyfill