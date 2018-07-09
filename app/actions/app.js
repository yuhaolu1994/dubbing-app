import {AsyncStorage} from 'react-native';
import * as types from './actionTypes';
import HttpUtils from "../common/HttpUtils";
import {config} from "../common/Config";

export const popAlert = (title, content) => {
    return (dispatch, getState) => {
        dispatch({
            type: types.SHOW_ALERT,
            payload: {
                title: title,
                content: content
            }
        });

        setTimeout(function () {
            dispatch({
                type: types.HIDE_ALERT
            })
        }, 1500)
    }
};

export const afterLogin = (user) => {
    return (dispatch, getState) => {
        AsyncStorage
            .setItem('user', JSON.stringify(user))
            .then(() => {
                dispatch({
                    type: types.USER_LOGINED,
                    payload: {
                        user: user
                    }
                })
            })
    }
};

export const appBooted = () => {
    return {
        type: types.APP_BOOTED
    }
};

export const enteredSlide = () => {
    return (dispatch, getState) => {
        AsyncStorage
            .setItem('entered', 'yes')
            .then(() => {
                dispatch({
                    type: types.ENTER_SLIDE
                })
            })
    }
};

export const willEnterApp = () => {
    return (dispatch, getState) => {
        AsyncStorage
            .multiGet(['user', 'entered'])
            .then((data) => {
                let user = data[0];
                let entered = data[1];

                dispatch({
                    type: types.WILL_ENTER_APP,
                    payload: {
                        user: user,
                        entered: entered
                    }
                });
            })
    }
};

export const checkUserStatus = () => {
    return (dispatch, getState) => {
        AsyncStorage.getItem('user')
            .then(function (data) {
                data = JSON.parse(data);

                if (data && data.accessToken) {
                    dispatch({
                        type: types.USER_LOGINED,
                        payload: {
                            user: data
                        }
                    })
                }
                else {
                    dispatch({
                        type: types.USER_LOGOUT
                    })
                }
            })
    }
};

export const updateUserInfo = (userInfo) => {
    return (dispatch, getState) => {
        const url = config.api.update;

        return HttpUtils
            .post(url, userInfo)
            .then(data => {
                if (data && data.success) {
                    AsyncStorage.setItem('user', JSON.stringify(data.data));

                    dispatch({
                        type: types.USER_UPDATED,
                        payload: {
                            user: data.data,
                        }
                    })
                }
            })
    }
};

export const logout = () => {
    return (dispatch, getState) => {
        AsyncStorage.multiRemove(['user', 'logined', 'booted', 'entered'])
            .then(() => {
                dispatch({
                    type: types.USER_LOGOUT
                })
            })
    }
};