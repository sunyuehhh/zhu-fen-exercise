class HookCodeFactory{
  setup(hookInstance,options){
    hookInstance._x=options.taps.map((tapInfo)=>tapInfo.fn)
  }

  init(options){
    this.options=options

  }

  args(config={}){
    const {before,after}=config
    let allArgs=this.options.args||[]
    if(before){
      allArgs=[before,...allArgs]
    }
    if(after){
      allArgs=[...allArgs,...after]
    }
    if(allArgs.length>0){
      return allArgs.join(",");//
    }
  }

  header(){
    let code=``
    code+=`var _x=this._x;`
    return code
  }

  create(options){
    this.init(options)
    let fn;

    // 判断要创建函数的类型
    switch(this.options.type){
      case 'sync'://创建一个同步执行的函数
        fn=new Function(this.args(),(this.header()+this.content()))
        break
      case 'async':
        fn=new Function(this.args({after:'_callback'}))

    }

    this.deInit()
    return fn

  }

  deInit(){

    this.options=null
  }

  callTap(tapIndex){
    let code=''
    code+=`var _fn${tapIndex}=_x[${tapIndex}];`
    let tapInfo=this.options.taps[tapIndex]
    switch(tapInfo.type){
      case 'sync':
          code+=`_fn${tapIndex}(${this.args()});`
        break;
    }


    return code

  }

  callTapsSeries(){
    let code=''
    for(let j=0;j<this.options.taps.length;j++){
      const tapContent=this.callTap(j)
      code+=tapContent
    }

    return code
  }

  callTapsParallel(){

  }

}
module.exports=HookCodeFactory