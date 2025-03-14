module.exports={
  get isChrome(){
    const userAgent=this.get('User-Agent').toLowerCase()
    return userAgent.includes('chrome')
  }
}