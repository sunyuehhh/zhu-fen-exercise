import React from "./react";
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      odd:true
    }
  }
  componentWillMount() {
    console.log("Counter componentWillMount");
    setTimeout(()=>{
      this.setState({odd:!this.state.odd})
    },1000)
  }

  componentDidMount() {
    console.log("Counter componentDidMount");
    // setInterval(() => {
    //   this.setState({ number: this.state.number + 1 });
    // }, 1000);
  }

  shouldComponentUpdate(nextState, nextProps) {
    return true;
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }


  render() {
    if(this.state.odd){
      return React.createElement('ul',{id:'oldCounter',key:'wrapper'},
        React.createElement('li',{key:'A'},'A'),
        React.createElement('li',{key:'B'},'B'),
        React.createElement('li',{key:'C'},'C'),
        React.createElement('li',{key:'D'},'D')
      )
    }

    return React.createElement('ul',{id:'newCounter',key:'wrapper'},
      React.createElement('li',{key:'A'},'A1'),
      React.createElement('li',{key:'C'},'C1'),
      React.createElement('li',{key:'B'},'B1'),
      React.createElement('li',{key:'E'},'E1'),
      React.createElement('li',{key:'F'},'F1')
    )

  }
}

// <Counter name="计数器">
let element = React.createElement(Counter, { name: "计数器" });
React.render(element, document.getElementById("root"));