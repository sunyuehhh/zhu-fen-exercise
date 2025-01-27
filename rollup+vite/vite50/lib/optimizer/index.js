const scanImports=require('./scan');
/**
 * 分析项目依赖的第三方依赖
 * @param {*} config 
 */
async function createOptimizeDepsRun(config){
const deps= await scanImports(config)
console.log(deps,'deps')

}

exports.createOptimizeDepsRun=createOptimizeDepsRun