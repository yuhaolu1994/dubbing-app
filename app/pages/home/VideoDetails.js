import {
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";
import React from "react";
import Video from "react-native-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import {video} from "../../common/ThumbUtils";
import CommentList from '../comment/list'

const screenWidth = Dimensions.get('window').width;

export default class VideoDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // video loads
            playing: false,
            videoOK: true,
            videoLoaded: false,
            paused: false,
            videoTotal: 0.0,
            currentTime: 0.0,
            duration: 0.0,

            // video player
            rate: 1,
            repeat: false,
            muted: false,
            resizeMode: 'contain',
        };
    }

    _onLoaded = (data) => {
        this.setState({
            duration: data.duration
        })
    };
    
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration)
        } else {
            return 0
        }
    }

    _onProgress = (data) => {
        if (data.playableDuration === 0) {
            this.setState({
                currentTime: this.state.duration,
                playing: false
            })
        } else {
            if (!this.state.videoLoaded) {
                this.setState({
                    videoLoaded: true
                });
            }

            let newState = {
                currentTime: data.currentTime
            };

            if (!this.state.videoLoaded) {
                newState.videoLoaded = true
            }

            if (!this.state.playing) {
                newState.playing = true
            }

            this.setState(newState);
        }
    };

    _onEnd = () => {
        this.setState({
            currentTime: this.state.duration,
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

    render() {
        const data = this.props.rowData;
        const videoCompleted = this.getCurrentTimePercentage();

        return (
            <View style={styles.container}>
                <View style={styles.videoBox}>
                    <Video
                        ref={(ref) => this.videoPlayer = ref}
                        source={{uri: video(data.qiniu_video)}}
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
                    <View style={[styles.progressBar, {width: videoCompleted * screenWidth}]}/>
                </View>

                <CommentList
                    rowData={data}
                    navigation={this.props.navigation}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
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
});