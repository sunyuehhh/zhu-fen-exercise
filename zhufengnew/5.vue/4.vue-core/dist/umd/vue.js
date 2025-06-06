(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  // 拿到数组原型上的方法 (原来的方法)
  var oldArrayProtoMethods = Array.prototype;

  // 继承一下  arrayMethods.__proto__=oldArrayProtoMethods
  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = oldArrayProtoMethods[method].apply(this, args);
      var inserted;
      var ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          // 这两个方法都是追加  追加的内容可能是对象类型  应该再次被劫持
          inserted = args;
          break;
        case 'splice':
          //Vue.$set原理
          inserted = args.slice(2); //arr.splice(0,1,{a:1})
          break;
      }
      if (inserted) ob.observeArray(inserted); //给数组新增的值也要进行观测
      return result;
    };
  });

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key]; //vm.a
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }
  function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      //不能被枚举  不能被循环出来
      configurable: false,
      value: value
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      // 判断一个对象是否被观测过看他有没有__ob__这个属性
      defineProperty(value, '__ob__', this);

      // 使用defineProperty重新定义属性
      if (Array.isArray(value)) {
        // 我希望调用push shift unshift splice sort reverse pop
        // 函数劫持   切片编程
        value.__proto__ = arrayMethods;
        // 观测数组中的对象类型  对象变化也要做一些事
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }
    return _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          observer(item); //观测数组中的对象类型
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]); //Vue.util.defineReactive
        });
      }
    }]);
  }();
  function defineReactive(data, key, value) {
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('用户获取值了');
        return value;
      },
      set: function set(newValue) {
        console.log('设置值');
        if (newValue === value) return;
        observer(newValue); //如果用户将值改为对象  继续监控
        value = newValue;
      }
    });
  }
  function observer(data) {
    if (_typeof(data) !== 'object' && data !== null) {
      return data;
    }
    if (data.__ob__) {
      return data;
    }
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.props) ;
    if (opts.methods) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) ;
    if (opts.watch) ;
  }
  function initData(vm) {
    var data = vm.$options.data;
    vm._data = data = typeof data == 'function' ? data.call(vm) : data;
    // 数据的劫持方案  对象Object.defineProperty
    // 数组  单独处理

    // 我去vm上取属性时  帮我将属性的取值代理到vm._data上
    for (var key in data) {
      proxy(vm, '_data', key);
    }
    console.log(data, 'data');

    // 

    observer(data);
  }

  // <div id="app">hello {{name}} <span>world</span></div>
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名

  // ?: 匹配不捕获
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <my:xx>
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/; // 匹配属性的
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function start(tagName, attrs) {
    console.log(tagName, attrs, '&&&&&&&&&&&&');
  }
  function parseHTML(html) {
    while (html) {
      //只要html不为空字符串就一直解析
      var textEnd = html.indexOf('<');
      if (textEnd == 0) {
        // 肯定是标签
        console.log('开始', html);
        var startTagMatch = parseTagStart(); //开始标签匹配的结果
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
        }
        break;
      }
    }
    function advance(n) {
      //将字符串进行截取操作  再更新html内容
      html = html.substring(n);
    }
    function parseTagStart() {
      var start = html.match(startTagOpen);
      console.log(start, 'start');
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //删除开始标签

        // 如果直接是闭合标签了  说明没有属性
        var _end;
        var attr;
        // 不是结尾标签  能匹配到属性
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          console.log(attr, 'attr');
          match.attrs.push({
            name: attr[1],
            value: attr[2] || attr[3] || attr[4] || true
          });
          advance(attr[0].length);
        }
        console.log(_end, 'end', match);
        if (_end) {
          // 结尾了
          advance(_end[0].length);
          return match;
        }
      }
    }
  }
  function compileToFunction(template) {
    // html模板 =>render函数
    // 1.需要将html代码转换成"ast"语法树  可以用ast树来描述语言本身

    // 虚拟dom  是用对象来描述节点的

    parseHTML(template);

    // 2.通过这棵树 重新生成的代码
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);

      // 如果当前有el属性说明要渲染模板
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      // 挂载操作
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      if (!options.render) {
        var template = options.template;
        if (!template && el) {
          template = el.outerHTML;
        }

        // 将模板转换成render函数
        var render = compileToFunction(template);
        console.log(template, el, 'template');
        options.render = render;
      }

      // console.log(render,'最后用的都是这个render方法')
    };
  }

  function Vue(options) {
    this._init(options); //入口方法  做初始化操作
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
