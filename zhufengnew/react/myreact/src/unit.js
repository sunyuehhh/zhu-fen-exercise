import { createElement, Element } from "./element";
import $ from "jquery";
import types from './types'
let diffQueue=[]; //差异队列
let updateDepth = 0; //更新的级别
class Unit {
  constructor(element) {
    // 凡是挂载在私有属性上的都以_开头
    this._currentElement = element;
  }

  getMarkUp() {
    throw Error("此方法不能被调用");
  }
}

class TextUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid;
    return `<span data-reactid="${reactid}">${this._currentElement}</span>`;
  }
  update(nextElement) {
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement;
      $(`[data-reactid="${this._reactid}"]`).html(nextElement);
    }
  }
}

class NativeUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid;
    let { type, props } = this._currentElement;
    let tagStart = `<${type} data-reactid=${this._reactid} `;
    let childString = "";
    let tagEnd = `</${type}>`;

    this._renderedChildrenUnits = [];
    for (let propName in props) {
      if (/^on[A-Z]/.test(propName)) {
        //这说明要绑定事件了
        let eventName = propName.slice(2).toLowerCase(); //click
        $(document).delegate(`[data-reactid=${this._reactid}]`, `${eventName}.${this._reactid}`, props[propName]);
      } else if (propName === "style") {
        //如果是一个样式对象
        let styleObj = props[propName];
        let styles = Object.entries(styleObj)
          .map(([attr, value]) => {
            return `${attr.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${value}`;
          })
          .join(";");
        tagStart += `style="${styles}"`;
      } else if (propName === "className") {
        tagStart += ` class="${props[propName]}" `;
      } else if (propName === "children") {
        let children = props[propName];
        children.forEach((child, index) => {
          let childUnit = createUnit(child);
          childUnit._mountIndex=index;//每个unit有一个_mountIndex属性，指向自己在父节点中的索引位置
          this._renderedChildrenUnits.push(childUnit);
          let childMarkUp = childUnit.getMarkUp(`${this._reactid}_${index}`);

          childString += childMarkUp;
        });
      } else {
        tagStart += ` ${propName}=${props[propName]} `;
      }
    }

    return tagStart + ">" + childString + tagEnd;
  }
  update(nextElement) {
    // 更新
    console.log(nextElement, "更新");
    let oldProps = this._currentElement.props;
    let newProps = nextElement.props;
    this.updateDOMProperties(oldProps, newProps);
    this.updateDOMChildren(nextElement.props.children);
  }
  // 此处要把新的儿子们传过来，然后和我们老的儿子们进行对比，然后找出差异，进行修改DOM
  updateDOMChildren(newChildrenElement) {
    updateDepth++;
    this.diff(diffQueue, newChildrenElement);
    updateDepth--
    if(updateDepth===0){
      this.patch(diffQueue)
      diffQueue=[]
    }
  }
  patch(diffQueue){
    let deleteChildren=[];//这里要放所有将要删除的节点
    let deleteMap={};//这里暂存能复用的节点   
    // 删  移  添

    // 删除的  移动的先删掉
    for(let i=0;i<diffQueue.length;i++){
      let difference=diffQueue[i]
      if(difference.type===types.MOVE||difference.type===types.REMOVE){
        let fromIndex=difference.fromIndex
        let oldChild=$(difference.parentNode.children().get(fromIndex))
        deleteMap[fromIndex]=oldChild
        deleteChildren.push(oldChild)
      }
    }
    $.each(deleteChildren,(idx,item)=>$(item).remove())

    for(let i=0;i<diffQueue.length;i++){
      let difference=diffQueue[i]
      if(difference.type===types.MOVE||difference.type===types.INSERT){
        switch(difference.type){
          case types.INSERT:
            this.insertChildAt(difference.parentNode,difference.toIndex,$(difference.markUp))
          break;
          case types.MOVE:
            this.insertChildAt(difference.parentNode,difference.toIndex,deleteMap[difference.fromIndex]);
          break;
          default:
          break;
        }

      }
    }

  }
  insertChildAt(parentNode,index,newNode){
    let oldChild=parentNode.children().get(index);
    // 有节点  插到这个节点的位置   没有节点  插到最后
    oldChild?newNode.insertBefore(oldChild):newNode.appendTo(parentNode)
  }
  diff(diffQueue, newChildrenElement) {
    // 第一步生成一个map,key=老的unit
    let oldChildrenUnitMap = this.getOldChildrenMap(this._renderedChildrenUnits);
    //第二步生成一个新的儿子unit的数组
    let {newChildrenUnits,newChildrenUnitMap} = this.getNewChildren(oldChildrenUnitMap, newChildrenElement);
    let lastIndex=0;//上一个已经确定位置的索引
    for(let i=0;i<newChildrenUnits.length;i++){
      let newUnit=newChildrenUnits[i];
      //第一个拿到的就是newKey=A 
      let newKey=newUnit?._currentElement?.props?.key||i.toString();
      let oldChildUnit=oldChildrenUnitMap[newKey]
      if(oldChildUnit===newUnit){//如果说新老一致的话说明复用了节点
        if(oldChildUnit._mountIndex<lastIndex){
          // oldChildUnit需要移动
          diffQueue.push({
            parentId:this._reactid,
            parentNode:$(`[data-reactid="${this._reactid}"]`),
            type:types.MOVE,
            fromIndex:oldChildUnit._mountIndex,
            toIndex:i,
          })
        }
        lastIndex=Math.max(lastIndex,oldChildUnit._mountIndex);


      }else{
        if(oldChildUnit){
          diffQueue.push({
            parentId:this._reactid,
            parentNode:$(`[data-reactid="${this._reactid}"]`),
            type:types.REMOVE,
            fromIndex:oldChildUnit._mountIndex
          })
          $(document).undelegate(`.${oldChildUnit._reactid}`)
        }

        // 新创建的
        diffQueue.push({
          parentId:this._reactid,
          parentNode:$(`[data-reactid="${this._reactid}"]`),
          type:types.INSERT,
          toIndex:i,
          markUp:newUnit.getMarkUp(`${this._reactid}_${i}`)

        })

      }

      newUnit._mountIndex=i


    }

    for(let oldKey in oldChildrenUnitMap){
      let oldChild=oldChildrenUnitMap[oldKey]
      if(!newChildrenUnitMap.hasOwnProperty(oldKey)){
        // 删除
        diffQueue.push({
          parentId:this._reactid,
          parentNode:$(`[data-reactid="${this._reactid}"]`),
          type:types.REMOVE,
          fromIndex:oldChild._mountIndex,
        })
      }
    }

    console.log(diffQueue,'diffQueue')
  }
  getNewChildren(oldChildrenUnitMap, newChildrenElement) {
    let newChildren = [];
    let newChildrenUnitMap={}
    newChildrenElement.forEach((newElement, index) => {
      let newKey = newElement?.props?.key || index.toString();
      let oldUnit = oldChildrenUnitMap[newKey]; //找到老的unit
      let oldElement = oldUnit?._currentElement; //获取老元素
      if (shouldDeepCompare(oldElement, newElement)) {
        console.log(oldUnit, "oldUnit");
        oldUnit.update(newElement);
        newChildren.push(oldUnit);
        newChildrenUnitMap[newKey]=oldUnit
      } else {
        let nextUnit = createUnit(newElement);
        newChildren.push(nextUnit);
        newChildrenUnitMap[newKey]=nextUnit
      }
    });

    return {
      newChildrenUnits:newChildren,
      newChildrenUnitMap
    };
  }
  getOldChildrenMap(childrenUnits = []) {
    let map = {};
    for (let i = 0; i < childrenUnits?.length; i++) {
      let key = childrenUnits?.[i]?._currentElement?.props?.key || i.toString();
      map[key] = childrenUnits?.[i];
    }

    return map;
  }
  updateDOMProperties(oldProps, newProps) {
    let propName;
    for (propName in oldProps) {
      //循环老的属性集合
      if (!newProps.hasOwnProperty(propName)) {
        $(`[data-reactid="${this._reactid}"]`).removeAttr(propName);
      }
      if (/^on[A-Z]/.test(propName)) {
        let eventName = propName.slice(2).toLowerCase(); //click
        $(document).undelegate(`[data-reactid=${this._reactid}]`, `.${this._reactid}`);
      }
    }

    for (propName in newProps) {
      if (propName === "children") {
        //如果是儿子属性的话，先不处理

        continue;
      } else if (/^on[A-Z]/.test(propName)) {
        let eventName = propName.slice(2).toLowerCase(); //click
        $(document).delegate(`[data-reactid=${this._reactid}]`, `${eventName}.${this._reactid}`, newProps[propName]);
      } else if (propName === "className") {
        $(`[data-reactid="${this._reactid}"]`).attr("class", newProps[propName]);
      } else if (propName === "style") {
        let styleObj = newProps[propName];
        Object.entries(styleObj).forEach(([attr, value]) => {
          $(`[data-reactid="${this._reactid}"]`).css(attr, value);
        });
      } else {
        $(`[data-reactid="${this._reactid}"]`).attr(propName, newProps[propName]);
      }
    }
  }
}

