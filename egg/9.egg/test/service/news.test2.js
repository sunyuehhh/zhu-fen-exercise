const {app,mock,assert}=require('egg-mock/bootstrap')
describe('test/controller/news.test.js',function(){
  it('测试list方法',async ()=>{
    const ctx=app.mockContext()
    const LENGTH=3
    let result=await ctx.service.news.list(LENGTH)

    assert(result.length==LENGTH)

  })

})