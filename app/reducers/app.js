// use import * as reducers to get them as an object with their names as the keys
import * as types from '../actions/actionTypes';

const initialState = {
    user: null,
    popup: null,
    welcomed: false,
    logined: false,
    booted: false,
    entered: false,
    sliderLoop: false,
    banners: [
        require('../static/images/s1.jpg'),
        require('../static/images/s2.jpg'),
        require('../static/images/s3.jpg')
    ]
};

// Actions are the only way to get data into the store
export default appReducer = (state = initialState, action) => {
    // the standard approach is definitely using a switch statement
    // or a lookup table based on type
    switch (action.type) {
        case types.SHOW_ALERT:
            // Using Object Spread Operator
            // return { ...state, ...newData }
            return {
                ...state,
                popup: {
                    title: action.payload.title,
                    content: action.payload.content,
                }
            };

        case types.HIDE_ALERT:
            return {
                ...state,
                popup: null
            };

        case types.APP_BOOTED: {
            return {
                ...state,
                booted: true
            }
        }

        case types.USER_LOGINED: {
            return {
                ...state,
                logined: true,
                user: action.payload.user
            }
        }

        case types.USER_LOGOUT:
            return {
                ...state,
                user: null,
                logined: false
            };

        case types.USER_UPDATED:
            return {
                ...state,
                user: action.payload.user,
                logined: true,
            };

        case types.ENTER_SLIDE: {
            return {
                ...state,
                entered: true
            }
        }

        case types.WILL_ENTER_APP: {
            let userData = action.payload.user;
            let entered = action.payload.entered;
            let newState = {
                booted: true
            };
            
            if (entered && entered[1] === 'yes') {
                newState.entered = true
            }

            if (userData && userData[1]) {
                let user = JSON.parse(userData[1]);

                if (user && user.accessToken) {
                    newState.logined = true;
                    newState.user = user;
                }
            }

            return {
                ...state,
                ...newState
            }
        }

        default:
            return state
    }
}