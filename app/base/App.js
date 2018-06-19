import React from "react";
import {AppTabNavigator} from "../home/BottomTabIndex";
import {AsyncStorage} from "react-native";
import Login from "../account/Login";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            login: false
        }
    }

    componentDidMount() {
        this._asyncAppStatus();
    }

    _asyncAppStatus() {
        let that = this;
        AsyncStorage.getItem('user')
            .then((data) => {
                let user;
                let newState = {};

                if (data) {
                    user = JSON.parse(data);
                }

                if (user.accessToken !== null) {
                    newState.user = user;
                    newState.login = true;
                } else {
                    newState.login = false;
                }

                that.setState(newState);

            })
            .catch((error) => {
                console.log(error);
            })
    }

    _afterLogin(user) {

        let that = this;
        user = JSON.stringify(user);
        AsyncStorage.setItem('user', user)
            .then(() => {
                that.setState({
                    login: true,
                    user: user
                });

            })
            .catch((error) => {
                console.log(error);
            })

    }


    render() {

        if (!this.state.login) {
            return <Login _afterLogin={(user) => this._afterLogin(user)}/>;
        }

        return <AppTabNavigator />;
    }
}