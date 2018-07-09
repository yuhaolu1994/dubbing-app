import {
    StyleSheet,
    View,
    Dimensions,
    TextInput,
} from "react-native";
import React from "react";
import Button from 'react-native-button';
import Popup from "../../components/popup";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import * as appActions from '../../actions/app'

const screenWidth = Dimensions.get('window').width;

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
    }

    _submit() {
        if (!this.state.content) {
            return this.props.popAlert('Oh no', 'comment cannot be empty')
        }

        if (this.props.isSending) {
            return this.props.popAlert('Oh no', 'Is commenting')
        }

        this.props.submit(this.state.content)
    }

    render() {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            placeholder="Write your comment here"
                            sytle={styles.content}
                            multiline={true}
                            defaultValue={this.state.content}
                            onChangeText={(text) => {
                                this.setState({
                                    content: text
                                })
                            }}
                        />
                    </View>
                </View>

                <Button
                    style={styles.submitBtn}
                    onPress={this._submit.bind(this)}>Comment</Button>

                <Popup {...this.props}/>

            </View>

        )
    }

}

function mapStateToProps (state) {
    return {
        popup: state.get('app').popup
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)

const styles = StyleSheet.create({
    commentContainer: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff'
    },
    submitBtn: {
        width: screenWidth - 20,
        padding: 16,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ee753c',
        borderRadius: 4,
        fontSize: 18,
        color: '#ee753c',
        alignSelf: 'center'
    },
    commentBox: {
        marginTop: 10,
        marginBottom: 10,
        padding: 8,
        width: screenWidth
    },

    content: {
        paddingLeft: 2,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 14,
        height: 80
    },
});