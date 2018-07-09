import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    FlatList, Image, TextInput,
} from "react-native";
import React from "react";
import {avatar} from "../../common/ThumbUtils";
import NoMore from "../../components/nomore";
import Loading from "../../components/loading";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as commentActions from '../../actions/comment';

const screenWidth = Dimensions.get('window').width;

class Comment extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount () {
        this.props.fetchComments(this.props.rowData._id)
    }

    _renderItem(item) {
        return (
            <View key={item._id} style={styles.replyBox}>
                <Image style={styles.replyAvatar} source={{uri: avatar(item.replyBy.avatar)}}/>
                <View style={styles.reply}>
                    <Text style={styles.replyNickname}>{item.replyBy.nickname}</Text>
                    <Text style={styles.replyContent}>{item.content}</Text>
                </View>
            </View>
        );
    }

    _focus() {
        this.props.navigation.navigate('Comment', {
            rowData: this.props.rowData
        })
    }

    _renderHeader() {
        const data = this.props.rowData;

        return (
            <View style={styles.listHeader}>
                <View style={styles.infoBox}>
                    <Image style={styles.avatar} source={{uri: avatar(data.author.avatar)}}/>
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>{data.author.nickname}</Text>
                        <Text style={styles.title}>{data.title}</Text>
                    </View>
                </View>

                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            placeholder="Write your comment here"
                            sytle={styles.content}
                            multiline={true}
                            onFocus={this._focus.bind(this)}
                        />
                    </View>
                </View>

                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>Hot comments</Text>
                </View>
            </View>
        );
    }

    _hasMoreData() {
        const {
            commentList,
            commentTotal
        } = this.props;

        return commentList.length < commentTotal;
    }

    _fetchMoreData() {
        const {
            isCommentLoadingTail,
            fetchComments
        } = this.props;

        if (this._hasMoreData() || isCommentLoadingTail) {
            fetchComments(this.props.rowData._id);
        }
    }

    _renderFooter() {
        const {
            commentTotal,
            isCommentLoadingTail
        } = this.props;

        if (!this._hasMoreData() || commentTotal === 0) {
            return <NoMore/>
        }

        if (isCommentLoadingTail) {
            return <Loading/>;
        }

        return null;
    }

    render() {
        const {
            commentList
        } = this.props;

        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={commentList}
                    renderItem={({item}) => this._renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}

                    ListHeaderComponent={this._renderHeader.bind(this)}
                    ListFooterComponent={this._renderFooter.bind(this)}

                    onEndReached={this._fetchMoreData.bind(this)}
                />

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        user
    } = state.get('app');

    const {
        isCommentRefreshing,
        isCommentLoadingTail,
        commentList,
        commentTotal,
        popup,
        page
    } = state.get('comments');

    return {
        isCommentRefreshing,
        isCommentLoadingTail,
        commentList,
        commentTotal,
        popup,
        page,
        user
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(commentActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    infoBox: {
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    avatar: {
        width: 60,
        height: 60,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 30
    },
    descBox: {
        flex: 1
    },
    nickname: {
        fontSize: 18
    },
    title: {
        marginTop: 8,
        fontSize: 16,
        color: '#666'
    },
    listHeader: {
        width: screenWidth,
        marginTop: 10,
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
    commentArea: {
        width: screenWidth,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    replyBox: {
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    replyAvatar: {
        width: 40,
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20
    },
    reply: {
        flex: 1
    },
    replyNickname: {
        color: '#666',
    },
    replyContent: {
        marginTop: 4,
        color: '#666'
    }
});