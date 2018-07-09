import React from "react";
import {connect} from 'react-redux';
import VideoDetails from '../pages/home/VideoDetails';

class DetailContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const rowData = this.props.navigation.state.params.rowData;

        return (
            <VideoDetails
                rowData={rowData}
                {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        user
    } = state.get('app');

    return {
        user
    }

};

export default connect(mapStateToProps)(DetailContainer)
