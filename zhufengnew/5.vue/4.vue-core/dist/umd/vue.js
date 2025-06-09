(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
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
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
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
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
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
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/; // 匹配属性的
  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    var root;
    var currentParent;
    var stack = [];
    function start(tagName, attrs) {
      console.log(tagName, attrs, 'tagName  attrs');
      var element = createASTElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element; //当前解析的标签 保存起来

      stack.push(element);
    }
    function end(tagName) {
      console.log(tagName, 'end TagName');
      var element = stack.pop();
      currentParent = stack[stack.length - 1]; //取出来之后  把栈中最后一个作为父节点
      if (currentParent) {
        //在闭合时 可以知道这个标签的父亲是谁
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
    function chars(text) {
      console.log(text, 'text');
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    }
    while (html) {
      //只要html不为空字符串就一直解析
      var textEnd = html.indexOf('<');
      if (textEnd == 0) {
        // 肯定是标签
        var startTagMatch = parseTagStart(); //开始标签匹配的结果
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      }
      var text = void 0;
      if (textEnd > 0) {
        //是文本
        text = html.substring(0, textEnd);
      }
      if (text) {
        chars(text);
        advance(text.length);
        continue;
      }
      break;
    }
    function advance(n) {
      //将字符串进行截取操作  再更新html内容
      html = html.substring(n);
    }
    function parseTagStart() {
      var start = html.match(startTagOpen);
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
          match.attrs.push({
            name: attr[1],
            value: attr[2] || attr[3] || attr[4] || true
          });
          advance(attr[0].length);
        }
        if (_end) {
          // 结尾了
          advance(_end[0].length);
          return match;
        }
      }
    }
    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 全局匹配

  function genProps(attrs) {
    //id  "app"  style "color:red"
    // 如果是style  拼成双{}的形式
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        var obj = {};
        attr.value.split(";").forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }
      var tokens = [];
      var lastIndex = defaultTagRE.lastIndex = 0;
      var match, index;
      while (match = defaultTagRE.exec(text)) {
        index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return "_v(".concat(tokens.join('+'), ")");
    }
  }
  function getChildren(el) {
    var children = el.children;
    if (children) {
      //将所有转化后的儿子用,拼接起来
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }
  function generate(el) {
    var children = getChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    // html模板 =>render函数
    // 1.需要将html代码转换成"ast"语法树  可以用ast树来描述语言本身

    // 虚拟dom  是用对象来描述节点的

    var ast = parseHTML(template);
    console.log(ast, 'ast');

    //  2.优化i静态节点

    // 3.通过这棵树 重新生成的代码
    var code = generate(ast);

    // 4.将字符串变成函数  限制取值范围  通过with来进行取值  稍后调用render函数
    // 就可以通过改变this  让这个函数内部取到结果了
    var render = new Function("with(this){return ".concat(code, "}"));
    console.log(render);
    return render;
  }

  function patch(oldVnode, vnode) {
    // 将虚拟节点转换成真实节点
    var el = createElm(vnode); //产生真实的dom
    var parentElm = oldVnode.parentNode; //获取老的app的父亲 =>body
    parentElm.insertBefore(el, oldVnode.nextSibling); //当前的真实元素插入到app的后面
    parentElm.removeChild(oldVnode); //删除老的节点
  }
  function createElm(vnode) {
    var tag = vnode.tag,
      children = vnode.children;
      vnode.key;
      vnode.data;
      var text = vnode.text;
    if (typeof tag == 'string') {
      //创建元素  放到vnode.el上
      vnode.el = document.createElement(tag);
      children.forEach(function (child) {
        //遍历儿子  将儿子渲染后的结果扔到父亲中
        vnode.el.appendChild(createElm(child));
      });
    } else {
      //创建文件  放到vnode.el上
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log(vnode, 'vnode');
      var vm = this;
      patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // 调用render方法去渲染  el属性

    // 先调用render方法创建虚拟节点  再将虚拟节点渲染到页面上
    vm._update(vm._render());
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
      vm.$el = el;
      if (!options.render) {
        var template = options.template;
        if (!template && el) {
          template = el.outerHTML;
        }

        // 将模板转换成render函数
        var render = compileToFunction(template);
        options.render = render;
      }

      // 渲染时用的就是这个render
      // 需要挂载这个组件
      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建虚拟dom元素
      return createElement.apply(void 0, arguments);
    };
    Vue.prototype._s = function (val) {
      //stringify
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };
    Vue.prototype._v = function (text) {
      //创建虚拟dom文本元素
      return createTextVnode(text);
    };
    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      return render.call(vm);
    };
  }

  //  _c('div',{},1,2,3,4,5)
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    console.log(arguments, 'arguments');
    return vnode(tag, data, data.key, children);
  }
  function createTextVnode(text) {
    console.log(text, 'text');
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  // 用来产生虚拟的
  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this._init(options); //入口方法  做初始化操作
  }
  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
