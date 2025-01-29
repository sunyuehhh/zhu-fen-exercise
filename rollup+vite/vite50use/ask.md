vite
client
server

1.扫描整个项目，找到依赖的第三方模块
2.编译这些第三方模块,放到.vite目录中、
3.重写返回的导入路径，指向编译后的文件
4.请求服务器的时候，服务器返回/node_module/.vite/deps/vue.js


{
  "type": "update",
  "updates": [
    {
      "type": "js-update",
      "path": "/src/main.js",
      "acceptedPath": "/src/renderModule.js"
    }
  ]
}

当一个模块发生变化的时候，会向上通知，如果有一个模块能够接受自己的改变，那么就到此为止
让此接收的模块执行回调，处理更新
如果一直向上通知，没有任何一个模块能接收  直接刷新浏览器



是不是http协议改成其他协议,就会触发upgrade?是的


第一次连接的确是http请求,使用的是http协议
然后http服务器会把协议升级为websocket



热更新