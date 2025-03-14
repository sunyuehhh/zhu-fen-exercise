const {app,mock,assert}=require('egg-mock/bootstrap')
// 如何再测试用例总拿到ctx对象
describe('test/controller/users.test.js',function(){
  it('doAddUser',async ()=>{
    let user={username:'zhufeng'};
    app.mockCsrf()
    let result=await app.httpRequest().post('/doAddUser').send(user).expect(200)
    assert(result.body.id===1)
  })

})
