import dva from 'dva';
import './index.css';
import  createHashHistory  from 'history/createHashHistory';
import createLoading from 'dva-loading'
import { createLogger } from 'redux-logger';

// 1. Initialize
const app = dva({
  // 指定路由的模式，默认式哈希路由  createHashHistory
  history:createHashHistory(),
  // 扩展其他中间件  例如redux-logger/redux-presist...
  extraEnhancers:[],
  onAction:[
    createLogger()
  ]
});

window.app=app

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