class CompositeUnit extends Unit {
  // 这里负责处理组件的更新操作
  update(nextElement, partialState) {
    // 先获取到新的元素
    this._currentElement = nextElement || this._currentElement;
    // 获取新的状态,不管要不要更新组件，组件的黄台一定会更改
    this._componentInstance.state = { ...this._componentInstance.state, ...partialState };
    let nextState = this._componentInstance.state;
    // 新的属性对象
    let nextProps = this._currentElement.props;
    if (
      this._componentInstance.shouldComponentUpdate &&
      !this._componentInstance.shouldComponentUpdate(nextProps, nextState)
    ) {
      return;
    }

    // 下面要进行更新
    let preRenderedUnitInstance = this._renderedUnitInstance; //unit实例  上面有getMarkUp函数  可以生成html
    let preRenderedElement = preRenderedUnitInstance._currentElement; //虚拟DOM
    let nextRenderElement = this._componentInstance.render();

    // 如果新旧两个元素类型一样，则可以进行深度比较，如果不一样，直接干掉老的元素，新建新的
    if (shouldDeepCompare(preRenderedElement, nextRenderElement)) {
      // 如果可以进行深比较，则把更新的工作交给上次渲染出来的那个element元素对应的unit来处理
      console.log(preRenderedUnitInstance, "preRenderedUnitInstance");
      preRenderedUnitInstance.update(nextRenderElement);
      this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();
    } else {
      this._renderedUnitInstance = createUnit(nextRenderElement);
      let nextMarkUp = this._renderedUnitInstance.getMarkUp(this._reactid);
      $(`[data-reactid="${this._reactid}"]`).replaceWith(nextMarkUp);
    }

    // console.log("update", this._componentInstance.state);
  }
  getMarkUp(reactid) {
    this._reactid = reactid;
    // type=Component=Counter类   props:{name:'计算器'}
    let { type: Component, props } = this._currentElement;
    let componentInstance = (this._componentInstance = new Component(props));
    // 让组件的实例是currentUnit属性等于当前的unit
    componentInstance._currentUnit = this;
    // 如果有组件将要渲染的函数的话让他执行
    componentInstance.componentWillMount && componentInstance.componentWillMount();
    // 调用组件的render方法，获得要渲染的元素
    let renderedElement = componentInstance.render();
    // 然后得到这个元素对象的unit
    let renderedUnitInstance = (this._renderedUnitInstance = createUnit(renderedElement));
    // 通过unit可以获得他的html  标记markup
    let renderedMarkUp = renderedUnitInstance.getMarkUp(this._reactid);
    $(document).on("mounted", () => {
      componentInstance.componentDidMount && componentInstance.componentDidMount();
    });
    return renderedMarkUp;
  }
}

function shouldDeepCompare(oldElement, newElement) {
  if (oldElement !== null && newElement !== null) {
    let oldType = typeof oldElement;
    let newType = typeof newElement;
    if ((oldType === "string" || oldType === "number") && (newType === "string" || newType == "number")) {
      return true;
    }

    if (oldElement instanceof Element && newElement instanceof Element) {
      return oldElement.type === newElement.type;
    }
  }

  return false;
}

function createUnit(element) {
  if (typeof element == "string" || typeof element == "number") {
    return new TextUnit(element);
  }
  if (element instanceof Element && typeof element.type == "string") {
    // 虚拟DOM
    console.log(element, "elemnet  虚拟DOM");
    return new NativeUnit(element);
  }

  if (element instanceof Element && typeof element.type == "function") {
    console.log(element, "组件");

    return new CompositeUnit(element);
  }
}

export { createUnit };
