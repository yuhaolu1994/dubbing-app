import React from "react";
import {ImageBackground, Text, TouchableHighlight, View, StyleSheet, Dimensions, TouchableOpacity, Alert} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {config} from "../utils/Config";
import HttpUtils from "../utils/HttpUtils";

let width = Dimensions.get('window').width;

export default class VideoItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: this.props.liked
        };
    }

    _up() {
        let up = !this.state.liked;
        let url = config.api.base + config.api.up;
        let body = {
            _id: this.props._id,
            up: up ? 'yes' : 'no',
            accessToken: this.props.accessToken
        };
        let that = this;

        HttpUtils.post(url, body)
            .then((data) => {
                if (data.success) {
                    that.setState({
                        liked: up
                    });
                } else {
                    Alert.alert('Like failed, try again');
                }
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Like failed, try again');
            });

    }


    render() {
        return (
            <TouchableHighlight>
                <View style={styles.item}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <TouchableOpacity onPress={() => this.props.navigate('Details', {
                        videoUri: this.props.video,
                        author_avatar: this.props.author_avatar,
                        nickname: this.props.nickname,
                        title: this.props.title,
                        user: this.props.user,
                        creation_id: this.props._id
                    })}>
                        <ImageBackground
                            source={{uri: this.props.qiniu_thumb}}
                            style={styles.thumb}
                            resizeMode='cover'
                        >
                            <Ionicons
                                name={'ios-play'}
                                size={28}
                                style={styles.play}
                            />
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={styles.itemFooter}>
                        <View style={styles.handleBox}>
                            <Ionicons
                                onPress={() => this._up()}
                                name={this.state.liked ? 'ios-heart' : 'ios-heart-outline'}
                                size={28}
                                style={[styles.up, this.state.liked ? null : styles.down]}
                            />
                            <Text
                                style={styles.handleText}
                                onPress={() => this._up()}
                            >Like</Text>
                        </View>

                        <View style={styles.handleBox}>
                            <Ionicons
                                name={'ios-chatboxes-outline'}
                                size={28}
                                style={styles.commentIcon}
                            />
                            <Text style={styles.handleText}>Comment</Text>
                        </View>
                    </View>

                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    header: {
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    item: {
        width: width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumb: {
        width: width,
        height: width * 0.56
    },
    title: {
        padding: 10,
        fontSize: 18,
        color: '#333',
        textAlign: 'center'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },
    handleBox: {
        padding: 10,
        flexDirection: 'row',
        width: width / 2 - 0.5,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    play: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 18,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#ed7b66'
    },
    handleText: {
        paddingLeft: 12,
        fontSize: 18,
        color: '#333'
    },
    down: {
        fontSize: 22,
        color: '#333'
    },
    up: {
        fontSize: 22,
        color: '#ed7b66'
    },
    commentIcon: {
        fontSize: 22,
        color: '#333'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        margin: 2
    },
    loadMoreText: {
        color: '#ed7b66',
    }
});