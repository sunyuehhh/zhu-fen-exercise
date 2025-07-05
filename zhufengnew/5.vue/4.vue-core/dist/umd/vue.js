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
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
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
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
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
      // 当调用数组我们劫持后的这7个方法  页面应该更新
      // 我要知道数组对应哪个dep
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
      ob.dep.notify();
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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strats = {};
  strats.components = function (parentVal, childVal) {
    var res = Object.create(parentVal); //res.__proto__=parentVal
    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }
    return res;
  };
  strats.data = function (parentVal, childValue) {
    return childValue;
  };
  // strats.computed=function(){

  // }
  // strats.watch=function(){

  // }

  function mergeHook(parentVal, childValue) {
    //生命周期的合并
    if (childValue) {
      if (childValue) {
        if (parentVal) {
          return parentVal.concat(childValue);
        } else {
          return [childValue]; //{}  {created:function}
        }
      }
    } else {
      return parentVal; //不合并了  采用父亲的
    }
  }
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  function mergeOptions(parent, child) {
    console.log(parent, child, 'patent  child');
    // 遍历父亲  可能时父亲有  儿子没有
    var options = {};
    for (var key in parent) {
      //父亲和儿子都有在这儿就处理了
      mergeField(key);
      console.log(1, key);
    }

    // 儿子有  父亲没有  在这儿处理
    for (var _key in child) {
      //将儿子多的赋予给父亲
      if (!parent.hasOwnProperty(_key)) {
        console.log(2, _key);
        mergeField(_key);
      }
    }
    function mergeField(key) {
      //合并字段
      // 根据key  不同的策略来进行合并
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        // todo 默认合并
        if (child[key]) {
          options[key] = child[key];
        } else {
          options[key] = parent[key];
        }
      }
    }
    return options;
  }

  // 先调自己的nextTick  再调用户的nextTick
  var callbacks = [];
  var pending$1 = false;
  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    pending$1 = false;
    callbacks = [];
  }
  var timerFunc;
  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks); //异步处理更新
    };
  } else if (MutationObserver) {
    var observe = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observe.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  }
  function nextTick(fun) {
    callbacks.push(fun);
    if (!pending$1) {
      // vue3 里的nextTick原理就是promise.then 没有做兼容性处理
      timerFunc(); //这个方法是异步方法  做了兼容性处理
      pending$1 = true;
    }
  }
  function makeMpa(str) {
    var mapping = {};
    var list = str.split(",");
    for (var i = 0; i < list.length; i++) {
      mapping[list[i]] = true;
    }
    return function (key) {
      //判断这个标签名是不是原生标签
      return mapping[key];
    };
  }
  var isReservedTag = makeMpa('a,div,img,image,text,span,p,button,input,textarea,ul,li');

  var id = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.subs = [];
      this.id = id++;
    }
    return _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target)
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);
  }();
  Dep.target = null; //静态属性  就一份
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher; //保留watcher
    stack.push(watcher); //有渲染watcher 其他watcher
  }
  function popTarget(watcher) {
    // Dep.target=null //将变量删除掉
    stack.pop();
    Dep.target = stack[stack.length - 1]; //将变量删除掉
  }

  // 多对多的关系  一个属性有一个dep是用来收集watcher的
  // dep  可以存搓个watcher
  // 一个watcher 可以对应多个dep

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();
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
    // 获取数组对应的dep
    var childDep = observer(value);
    var dep = new Dep(); //每个属性都有一个dep
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();
          if (childDep) {
            // 默认给数组增加一个dep属性  当对数组这个对象取值的时候
            childDep.dep.depend(); //数组存起来了这个渲染watcher
          }
        }
        console.log('用户获取值了');
        return value;
      },
      set: function set(newValue) {
        console.log('设置值');
        if (newValue === value) return;
        observer(newValue); //如果用户将值改为对象  继续监控
        value = newValue;
        dep.notify();
      }
    });
  }
  function observer(data) {
    if (_typeof(data) !== 'object' && data !== null) {
      return;
    }
    if (data.__ob__) {
      return data;
    }
    return new Observer(data);
  }

  var Watcher = /*#__PURE__*/function () {
    // vm实例
    // exprOrFn  vm._update(vm._render())
    function Watcher(vm, exprOrFn, cb) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      _classCallCheck(this, Watcher);
      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.cb = cb;
      this.options = options;
      this.user = options.user; //这是一个用户watcher

      this.isWatcher = !!options; //是渲染watcher

      this.lazy = options.lazy; //如果watcher上有lazy属性 说明是一个计算属性
      this.dirty = this.lazy; //dirty代表取值时是否执行用户提供的方法

      this.deps = []; //watcher记录有多少dep依赖他
      this.depsId = new Set();
      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        this.getter = function () {
          // exprOrFn 可能传递过来的是一个字符串a 
          // 当去当前实例上取值时  才会触发依赖收集
          var path = exprOrFn.split('.'); //['a','a','a']
          var obj = vm;
          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }
          return obj;
        };
      }

      // 默认会先调用一次get方法  进行取值  将结果保留下来
      this.value = this.lazy ? void 0 : this.get(); //默认会调用get方法
    }
    return _createClass(Watcher, [{
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false; //取过一次值之后  就表示已经取过值了
      }
    }, {
      key: "depend",
      value: function depend() {
        // 计算属性watcher 会存储dep  dep会存储watcher
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend(); //让dep去存储渲染watcher
        }
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); //当前watcher实例
        var result = this.getter.call(this.vm); //调用exprOrFn
        popTarget();
        return result;
      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get(); //渲染逻辑
        var oldValue = this.value;
        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          //是计算属性
          this.dirty = true; //页面重新渲染就可以获得最新的值了
        } else {
          // 这里不要每次都调用get方法   get方法会重新渲染页面
          // this.get();//重新渲染
          queueWatcher(this); //暂存的概念
        }
      }
    }]);
  }();
  function flushSchedulerQueue() {
    queue.forEach(function (watcher) {
      watcher.run();
      // watcher.cb()
    });
    queue = [];
    has = {};
    pending = false;
  }
  var queue = []; //将需要批量更新的watcher 存在一个队列中  稍后让watcher执行
  var has = {};
  var pending = false;
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      queue.push(watcher);
      has[id] = true;
      // 等待所有同步代码执行完毕后再执行
      if (!pending) {
        nextTick(flushSchedulerQueue);
      }
    }
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.props) ;
    if (opts.methods) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) {
      initComputed(vm);
    }
    if (opts.watch) {
      initWatch(vm);
    }
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
  function initComputed(vm) {
    var computed = vm.$options.computed;
    console.log(computed, 'computed1111111');
    var watchers = vm._computedWatchers = {}; //用来稍后存放计算属性的watcher

    for (var key in computed) {
      var userDef = computed[key]; //取出对应的值来
      // 获取get方法
      var getter = typeof userDef == 'function' ? userDef : userDef.get; //watcher

      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      }); //watcher很懒

      // defineComputed
      defineComputed(vm, key, userDef);
    }
  }
  var sharedPropertyDefinition = {};
  function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = createComputedGetter(key); //dirty来控制是否调用
    } else {
      sharedPropertyDefinition.get = createComputedGetter(key); //需要加缓存
      sharedPropertyDefinition.set = userDef.set;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
  function createComputedGetter(key) {
    return function () {
      //此方法是我们包装的方法，每次取值会调用此方法
      // if(dirty){//判断到底要不要执行用户传递的方法
      //   // 执行
      // }
      var watcher = this._computedWatchers[key]; //拿到这个属性对应watcher
      if (watcher) {
        if (watcher.dirty) {
          //默认肯定是脏的
          watcher.evaluate(); //对当前watcher求值
        }
        if (Dep.target) {
          //说明还有渲染watcher 也应该一并收集起来
          watcher.depend();
        }
        return watcher.value;
      }
    };
  }
  function initWatch(vm) {
    var watch = vm.$options.watch;
    console.log(watch, 'watch');
    for (var key in watch) {
      var handler = watch[key]; //handler可能是数组  字符串  对象  函数
      if (Array.isArray(handler)) {
        createWatcher(vm, key, handler);
      } else {
        createWatcher(vm, key, handler); //字符串  对象  函数
      }
    }
  }
  function createWatcher(vm, exprOrFn, handler) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    if (_typeof(handler) == 'object') {
      options = handler;
      handler = handler.handler; //是一个函数
    }
    if (typeof handler === 'string') {
      handler = vm[handler]; //将实例的方法作为handler
    }

    // key handler 用户传入的选项
    return vm.$watch(exprOrFn, handler, options);
  }
  function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
      nextTick(cb);
    };
    Vue.prototype.$watch = function (exprOrFn, cb, options) {
      //数据应该依赖这个watcher  数据变化后应该让watcher从新执行
      new Watcher(this, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));
      if (options.immediate) {
        cb(); //如果是immediate应该立即执行
      }
    };
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
    if (!oldVnode) {
      //如果是组件 这个oldVnode是undefined
      return createElm(vnode); //vnode是组件中的内容
    }
    if (oldVnode.nodeType == 1) {
      //真实的节点
      // 将虚拟节点转换成真实节点
      var el = createElm(vnode); //产生真实的dom
      var parentElm = oldVnode.parentNode; //获取老的app的父亲 =>body
      parentElm.insertBefore(el, oldVnode.nextSibling); //当前的真实元素插入到app的后面
      parentElm.removeChild(oldVnode); //删除老的节点

      return el;
    } else {
      console.log(oldVnode, vnode);
      // 1.比较两个元素的标签  标签不一样直接替换掉即可
      if (oldVnode.tag !== vnode.tag) {
        // 老的dom元素
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
      }

      // 2.有种可能是标签一样  <div>1</div> <div>2</div>
      // 文本节点的虚拟节点tag 都是undefined
      if (!oldVnode.tag) {
        //文本的比对
        if (oldVnode.text !== vnode.text) {
          return oldVnode.el.textContent = vnode.text;
        }
      }

      // 3.标签一样  并且需要开始比对标签的属性  和  儿子了
      // 标签一样直接复用即可
      var _el = vnode.el = oldVnode.el; //复用老节点

      // 更新属性  用新的虚拟节点的属性和老的比较 去更新节点
      updateProperties(vnode, oldVnode.data);

      // 比较儿子
      var oldChildren = oldVnode.children || [];
      var newChildren = vnode.children || [];
      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 老的有儿子  新的也有儿子  diff算法
        updateChildren(oldChildren, newChildren, _el);
      } else if (oldChildren.length > 0) {
        //新的没有
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        //老的没有
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];
          // 浏览器有性能优化  不用自己在搞文档碎片了
          _el.appendChild(createElm(child));
        }
      }
    }
  }
  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key == newVnode.key;
  }
  function updateChildren(oldChildren, newChildren, parent) {
    // vue 中的diff算法做了跟多优化
    // DOM中操作有很多常见的逻辑  把节点插入到当前儿子的头部、尾部、儿子倒叙正序
    // vue2中采用的是双指针的方式

    // 在尾部添加

    // 我要做一个循环 同时循环老的和新的  哪个先结束  循环就停止  将多余的删除或者添加进去

    // 开头指针
    var oldStartIndex = 0; //老的索引
    var oldStartVnode = oldChildren[0]; //老的索引指向的节点
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex];
    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex];
    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        item.key && (map[item.key] = index); //{0:A,1:B,2:C,3:D}
      });
      return map;
    }
    var map = makeIndexByKey(oldChildren);

    // 我要做一个循环  同时循环老的和新的  哪个先结束  循环就停止  将多余的删除或者添加进去

    // 比较谁先循环停止 
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        //指针指向了null 跳过这次的处理
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        //如果两人是同一个元素  比对儿子
        patch(oldStartVnode, newStartVnode); //更新属性和再去递归更新子节点

        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        //老的尾部和新的头部都比较
        patch(oldStartVnode, newEndVnode);
        // 将当前元素插入到尾部的  下一个元素的前面
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];

        // 为什么要key  循环的时候为什么不能用index作为key
        // index为key  就相当于没有key
      } else {
        // 儿子之间没有关系...暴力比对
        var moveIndex = map[newStartVnode.key]; //拿到开头的虚拟节点key 去老的中找
        if (moveIndex == undefined) {
          //不需要移动说明没有key复用的
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveVNode = oldChildren[moveIndex]; //这个老的虚拟节点需要移动
          oldChildren[moveIndex] = null;
          parent.insertBefore(moveVNode.el, oldStartVnode.el);
          patch(moveVNode, newStartVnode);
        }
        newStartVnode = newChildren[++newStartIndex]; //用新的不停的去老的里面找
      }
      // 反转节点  头部移动尾部  尾部移动到头部
    }
    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // parent.appendChild(createElm(newChildren[i]))
        // 向后插入ele=null
        // 向钱插入ele就是当前向谁前面插入
        var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
        parent.insertBefore(createElm(newChildren[i]), ele);
      }
    }

    // 老的节点还有没处理的，说明这些老节点是不需要的节点  如果这里面有null说明，这个节点已经被处理过了，
    // 跳过即可
    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];
        if (child !== undefined) {
          parent.removeChild(child.el);
        }
      }
    }
  }
  function createComponent$1(vnode) {
    // 调用hook中的init方法
    var i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    }
    if (vnode.componentInstance) {
      return true;
    }
  }
  function createElm(vnode) {
    console.log(vnode, 'createElm');
    var tag = vnode.tag,
      children = vnode.children;
      vnode.key;
      vnode.data;
      var text = vnode.text;
    if (typeof tag == 'string') {
      //创建元素  放到vnode.el上

      if (createComponent$1(vnode)) {
        //组件渲染后的结果  放到当前组件的实例上 vm.$el
        return vnode.componentInstance.$el; //组件对应的dom元素
      }
      vnode.el = document.createElement(tag);

      // 只有元素才有属性
      updateProperties(vnode);
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

  // vue 的渲染流程=>先初始化数据=>将模板进行编译=>render函数=>生成虚拟节点=>生成真实的dom=>扔到页面上

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var el = vnode.el;

    // 删除老的属性：老的有新的没有
    for (var key in oldProps) {
      if (!newProps.hasOwnProperty(key)) {
        el.removeAttribute(key);
      }
    }

    // 样式处理
    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    // 删除旧样式中新的没有的部分
    for (var _key in oldStyle) {
      if (!newStyle.hasOwnProperty(_key)) {
        el.style[_key] = '';
      }
    }

    // 设置新属性
    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newStyle) {
          el.style[styleName] = newStyle[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log(vnode, 'vnode');
      var vm = this;
      // 这里需要区分一下  到底是首次渲染还是更新
      var prevVnode = vm._vnode; //如果第一次_vnode不存在

      if (!prevVnode) {
        // 用新撞见的元素  替换老的vm.$el
        vm.$el = patch(vm.$el, vnode);
      } else {
        vm.$el = patch(prevVnode, vnode);
      }
      vm._vnode = vnode; //保存第一次的vnode

      // vm.$el=patch(vm.$el,vnode)
    };
  }
  function mountComponent(vm, el) {
    callHook(vm, 'beforeMount');
    // 调用render方法去渲染  el属性

    // 先调用render方法创建虚拟节点  再将虚拟节点渲染到页面上
    // vm._update(vm._render())
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    // 这个watcher是用来渲染的   暂时没有任何功能
    new Watcher(vm, updateComponent, function () {
      callHook(vm, 'beforeUpdate');
    }, true);
    callHook(vm, 'mounted');
  }

  // callHook(vm,'beforeCreate')
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // vm.$options=options
      vm.$options = mergeOptions(vm.constructor.options, options);
      console.log(vm.$options, 'vm.$option');
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');

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
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
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
  function createElement(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    // 如果是组件 我产生虚拟接待你时 需要把组件的构造函数传入
    // new Ctor().$mount()
    // 根据tag名字 需要判断他是不是一个组件

    // const vm=this

    if (isReservedTag(tag)) {
      return vnode(tag, data, data.key, children);
    } else {
      var Ctor = vm.$options.components[tag];
      // 创建组件的虚拟节点  children就是组件的插槽了

      return createComponent(vm, tag, data, data.key, children, Ctor);
    }
  }
  function createComponent(vm, tag, data, key, children, Ctor) {
    var baseCtor = vm.$options._base; //Vue
    if (_typeof(Ctor) == 'object') {
      Ctor = baseCtor.extend(Ctor);
    }

    // 给组件增加生命周期
    data.hook = {
      //稍后初始化组件时  会调用此init方法
      init: function init(vnode) {
        var child = vnode.componentInstance = new Ctor({});
        child.$mount(); //挂载逻辑  组件的$mount方法中不传递参数的

        // vnode.componentInstance.$el 指代的是当前组件的真实dom
      }
    };

    // vue-component-0-app
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, undefined, {
      Ctor: Ctor,
      children: children
    });
  }
  function createTextVnode(text) {
    console.log(text, 'text');
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  // 用来产生虚拟的
  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions //组件的虚拟节点他多一个componentOptions属性  用来保存当前组件的构造函数和他的插槽
    };
  }

  function initExtend(Vue) {
    var cid = 0;

    // 核心就是创建一个子类继承我们得父类
    Vue.extend = function (extendOptions) {
      // 如果对象相同  应该复用构造函数(缓存)
      var Super = this;
      var Sub = function VueComponent(options) {
        this._init(options);
      };
      Sub.cid = cid++;

      // 子类要继承父类原型上得方法  原型继承
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, extendOptions);
      Sub.components = Super.components;
      // ...

      return Sub;
    };
  }

  // 组件得渲染流程
  // 1.调用Vue.component
  // 2.内部用Vue.extend 就是产生一个子类来继承父类
  // 3.等会创建子类实例时会调用父类的_init方法
  // 4.组件的初始化就是new 这个组件的构造函数并且调用$mount方法

  function initGlobalApi(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      // 合并对象  (我先考虑生命周期)  不考虑其他的合并   data computed watch
      this.options = mergeOptions(this.options, mixin);
      // this.options={created:[a(){},b(){}]}
    };
    Vue.options._base = Vue; //_base 最终的Vue的构造函数我保留在options对象中
    Vue.options.components = {};
    initExtend(Vue);
    Vue.component = function (id, definition) {
      // Vue.extend
      definition.name = definition.name || id; //默认会以name属性为准
      // 根据当前组件对象  生成了一个子类的构造函数
      // 用的时候得 new definition().$mount()
      definition = this.options._base.extend(definition); //永远是父类

      // Vue.component 注册组件  等价于Vue.options.components[id]=definition
      Vue.options.components[id] = definition;
    };
  }

  function Vue(options) {
    this._init(options); //入口方法  做初始化操作
  }
  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  stateMixin(Vue);
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
