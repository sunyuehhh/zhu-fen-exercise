const GlobStream=require('./2.glob-stream')
const glob="src/scripts/**/*.js"
const wrapVinyl=require('./wrap-vinyl')

let globStream=new GlobStream(glob)
globStream
  .pipe(wrapVinyl())
  .on('data',(data)=>{
  console.log(data,'data')

})