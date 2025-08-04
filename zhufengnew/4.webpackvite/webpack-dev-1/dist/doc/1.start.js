let {AsyncSeriesHook}=require('tapable')

class Lesson{
  constructor(){
    this.hooks={
      arch:new AsyncSeriesHook(['name'])

    }
  }

  tap(){//注册监听函数
    this.hooks.arch.tapAsync('node',function(name,cb){
      setTimeout(()=>{
        console.log('node',name)
        cb()
      },1000)
    })

    this.hooks.arch.tapAsync('react',function(name,cb){
       setTimeout(()=>{
        console.log('react',name)
        cb()
      },1000)

    })

  }

  start(){
    this.hooks.arch.callAsync('jw',function(){
      console.log('end')

    })

  }
}

let l=new Lesson()

l.tap();//注册这两个事件

l.start();//启动