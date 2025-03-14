const {app,mock,assert}=require('egg-mock/bootstrap')
describe('test/extend/context.test.js',function(){
  it('language',async ()=>{
    let ctx=app.mockContext({
      headers:{
        "accept-language":'zh-CN'
      }
    })
    assert(ctx.language()=='zh-CN')

  })
})