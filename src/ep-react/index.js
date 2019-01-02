import React from "react";
import "../eplayer";

class Eplayer extends React.Component {
    render() {
        const { src = "", type = "mp4" } = this.props;
        return <e-player src={src} type={type}></e-player>
    }
}

export default Eplayer;