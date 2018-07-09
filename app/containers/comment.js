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

const mapStateToProps = (state) => {
    const {
        user
    } = state.get('app');

    const {
        isSending
    } = state.get('comments');

    return {
        user,
        isSending
    }

};

function mapDispatchToProps (dispatch) {
    return bindActionCreators(commentActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer)
