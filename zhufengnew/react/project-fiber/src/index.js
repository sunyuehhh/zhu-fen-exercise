import React from './react';
import ReactDOM from './react-dom';
import './index.css';

let style={
  border:'3px solid red',
  margin:'5px'
}

export let element=(
  <div id="A1" style={style}>
    A1
    <div id="A2" style={style}>
      <div id="C1" style={style}></div>
      <div id="C2" style={style}></div>
    </div>
    <div id="B2" style={style}></div>
  </div>
)

console.log(element)


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   element
// );

ReactDOM.render(element,document.getElementById('root'))