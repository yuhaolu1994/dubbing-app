import React from "react";
import {ImageBackground, Text, TouchableHighlight, View, StyleSheet, Dimensions, TouchableOpacity,} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {config} from "../../common/Config";
import HttpUtils from "../../common/HttpUtils";
import {thumb} from "../../common/ThumbUtils";


let width = Dimensions.get('window').width;

export default class VideoItem extends React.Component {
    constructor(props) {
        super(props);
        const row = this.props.row;

        this.state = {
            up: row.liked,
            row: row
        };
    }

    _up() {
        let up = !this.state.up;
        let url = config.api.up;
        let body = {
            _id: this.props._id,
            up: up ? 'yes' : 'no',
            accessToken: this.props.user.accessToken
        };

        let that = this;

        HttpUtils.post(url, body)
            .then((data) => {
                if (data && data.success) {
                    that.setState({
                        up: up
                    });
                } else {
                    that.props.popAlert('Oh no', 'Like failed, try again');
                }
            })
            .catch((error) => {
                console.log(error);
                that.props.popAlert('Oh no', 'Like failed, try again');
            });

    }


    render() {
        const row = this.state.row;
        return (
            <TouchableHighlight>
                <View style={styles.item}>
                    <Text style={styles.title}>{row.title}</Text>
                    <TouchableOpacity onPress={this.props.onSelect.bind(this)}>
                        <ImageBackground
                            source={{uri: thumb(row.qiniu_thumb)}}
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
                                onPress={this._up.bind(this)}
                                name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                                size={28}
                                style={[styles.up, this.state.up ? null : styles.down]}/>
                            <Text
                                style={styles.handleText}
                                onPress={this._up.bind(this)}>Like</Text>
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