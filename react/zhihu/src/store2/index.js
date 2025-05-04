import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga';

import saga from './saga';

const sagaMiddleware=createSagaMiddleware()


// 创建store容器
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);


sagaMiddleware.run(saga)
export default store;