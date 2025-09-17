(function(){
    var webpackModules = {
    "./src/global.css": (module,exports,require) => {
      var list=[];//为什么搞了个数组  是为了方便后面处理@import
      list.push([
        module.id,"body{\r\n background-color:green;\r\n}"
      ])
      // 这是一个映射函数  把每个CSS描述对象转化为CSS代码
      let cssWithMappingToString=item=>item[1]
      let css=list.map(item=>cssWithMappingToString(item)).join("")
      module.exports=css


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
    const css = webpackRequire("./src/global.css");
    console.log(css);
  })();
})()