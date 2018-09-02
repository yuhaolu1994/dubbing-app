import React from "react";
import {connect} from 'react-redux';
import Comment from '../pages/comment/index';
import * as commentActions from '../actions/comment';
import {bindActionCreators} from "redux";

class CommentContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    _submit(content) {
        this.props.sendComment({
            creation: this.props.navigation.state.params.rowData._id,
            content: content
        })
            .then(() => {
                this.props.navigation.goBack()
            })
    }

    render() {

        return (
            <Comment
                submit={this._submit.bind(this)}
                {...this.props}/>
        )
    }
}

// state in store update => UI props update
const mapStateToProps = (state) => {

    // state tree in store
    // result of combineReducers: { app: {...}, creations: {...}, comments: {...} }
    const {
        user
    } = state.get('app');

    const {
        isSending
    } = state.get('comments');

    // any time the store is updated, mapStateToProps will be called.
    // The results of mapStateToProps must be a plain object,
    // which will be merged into the component’s props
    return {
        user,
        isSending
    }

};

function mapDispatchToProps (dispatch) {
    // boundActionCreators  = (id) => dispatch(toggleTodo(id))
    // wrap action creator with dispatch(), merge into props
    return bindActionCreators(commentActions, dispatch)
}

// inject store state and all action creators to component props
export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer)
