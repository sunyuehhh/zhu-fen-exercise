import React from "react";
import styled from "styled-components";
import { HashRouter,Link} from "react-router-dom";
import RouterView from "./router";
const NavBox=styled.nav`
a{
margin-right:10px;
color:#000;
}
`;

const App=function App(){
  return <HashRouter>
  <NavBox>
    <Link to="/a">A</Link>
    <Link to="/b">B</Link>
    
  </NavBox>
  <div className="content">
    <RouterView></RouterView>

  </div>
  </HashRouter>
}


export default App


