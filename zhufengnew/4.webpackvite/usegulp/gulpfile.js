const {src,dest,parallel,watch,series} =require('gulp')
const less=require('gulp-less')
const gulpClean=require('gulp-clean')
const babel=require('gulp-babel')
const ejs=require('gulp-ejs')
const browserSync=require('browser-sync')
const browserServer=browserSync.create()
const path=require('path')
const useRef=require('gulp-useref')
const htmlmin=require('gulp-htmlmin')
const uglify=require('gulp-uglify')
const cleanCss=require('gulp-clean-css')
const gulpIf=require('gulp-if')



const clean=()=>{
  return src(["dist/**","temp/**"],{read:false})
        .pipe(gulpClean())
}


// 编译样式
const styles=()=>{
  return src('src/styles/**/*.less',{base:'src'})
         .pipe(less())
         .pipe(dest('temp'))
}


// 编译js脚本
const scripts=()=>{
  return src("src/scripts/**/*.js",{base:'src'})
        .pipe(babel({
          presets:['@babel/preset-env']
        }))
        .pipe(dest('temp'))
}

// 编译html模板
const html=()=>{
  return src("src/**/*.html",{base:'src'})
          .pipe(ejs({"title":"gulp实战"}))
          .pipe(dest('temp'))
}


// 压缩图片
const images=async ()=>{
  const imagemin=await import('gulp-imagemin')
  return src("src/assets/images/**/*.@(jpg|png|gif|svg)",{base:'src'})
        .pipe(imagemin.default())
        .pipe(dest("temp"))
}


// 拷贝不需要任务编译  处理的静态文件  到输出目录
const static=async ()=>{
  return src("static/**",{base:'static'})
        .pipe(dest("dist"))
}


const serve=()=>{
  watch("src/styles/**/*.less",styles).on('change',browserSync.reload)
  watch("src/scripts/**/*.js",scripts).on('change',browserSync.reload)
  watch("src/**/*.html",html).on('change',browserSync.reload)
  watch([
    "src/assets/images/**/*.@(jpg|png|gif|svg)",
    "static/**"
  ]).on('change',browserSync.reload)

  return browserServer.init({
    server:{
      baseDir:['temp',"src","static"],
      files:["dist/**"],//监听 文件变化  文件变化后重新刷新浏览器
      routes:{
        "/node_modules":"node_modules"
      }
    }
  })
}


const concat=()=>{
  return src('temp/**/*.html',{base:'temp'})
         .pipe(useRef({searchPath:["temp","."]}))
         .pipe(gulpIf('*.js',uglify()))
         .pipe(gulpIf("*.css"),cleanCss())
         .pipe(gulpIf("*.html",htmlmin({
          collapseWhitespace:true,
          minifyCSS:true,
          minifyJS:true
         })))
         .pipe(dest("dist"))
}


const compile=parallel(styles,scripts,html)

const build=series(clean,parallel(series(compile,concat),images,static))

const dev=series(clean,compile,serve)

exports.styles=styles
exports.clean=clean
exports.scripts=scripts
exports.html=html
exports.images=images
exports.static=static
exports.compile=compile
exports.build=build
exports.serve=serve