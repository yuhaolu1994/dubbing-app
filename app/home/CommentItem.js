import React from "react";
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";

const screenWidth = Dimensions.get('window').width;

export default class CommentItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View key={this.props.id} style={styles.replyBox}>
                <Image style={styles.replyAvatar} source={{uri: this.props.avatar}}/>
                <View style={styles.reply}>
                    <Text style={styles.replyNickname}>{this.props.nickname}</Text>
                    <Text style={styles.replyContent}>{this.props.content}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        // fontSize: 18
    },
    replyContent: {
        marginTop: 4,
        // fontSize: 16,
        color: '#666'
    }
});