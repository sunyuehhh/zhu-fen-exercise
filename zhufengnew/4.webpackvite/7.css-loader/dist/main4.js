(function(){
    var webpackModules = {
    "css-loader.js!./src/global.css": (module,exports,require) => {
      var api=require('api.js')
      let cssWithMappingToString=item=>item[1]
      let EXPORT=api(cssWithMappingToString)
      EXPORT.push([
        module.id,"body{\r\n background-color:green;\r\n}"
      ])
      module.exports=EXPORT
    },
    "css-loader.js!./src/index.css": (module,exports,require) => {
      var api=require('api.js')
      let cssWithMappingToString=item=>item[1]
      let EXPORT=api(cssWithMappingToString)
      let GLOBAL=require("css-loader.js!./src/global.css")
      EXPORT.i(GLOBAL)
      EXPORT.push([
        module.id,"body{\r\n color:red;\r\n}"
      ])
      module.exports=EXPORT
    },
    "api.js":(module,exports,require)=>{
      module.exports=function(cssWithMappingToString){
          var list=[];//为什么搞了个数组，是为了方便后面处理@import
          list.toString=function(){
            return this.map(cssWithMappingToString).join("")
          }
          list.i=function(otherList){
            list.push(...otherList)

          }

          return list
      }
    },
    "./src/index.css":(module,exports,require)=>{
      var result=require("css-loader.js!./src/index.css")
      module.exports=result.toString()
      
    }
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  (() => {
    const css = webpackRequire("./src/index.css");
    console.log(css);
  })();
})()