import React from "react";
import { NavBar } from "antd-mobile";
import PropTypes from "prop-types";


const NavBarAgain=function NavBarAgain(props){
    let {title='个人中心'}=props
    const handleBack=()=>{


    }
    return <NavBar onBack={handleBack}>{title}</NavBar>

}


NavBarAgain.propTypes={
    title:PropTypes.string
}

export default NavBarAgain