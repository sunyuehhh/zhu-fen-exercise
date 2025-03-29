// 连接池
let mysql=require('mysql')
const pool=mysql.createConnection({
  connectionLimit:10,
  host:'127.0.0.1',
  user:'root',
  password:'root',
  database:'studb'
})

pool.query('select * from student',(err,result,fields)=>{

})