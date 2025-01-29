const connect=require('connect');
const serverStaticMiddleware=require('../middlewares/static.js');
const resolveConfig=require('../config.js')
const {createOptimizeDepsRun}=require('../optimizer')
const transformMiddleware=require('../middlewares/transform.js')
const {createPluginContainer}=require('./pluginContainer.js')
const {createWebSocketServer}=require('./ws')
const path=require('path')
const chokidar=require('chokidar');
const { normalizePath } = require('../utils.js');
const {handleHMRUpdate} =require('./hmr')
const {ModuleGraph} =require('./moduleGraph')


async function  createServer(params) {
  const config=await resolveConfig()
  const middlewares=connect();
  const httpServer=require('http').createServer(middlewares)
  const ws=createWebSocketServer(httpServer,config)
  const watcher=chokidar.watch(path.resolve(config.root),{
    ignored:[
      '**/node_modules/**',
      '**/.git/**'
    ]
  })
  const moduleGraph=new ModuleGraph(url=>pluginContainer.resolveId(url))
  const pluginContainer=await createPluginContainer(config)

  const server={
    pluginContainer,
    ws,
    watcher,
    moduleGraph,
    async listen(port,callback){
      // 在项目启动前进行依赖的预构建
      // 1.找到本项目依赖的第三方模块
      await runOptimize(config,server)
      httpServer.listen(port,callback)

    }
  }

  watcher.on('change',async (file)=>{
    const normalizeFile=normalizePath(file)
    await handleHMRUpdate(normalizeFile,server)
  })


  for(const plugin of config.plugins){
    if(plugin.configureServer){
      plugin.configureServer(server)
    }
  }
  // main.js中   vue=>/node_modules/.vite/deps/vue.js?v=8406a619
  middlewares.use(transformMiddleware(server))
  middlewares.use(serverStaticMiddleware(config))

  return server
}

async function runOptimize(config,server) {
  const optimizeDeps=await createOptimizeDepsRun(config)
  server._optimizeDepsMetadata=optimizeDeps.metadata;


  
}

exports.createServer=createServer