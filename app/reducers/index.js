import {combineReducers} from 'redux-immutable';

import app from './app';
import creations from './creation';
import comments from './comment';

// ES6 property shorthand notation
// equals to reducers = { app: app, creations: creations, comments: comments }
const reducers = {
    app,
    creations,
    comments
};

// result of combineReducers: { app: {...}, creations: {...}, comments: {...} }
export default function createReducer() {
    return combineReducers(reducers)
}