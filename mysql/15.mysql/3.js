let mysql=require('mysql')
const pool=mysql.createConnection({
  connectionLimit:10,
  host:'127.0.0.1',
  user:'root',
  password:'root',
  database:'studb'
})

pool.beginTransaction(function(err){
  if(err) throw err
  pool.query('update account set balance=balance - 10 where id=1',function(err){
    if(err){
      pool.rollback()
      throw err
    }else{
      pool.query('update account set balance=balance + 10 where id=2',function(err){
        if(err){
          pool.rollback();
          throw err;
        }else{
          pool.commit()
        }

      })
    }

  })


})