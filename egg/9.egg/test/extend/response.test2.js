const {app,mock,assert}=require('egg-mock/bootstrap')
describe('test/extend/response.test.js',function(){
  it('isSuccess',async ()=>{
    let ctx=app.mockContext({
      headers:{
        "user-agent":'Chrome'
      }
    })
    assert(ctx.response.isSuccess)

  })
})