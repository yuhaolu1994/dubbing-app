import React from "react";
import {connect} from 'react-redux';
import AccountUpdate from '../pages/account/AccountUpdate';
import * as appActions from '../actions/app';
import {bindActionCreators} from "redux";

class AccountUpdateContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AccountUpdate {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        user,
        popup
    } = state.get('app');

    return {
        user,
        popup
    }

};

function mapDispatchToProps (dispatch) {
    return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountUpdateContainer)
