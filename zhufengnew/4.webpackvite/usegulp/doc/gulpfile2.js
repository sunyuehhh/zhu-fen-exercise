const {series,parallel}=require('gulp')
const defaultTask =(done)=>{
  console.log('defaultTask')
  done()
}
const oneTask=(done)=>{
  console.log('oneTask')
  done()
}
const twoTask=(done)=>{
  console.log('twoTask')
  done()
}
const threeTask=(done)=>{
  console.log('threeTask')
  done()
}
const seriesTask=series(oneTask,twoTask,threeTask)
const parallelTask=parallel(oneTask,twoTask,threeTask)

exports.default=defaultTask


exports.series=seriesTask
exports.parallel=parallelTask