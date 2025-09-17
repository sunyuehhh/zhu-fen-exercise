(() => {
  var webpackModules = {
    "../../../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css": (module, exports, webpackRequire) => {
      var cssLoaderApiImport = webpackRequire("../../../../../../node_modules/css-loader/dist/runtime/api.js");
      exports = cssLoaderApiImport(false);
      exports.push([module.id, "body{\n  background-color: green;\n}", ""]);
      module.exports = exports;
    },
    "../../../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/index.css": (module, exports, webpackRequire) => {
      var cssLoaderApiImport = webpackRequire("../../../../../../node_modules/css-loader/dist/runtime/api.js");
      var cssLoaderAtRuleImport0 = webpackRequire("../../../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css");
      var cssLoaderGetUrlImport = webpackRequire("../../../../../../node_modules/css-loader/dist/runtime/getUrl.js");
      var cssLoaderUrlImport0 = webpackRequire("./src/1.png");
      exports = cssLoaderApiImport(false);
      exports.i(cssLoaderAtRuleImport0);
      var cssLoaderUrlReplacement0 = cssLoaderGetUrlImport(cssLoaderUrlImport0);
      exports.push([module.id, "body{\n  color:red\n}\n\n#root{\n  background-image: url(" + cssLoaderUrlReplacement0 + ");\n  background-size: 200px 200px;\n  \n  \n}", ""]);
      module.exports = exports;
    },
    "../../../../../../node_modules/css-loader/dist/runtime/api.js": module => {
      "use strict";
      module.exports = function (useSourceMap) {
        var list = [];
        list.toString = function toString() {
          return this.map(function (item) {
            var content = cssWithMappingToString(item, useSourceMap);
            if (item[2]) {
              return "@media ".concat(item[2], " {").concat(content, "}");
            }
            return content;
          }).join('');
        };
        list.i = function (modules, mediaQuery, dedupe) {
          if (typeof modules === 'string') {
            modules = [[null, modules, '']];
          }
          var alreadyImportedModules = {};
          if (dedupe) {
            for (var i = 0; i < this.length; i++) {
              var id = this[i][0];
              if (id != null) {
                alreadyImportedModules[id] = true;
              }
            }
          }
          for (var _i = 0; _i < modules.length; _i++) {
            var item = [].concat(modules[_i]);
            if (dedupe && alreadyImportedModules[item[0]]) {
              continue;
            }
            if (mediaQuery) {
              if (!item[2]) {
                item[2] = mediaQuery;
              } else {
                item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
              }
            }
            list.push(item);
          }
        };
        return list;
      };
      function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || '';
        var cssMapping = item[3];
        if (!cssMapping) {
          return content;
        }
        if (useSourceMap && typeof btoa === 'function') {
          var sourceMapping = toComment(cssMapping);
          var sourceURLs = cssMapping.sources.map(function (source) {
            return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
          });
          return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
        }
        return [content].join('\n');
      }
      function toComment(sourceMap) {
        var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
        var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
        return "/*# ".concat(data, " */");
      }
    },
    "../../../../../../node_modules/css-loader/dist/runtime/getUrl.js": module => {
      "use strict";
      module.exports = function (url, options) {
        if (!options) {
          options = {};
        }
        url = url && url.__esModule ? url.default : url;
        if (typeof url !== 'string') {
          return url;
        }
        if (/^['"].*['"]$/.test(url)) {
          url = url.slice(1, -1);
        }
        if (options.hash) {
          url += options.hash;
        }
        if (/["'() \t\n]/.test(url) || options.needQuotes) {
          return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, '\\n'), "\"");
        }
        return url;
      };
    },
    "./src/1.png": (__unused_webpack_module, webpackExports, webpackRequire) => {
      "use strict";
      webpackRequire.r(webpackExports);
      webpackRequire.d(webpackExports, {
        "default": () => webpackDefaultExport
      });
      const webpackDefaultExport = webpackRequire.p + "53c4211dad6e568356b9551167ab7530.png";
    },
    "./src/index.css": (module, __unused_webpack_exports, webpackRequire) => {
      var result = webpackRequire("../../../../../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/index.css");
      if (result && result.__esModule) {
        result = result.default;
      }
      if (typeof result === "string") {
        module.exports = result;
      } else {
        module.exports = result.toString();
      }
    }
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      id: moduleId,
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  (() => {
    webpackRequire.d = (exports, definition) => {
      for (var key in definition) {
        if (webpackRequire.o(definition, key) && !webpackRequire.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();
  (() => {
    webpackRequire.g = function () {
      if (typeof globalThis === 'object') return globalThis;
      try {
        return this || new Function('return this')();
      } catch (e) {
        if (typeof window === 'object') return window;
      }
    }();
  })();
  (() => {
    webpackRequire.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    webpackRequire.r = exports => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
      }
      Object.defineProperty(exports, '__esModule', {
        value: true
      });
    };
  })();
  (() => {
    var scriptUrl;
    if (webpackRequire.g.importScripts) scriptUrl = webpackRequire.g.location + "";
    var document = webpackRequire.g.document;
    if (!scriptUrl && document) {
      if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT') scriptUrl = document.currentScript.src;
      if (!scriptUrl) {
        var scripts = document.getElementsByTagName("script");
        if (scripts.length) {
          var i = scripts.length - 1;
          while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
        }
      }
    }
    if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl.replace(/^blob:/, "").replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
    webpackRequire.p = scriptUrl;
  })();
  var webpackExports = {};
  (() => {
    const css = webpackRequire("./src/index.css");
    console.log(css);
  })();
})();