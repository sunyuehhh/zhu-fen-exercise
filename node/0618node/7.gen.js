function* gen(){
    let a= yield 1;
    console.log(a);
     let b=yield 2;
     console.log(b)
    let c= yield 3;
    console.log(c)
     return undefined;
}