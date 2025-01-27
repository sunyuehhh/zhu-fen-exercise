vite
client
server

1.扫描整个项目，找到依赖的第三方模块
2.编译这些第三方模块,放到.vite目录中、
3.重写返回的导入路径，指向编译后的文件
4.请求服务器的时候，服务器返回/node_module/.vite/deps/vue.js
