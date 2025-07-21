import babel from '@rollup/plugin-babel'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
export default {
  input:'src/main.js',
  output:{
    file:'dist/bundle.cjs.js',//输出的文件路径和文件名
    format:'iife',//五种输入的格式  amd/es/iife/umd/cjs
    name:'bundleName',//当format格式为iife和umd的时候必须提供变量名
    globals:{
      lodash:'_',
      jquery:'$'
    }
  },
  external:['lodash','jquery'],
  plugins:[
    babel({
      exclude:/node_modules/
    }),
    nodeResolve(),//作用时可以加载node_modules里有的模块
    commonjs(),//可以支持commonjs语法
    terser(),
    postcss(),
    serve({
      open:true,
      port:8080,
      contentBase:'./dist'
    })
  ]
}