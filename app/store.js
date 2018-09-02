import {applyMiddleware, createStore} from 'redux';
import {fromJS} from 'immutable';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';

import reducers from './reducers';

const logger = createLogger();

// the order of middleware is important, logger is the last
// thunk and promise are for async operation
const middleWares = [
    thunk,
    promiseMiddleware,
    logger
];

// if you have objects inside arrays or arrays inside objects and want them too to be immutable,
// your choice is Immutable.fromJS
function configureStore(initialState = fromJS({})) {
    // the only store enhancer
    const enhancer = applyMiddleware(...middleWares);
    const store = createStore(reducers(), initialState, enhancer);

    // enable hot reloading on Redux store, use HMR API
    if (module.hot) {
        module.hot.accept(() => {
            // need replaceReducer if you implement a hot reloading mechanism for Redux.
            store.replaceReducer(require('./reducers').default);
        });
    }

    // An object that holds the complete state of your app
    // only a single store in your app
    return store;
}

export default configureStore();