import React from 'react';
import ReactDOM from 'react-dom/client';
import Todos from './components/Todos';
import Counter from './components/Count';
import store from './store';
import { Provider } from 'react-redux';

console.log(store.getState())

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <Counter />
    <Todos />
  </Provider>
);