const {createServer}=require('./server');

(async function (params) {
  const server=await createServer();
  server.listen(9999,()=>{
    console.log('server started on 9999')
  })
  
})();