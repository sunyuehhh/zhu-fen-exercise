let mysql=require('mysql')
let Promise=require('bluebird')
let connection= mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'root',
  database:'studb',
  port: 3306 
})

// 连接数据库
connection.connect()
let query=Promise.promisify(connection.query).bind(connection)
// connection.query('select * from account',function(err,result,fields){
//   console.log(err,result,fields)
// })
query('select * from account').then((results)=>{
  console.log(results)

})