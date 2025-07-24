const {src,dest}=require('gulp5')
const defaultTask=()=>{
  return src('src/scripts/**/*.js').pipe(dest('dest'))
}

exports.default=defaultTask