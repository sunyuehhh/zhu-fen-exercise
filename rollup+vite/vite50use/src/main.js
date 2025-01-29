import {render} from './renderModule.js'
render()

if(import.meta.hot){
  import.meta.hot.accept(['./renderModule.js'],([renderModule])=>{
    renderModule.render()

  })
}