const { Controller } = require('egg');

class NewsController extends Controller {
  async index() {
    let {ctx}=this
    // 控制器里要接收并处理校验参数
    const limit=ctx.query?ctx.query.limit:5
    const list=await this.service.news.list(limit);
    await ctx.render('news',{list,title:this?.ctx?.app?.cache?.title||'默认新闻列表'})
  }
}

module.exports = NewsController;
