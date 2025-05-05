export default {
  // 对CSS的处理
  disableCSSModules:true,
  disableCSSSourceMap:true,

  // 对BABEL扩展应用创建
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "style": "css","libraryDirectory":"es" }]
  ],
  // 开发话你就能够下的跨域代理
  proxy:{
    "/api":{
      target:'https://news-at.zhihu.com/api/4',
      changeOrigin:true,
      pathRewrite:{"^/api":""}
    }
  }
}
