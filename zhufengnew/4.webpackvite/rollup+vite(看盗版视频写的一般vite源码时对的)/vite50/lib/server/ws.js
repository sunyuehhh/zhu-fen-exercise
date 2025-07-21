const {WebSocketServer}=require('ws')

function createWebSocketServer(httpServer){
  // websocket服务器可以和http服务器共享地址和端口。
  const wss=new WebSocketServer({noServer:true})
  //当HTTP服务器接收到客户端发送的升级请求时 
  httpServer.on('upgrade',(req,client,head)=>{
    // Sec-WebSocket-Protocol:vite-hmr
    if(req.headers['sec-websocket-protocol']=='vite-hmr'){
      // 把通信协议从http协议升级为websocket协议
      wss.handleUpgrade(req,client,head,(client)=>{
        wss.emit('connection',client,req);//连接成功

      })

    }

  })
  // 当服务器监听到客户端的连接  请求成功的时候
  wss.on('connection',(client)=>{
    client.send(JSON.stringify({type:'connected'}))

  })
  return {
    on:wss.on.bind(wss),//通过on方法可以监听客户端发过来的请求
    off:wss.off.bind(wss),//取消监听客户端发过来的请求
    send(payload){//调用此方法可以向所有的客户端发送消息
      const stringified=JSON.stringify(payload)
      wss.clients.forEach(client=>{
        client.send(stringified)
      })

    }
  }

}



exports.createWebSocketServer=createWebSocketServer