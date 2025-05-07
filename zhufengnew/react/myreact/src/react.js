import $ from "jquery";
import { createUnit } from "./unit";
import { createElement } from "./element";
import { Component } from "./component";
let React = {
  render,
  createElement,
  Component,
};

// 此元素可能是一个文件节点、DOM节点(div)、或者  自定义组件Counter
function render(element, container) {
  //   container.innerHTML = `<span data-reactid="${React.rootIndex}">${element}</span>`;
  //unit单元就是用来负责渲染的，负责把元素转换成可以在页面上显示的HTML字符串
  let unit = createUnit(element);
  let markUp = unit.getMarkUp("0"); //用来返回HTML标记
  console.log(markUp, "markUp");
  $(container).html(markUp);
  $(document).trigger("mounted");
}

export default React;
