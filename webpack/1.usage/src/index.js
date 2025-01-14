import './index.css'
function readonly(target,key,descriptor){
  descriptor.writable=false
}

class Person{
  @readonly PI=3.14
}

let person=new Person()
// person.PI=3.15
// console.log(person)