const connect = require('connect');
const serveStaticMiddleware=require('./middlewares/static');
const resolveConfig=require('./config');
const {createOptimizeDepsRun}=require('../optimizer')
const transformMiddleware=require('./middlewares/transform')
const {createPluginContainer}=require('./pluginContainer')

async function createServer() {
  const config=await resolveConfig()
  console.log(config,'config')
  const middlewares=connect()
  const pluginContainer=await createPluginContainer(config);
  const server={
    pluginContainer,
    async listen(port,callback){
      // 在项目启动前进行依赖的预构建
      // 1.找到本项目依赖的第三方模块
      await runOptimize(config,server)
      require('http')
      .createServer(middlewares)
      .listen(port,callback)

    }
  }

  middlewares.use(transformMiddleware(server))
  middlewares.use(serveStaticMiddleware(config))
  // main.js中vue=>/node_modules/.vite/deps/vue.js?v=8406a619


  return server
  
}


async function runOptimize(config,server) {
  const optimizeDeps=await createOptimizeDepsRun(config)
  server._optimizeDepsMetadata=optimizeDeps.metadata;

}


exports.createServer=createServer