let express = require('express');
const cookieParser=require('cookie-parser')
let app = express(express.json());


app.listen(4000,()=>{
  console.log(4000)
});

