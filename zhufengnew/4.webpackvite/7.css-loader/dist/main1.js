(function(){
    var webpackModules = {
    "./src/global.css": (module,exports,require) => {
      module.exports = "body{\r\nbackground-color:green;\r\n}"
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