import React from 'react';
import ReactDOM from 'react-dom/client';
import Todos from './components/Todos';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Todos />
  </React.StrictMode>
);