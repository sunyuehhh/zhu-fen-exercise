import {rollup,watch} from 'rollup'
import rollupOption from './rollup.config.js'
/**
 * rollup的执行分为三个阶段
 * 1.打包阶段
 */
(async function () {
  // // 1.打包
  // const bundle =await rollup(rollupOption)
  // // 2.生成
  // await bundle.generate(rollupOption.output)
  // // 3.写入
  // await bundle.write(rollupOption.output)

  const watcher=watch(rollupOption)
  watcher.on('event',(event)=>{
    console.log(event)
  })

  setTimeout(()=>{
    watcher.close()
  },5000)
  
  // // 4.关闭
  // await bundle.close()
  
})()