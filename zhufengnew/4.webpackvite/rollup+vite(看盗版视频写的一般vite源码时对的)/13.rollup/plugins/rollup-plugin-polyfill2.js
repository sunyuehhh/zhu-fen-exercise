
function polyfill(){
  return {
    name:'inject-polyfill2',
    async transform(code,id){
      return `
      console.log('poly-fill');
      ${code}
      `
    }
  }

}

export default polyfill