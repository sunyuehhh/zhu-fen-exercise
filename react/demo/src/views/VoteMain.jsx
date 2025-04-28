import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class VoteMain extends React.Component{
  render(){
    let {supNum,oppNum}=this.props
    return <div className="vote-box">
      支持人数:{supNum}
      反对人数:{oppNum}

    </div>
  }

}


export default connect((state)=>state.vote)(VoteMain)