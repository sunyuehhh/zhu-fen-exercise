const mock=require('egg-mock')
const assert=require('assert')
it('update cache',async ()=>{
  const app=mock.app()
  await app.ready()
  assert(app.cache.title.length>0)
})