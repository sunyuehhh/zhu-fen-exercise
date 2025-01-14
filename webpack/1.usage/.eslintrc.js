module.exports={
  root:true,
  parser:'babel-eslint',
  parserOptions:{
    sourceType:'module',
    ecmaVersion:2015
  },
  env:{
    browser:true,
    node:true
  },
  rules:{
    "indent":"off",
    "quotes":"off",
    "no-console":"error"
    
  }
}