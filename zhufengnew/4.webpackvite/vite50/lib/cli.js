const {createServer} = require('./server/index.js');

(async function() {
  const server=await createServer()
  server.listen(9999,()=>{
    console.log('server started on 9999')
  })
})()