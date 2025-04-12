import React from "react";
import ReactDOM from "react-dom/client";
import "./index.less";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div>珠峰培训</div>
  </React.StrictMode>
);

fetch('/api/posts')
  .then(response => response.json())
  .then(data => {
    console.log('文章列表:', data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });
