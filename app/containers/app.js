import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {AppTabNavigator} from "./BottomTabIndex";
import Login from "../pages/account/Login";
import Slider from '../pages/slider/index';
import Boot from '../components/boot';
import * as appActions from '../actions/app';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.willEnterApp();
    }

    render() {
        if (!this.props.booted) {
            return <Boot {...this.props}/>;
        }

        if (!this.props.entered) {
            return <Slider {...this.props}/>
        }

        if (!this.props.logined) {
            return <Login {...this.props}/>;
        }

        return <AppTabNavigator />;
    }
}

const mapStateToProps = (state) => {
    return {
        // result of combineReducers: { app: {...}, creations: {...}, comments: {...} }
        // state in store update => component props
        booted: state.get('app').booted,
        logined: state.get('app').logined,
        entered: state.get('app').entered,
        banners: state.get('app').banners,
        user: state.get('app').user,
        popup: state.get('app').popup
    }
};

const mapDispatchToProps = (dispatch) => {
    // wrap dispatch with function and merge action creator to props
    return bindActionCreators(appActions, dispatch);
};

// inject store state and all action creators to component props
export default connect(mapStateToProps, mapDispatchToProps)(App)
