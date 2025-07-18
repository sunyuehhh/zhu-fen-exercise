// import build from './plugins/rollup-plugin-build.js'
// import polyfill from './plugins/rollup-plugin-polyfill.js'
// import babel from './plugins/rollup-plugin-babel.js'
import output from './plugins/rollup-plugin-output.js'
export default {
  input:'./src/main.js',
  output:{
    dir:'dist'
  },
  plugins:[
    // build(),
    // polyfill(),
    // babel()
    output()
  ]
}