// require.context
// const routesModules=import.meta.globEager("./routes/*.tsx")
const routesModules=import.meta.glob("./routes/*.tsx",{ eager: true })
// 这是一个对象key路径名  值是模块
console.log('routesModules',routesModules)
const routesConfig=Object.keys(routesModules).map(url=>{
  // url=./routes/Home.tsx
  const name=url.match(/\.\/routes\/(.+)\.tsx$/)![1].toLowerCase();//home user profile
  const Component=routesModules[url].default;

  return {
    path:name==='home'?'/':'/'+name,
    element:<Component />
  }
})


export default routesConfig;