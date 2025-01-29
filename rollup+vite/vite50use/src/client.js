console.log(`[vite] connecting....`)
var socket=new WebSocket(`ws://${window.location.host}`,'vite-hmr');
socket.addEventListener('message',async (event)=>{
  console.log(event,'event')

})