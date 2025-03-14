const {app,mock,assert}=require('egg-mock/bootstrap')
describe('test/extend/request.test.js',function(){
  it('isChrome',async ()=>{
    let ctx=app.mockContext({
      headers:{
        "user-agent":'Chrome'
      }
    })
    assert(ctx.request.isChrome==true)

  })
})