const {Service} =require('egg')

class NewsService extends Service{
  async list(limit){
    const {ctx}=this;
    let url=this.config.news.url
    let result=await ctx.curl(url,{
      method:'GET',
      data:{
        limit
      },
      dataType:'json'
    })

    // console.log(result)
    return result.data.data

  }
}

module.exports=NewsService