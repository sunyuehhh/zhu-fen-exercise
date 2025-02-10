const middleware1=(ctx,next)=>{
  console.log(1)
  next()
  console.log(2)

}

const middleware2=(ctx,next)=>{
  console.log(3)
  next()
  console.log(4)

}

const middleware3=(ctx)=>{
  console.log(5)

}

middleware1(ctx,()=>middleware2(ctx,()=>middleware3()))//1 3 5 4 2