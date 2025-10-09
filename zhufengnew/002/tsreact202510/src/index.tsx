import React from 'react';
import ReactDOM from 'react-dom/client';
import Todos from './components/Todos';
import Counter from './components/Count';
import store from './store';

console.log(store.getState())

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Counter number={1} />
    {/* <Todos /> */}
  </React.StrictMode>
);