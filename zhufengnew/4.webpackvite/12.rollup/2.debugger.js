import {rollup,watch} from 'rollup'
import rollupOptions from './rollup.config.js'

(async function () {
  // 1.打包
  const bundle=await rollup(rollupOptions)
  await bundle.generate(rollupOptions.output)
  await bundle.write(rollupOptions.output)

  const watcher=watch(rollupOptions)
  watcher.on('event',(event)=>{
    console.log(event)
  })

  setTimeout(()=>{
    watcher.close()
  },1000)


  await bundle.close()
  
})()