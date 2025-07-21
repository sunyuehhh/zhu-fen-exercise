const connect=require('connect')
const static=require('serve-static')
const http=require('http')

// connect=>express=>koa

const app=connect()
app.use(static(__dirname))

http.createServer(app).listen(3000)