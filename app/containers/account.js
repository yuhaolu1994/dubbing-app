import React from "react";
import {connect} from 'react-redux';
import Account from '../pages/account/Profile';
import * as appActions from '../actions/app';
import {bindActionCreators} from "redux";

class AccountContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Account {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        user
    } = state.get('app');

    return {
        user,
    }

};

function mapDispatchToProps (dispatch) {
    return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer)
