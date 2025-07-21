modules.exports={
  parserOptions:{
    ecmaVersion:2017,
    sourceType:'module'
  },
  // 这是一个prettier插件  他可以关闭根eslint冲突得那些规则  走自己得风格规则
  plugins:["prettier"],
  extends:["eslint:recommended"],
  rules:{
    "no-unused-vars":["off"],
    // 如果不符合prettier得规范得话会报错  进行错误提示
    "prettier/prettier":["error",{endOfLine:'auto'}]
  },
  env:{
    node:true
  }
}