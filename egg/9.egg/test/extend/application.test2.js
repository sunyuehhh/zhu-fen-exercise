const {app,mock,assert}=require('egg-mock/bootstrap')
describe('test/extend/app.js',function(){
  it('cache',async ()=>{
    console.log('app.cache',app.cache2)
    app.cache2.set('name','zhufeng');
    assert(app.cache2.get('name')=='zhufeng')
  })
})