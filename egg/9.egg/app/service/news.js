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
    let list=result.data.data
    list.forEach(item => {
      item.createAt=ctx.helper.fromNow(item.createAt)
      
    });
    return list

    // query是执行SQL语句的意思  增删改查都可以写
    // let result=await this.app.mysql.query(`SELECT * FROM news LIMIT ${limit}`)
    // return result
  }
}

module.exports=NewsService