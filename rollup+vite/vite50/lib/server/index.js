const connect=require('connect');
const serverStaticMiddleware=require('../middlewares/static.js');
const resolveConfig=require('../config.js')
const {createOptimizeDepsRun}=require('../optimizer')
async function  createServer(params) {
  const config=await resolveConfig()
  const middlewares=connect();
  middlewares.use(serverStaticMiddleware(config))
  const server={
    async listen(port,callback){
      // 在项目启动前进行依赖的预构建
      // 1.找到本项目依赖的第三方模块
      await runOptimize(config,server)
      require('http').createServer(middlewares).listen(port,callback)

    }
  }

  return server
}

async function runOptimize(config,server) {
  const optimizeDeps=await createOptimizeDepsRun(config)
  server._optimizeDepsMetadata=optimizeDeps.metadata;


  
}

exports.createServer=createServer