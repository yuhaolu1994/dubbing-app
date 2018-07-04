import {
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    FlatList, Image, TextInput, Modal, Alert, AsyncStorage,
} from "react-native";
import React from "react";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import CommentItem from "./CommentItem";
import {config} from "../utils/Config";
import HttpUtils from "../utils/HttpUtils";
import Button from 'react-native-button';
import {avatar, video} from "../utils/ThumbUtils";

const screenWidth = Dimensions.get('window').width;

const cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
};

export default class VideoDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // video loads
            playing: false,
            videoOK: true,
            videoLoaded: false,
            paused: false,
            videoProgress: 0.01,
            videoTotal: 0,
            currentTime: 0,

            // video player
            rate: 1,
            repeat: false,
            muted: false,
            resizeMode: 'contain',

            // comments dataSource
            dataSource: '',
            user: null,


            // modal
            content: '',
            animationType: 'none',
            modalVisible: false,
            isSending: false
        };
    }

    _onLoaded = (data) => {
        // console.log(data)
    };

    _onProgress = (data) => {
        if (!this.state.videoLoaded) {
            this.setState({
                videoLoaded: true
            });
        }
        let duration = data.playableDuration;
        let currentTime = data.currentTime;
        let percent = Number((currentTime / duration).toFixed(2));
        let newState = {
            videoTotal: duration,
            currentTime: Number(data.currentTime.toFixed(2)),
            videoProgress: percent
        };

        if (!this.state.videoLoaded) {
            newState.videoLoaded = true;
        }

        if (!this.state.playing) {
            newState.playing = true;
        }

        this.setState(newState);
    };

    _onEnd = () => {
        this.setState({
            videoProgress: 1,
            playing: false,
            paused: true
        });
    };

    _onError = () => {
        this.setState({
            videoOK: false
        });
    };

    _rePlay() {
        this.videoPlayer.seek(0);
        this.setState({
            paused: false
        });
    };

    _pause() {
        if (!this.state.paused) {
            this.setState({
                paused: true
            });
        }
    }

    _resume() {
        if (this.state.paused) {
            this.setState({
                paused: false
            });
        }
    }

    _renderItem(item) {
        return (
            <CommentItem
                id={item._id}
                avatar={avatar(this.state.user.avatar)}
                nickname={this.state.user.nickname}
                content={item.content}
            />
        );
    }

    componentDidMount() {

        let that = this;

        AsyncStorage.getItem('user')
            .then((data) => {
                let user;

                if (data) {
                    user = JSON.parse(data);
                }

                if (user && user.accessToken) {
                    that.setState({
                        user: user
                    }, () => {
                        that._fetchData();
                    });
                }
            });

    }

    _fetchData(page) {

        let that = this;

        this.setState({
            isLoadingTail: true
        });

        HttpUtils.get(config.api.base + config.api.comment, {
            accessToken: this.state.user.accessToken,
            page: page,
            creation: this.props.navigation.getParam('creation_id', 'no_id')
        })
            .then((data) => {
                if (data && data.success) {

                    if (data.data.length > 0) {

                        let items = cachedResults.items.slice();

                        cachedResults.items = items.concat(data.data);
                        cachedResults.nextPage += 1;
                        cachedResults.total = data.total;

                        that.setState({
                            isLoadingTail: false,
                            dataSource: cachedResults.items
                            // dataSource: data.data
                        });

                        cachedResults.items = [];
                    }
                }
            })
            .catch(error => {
                this.setState({
                    isLoadingTail: false,
                });
                console.warn(error)
            });

    }

    _hasMoreData() {
        return cachedResults.items.length !== cachedResults.total;
    }

    _fetchMoreData() {
        // no more data will stop loading more data
        if (!this._hasMoreData() || this.state.isLoadingTail) {
            return;
        }

        let page = cachedResults.nextPage;

        this._fetchData(page);
    }

    _focus() {
        this._setModalVisible(true);
    }


    _closeModal() {
        this._setModalVisible(false);
    }

    _setModalVisible(isVisible) {
        this.setState({
            modalVisible: isVisible
        });
    }

    _submit() {
        let that = this;
        if (!this.state.content) {
            return Alert.alert('No comment!');
        }

        // avoid reClick button
        if (this.state.isSending) {
            return Alert.alert('Is commenting!');
        }

        this.setState({
            isSending: true
        }, () => {
            let body = {
                accessToken: this.state.user.accessToken,
                comment: {
                    creation: this.props.navigation.getParam('creation_id', 'no_id'),
                    content: this.state.content
                }
            };

            let url = config.api.base + config.api.comment;

            HttpUtils.post(url, body)
                .then((data) => {
                    if (data.success) {
                        let items = cachedResults.items.slice();

                        items = data.data.concat(items);
                        cachedResults.items = items;
                        cachedResults.total += 1;

                        that.setState({
                            content: '',
                            isSending: false,
                            dataSource: cachedResults.items
                        });

                        that._setModalVisible(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    that.setState({
                        isSending: false
                    });
                    that._setModalVisible(false);
                    Alert.alert('Comment failed, try again');
                })

        });
    }

    _renderHeader(authorAvatar, nickname, title) {

        return (
            <View style={styles.listHeader}>
                <View style={styles.infoBox}>
                    <Image style={styles.avatar} source={{uri: avatar(authorAvatar)}}/>
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>{nickname}</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                </View>

                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            placeholder="Write your comment here"
                            sytle={styles.content}
                            multiline={true}
                            onFocus={() => this._focus()}
                        />
                    </View>
                </View>

                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>Hot comments</Text>
                </View>
            </View>
        );
    }

    _renderFooter() {
        // no more data will hide the footer
        if (!this._hasMoreData() && cachedResults.total !== 0) {
            return (
                <View style={styles.indicatorContainer}>
                    <Text style={styles.loadMoreText}>No More Comments...</Text>
                </View>
            );
        }

        if (!this.state.isLoadingTail) {
            return <View/>;
        }

        // show footer
        return (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                    size={'small'}
                    animating={true}
                    color={'#ee735c'}
                />
                <Text style={styles.loadMoreText}>Loading...</Text>
            </View>
        );
    }

    render() {
        const {navigation} = this.props;
        const videoUri = navigation.getParam('videoUri', 'NO-URI');
        const authorAvatar = navigation.getParam('author_avatar', 'author_avatar details');
        const nickname = navigation.getParam('nickname', 'nickName details');
        const title = navigation.getParam('title', 'no title');

        return (
            <View style={styles.container}>
                <View style={styles.videoBox}>
                    <Video
                        ref={(ref) => this.videoPlayer = ref}
                        source={{uri: video(videoUri)}}
                        style={styles.video}
                        volume={2.0}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        onLoad={this._onLoaded}
                        onProgress={this._onProgress}
                        onEnd={this._onEnd}
                        onError={this._onError}
                        repeat={this.state.repeat}
                        paused={this.state.paused}
                    />

                    {
                        !this.state.videoOK && <Text style={styles.failText}>Video Loading Problem</Text>
                    }

                    {
                        !this.state.videoLoaded && <ActivityIndicator
                            style={styles.videoIndicator}
                            size={'large'}
                            animating={true}
                            color={'#ee735c'}/>
                    }

                    {
                        this.state.videoLoaded && !this.state.playing
                            ? <Ionicons
                                onPress={() => {
                                    this._rePlay();
                                }}
                                name={'ios-play'}
                                style={styles.playIcon}
                                size={48}
                            />
                            : null
                    }

                    {
                        this.state.videoLoaded && this.state.playing
                            ? <TouchableOpacity onPress={() => {
                                this._pause()
                            }} style={styles.pauseBtn}>
                                {
                                    this.state.paused
                                        ? <Ionicons
                                            onPress={() => {
                                                this._resume()
                                            }}
                                            name={'ios-play'}
                                            size={48}
                                            style={styles.resumeIcon}/>
                                        : <Text/>
                                }
                            </TouchableOpacity>
                            : null
                    }

                </View>

                <View style={styles.progressBox}>
                    <View style={[styles.progressBar, {width: this.state.videoProgress * screenWidth}]}>

                    </View>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.dataSource}
                    renderItem={({item}) => this._renderItem(item)}
                    // not use key
                    keyExtractor={(item, index) => index.toString()}

                    ListHeaderComponent={() => this._renderHeader(authorAvatar, nickname, title)}
                    ListFooterComponent={() => this._renderFooter()}

                    // onEndReached={() => {
                    //     this._fetchMoreData();
                    // }}
                    // onEndReachedThreshold={20}
                />

                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert('Modal has been closed.');
                    }}>
                    <View style={styles.modalContainer}>
                        <Ionicons
                            onPress={() => this._closeModal()}
                            name={'ios-close-outline'}
                            style={styles.closeIcon}
                        />

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
                            onPress={() => this._submit()}>Comment</Button>

                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    modalContainer: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff'
    },
    closeIcon: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#ee753c'
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
        color: '#ee753c'
    },
    videoBox: {
        width: screenWidth,
        height: screenWidth * 9 / 16,
        backgroundColor: '#000'
    },
    video: {
        width: screenWidth,
        height: screenWidth * 9 / 16,
        backgroundColor: '#000'
    },
    videoIndicator: {
        position: 'absolute',
        top: 90,
        alignSelf: 'center',
        backgroundColor: 'transparent'
    },
    progressBox: {
        width: screenWidth,
        height: 2,
        backgroundColor: '#ccc'
    },
    progressBar: {
        width: 1,
        height: 2,
        backgroundColor: '#ff6600'
    },
    playIcon: {
        position: 'absolute',
        top: 90,
        left: screenWidth / 2 - 30,
        width: 60,
        height: 60,
        paddingTop: 8,
        paddingLeft: 22,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        color: '#ed7b66'
    },
    pauseBtn: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: screenWidth,
        height: screenWidth * 9 / 16,
    },
    resumeIcon: {
        position: 'absolute',
        top: 90,
        left: screenWidth / 2 - 30,
        width: 60,
        height: 60,
        paddingTop: 8,
        paddingLeft: 22,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        alignSelf: 'center',
        color: '#ed7b66'
    },
    failText: {
        position: 'absolute',
        top: 90,
        textAlign: 'center',
        color: '#fff',
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
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    indicator: {
        margin: 10
    },
    loadMoreText: {
        margin: 10,
        color: '#ed7b66',
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
    commentTitle: {}
});