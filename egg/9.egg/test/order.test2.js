// 钩子函数
describe('test/order.test.js',function(){
  // 再所有的测试用例之前执行的函数
  before(()=>{
    console.log('1')
  })
  before(()=>{
    console.log('2')
  })
  // 再每个测试用例之前执行
  beforeEach(()=>{
    console.log('beforeEach')
  })
  it('order1',()=>{
    console.log('测试用例1')
  })
  it('order2',()=>{
    console.log('测试用例2')
  })
  // 再测试用例之后执行
  afterEach(()=>{
    console.log('afterEach')
  })
  after(()=>{
    console.log('after1')
  })
  after(()=>{
    console.log('after2')
  })
})