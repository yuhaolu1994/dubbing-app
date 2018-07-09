import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as creationActions from '../actions/creation';
import CreateVideo from '../pages/creation/CreateVideo';

class EditContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CreateVideo {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        user,
    } = state.get('app');

    return {
        user,
    }

};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(creationActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditContainer)
