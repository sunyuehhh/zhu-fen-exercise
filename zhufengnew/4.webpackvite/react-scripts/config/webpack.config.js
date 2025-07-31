/**
 * 生成webpack配置文件工厂
 * @param {*} webpackEnv 环境信息   development  production
 */
module.exports=function(webpackEnv){
  const isEnvDevelop=webpackEnv=='development';//是否是开发环境
  const isEnvProduction=webpackEnv=='production';//是否生产环境
  return {
    mode:isEnvProduction?'production':isEnvDevelop&&'development'
  }

}