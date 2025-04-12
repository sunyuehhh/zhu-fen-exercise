const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware("/api", {
      target: 'https://jsonplaceholder.typicode.com',
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
      ws:true
    })
  );
};
