import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    ProgressBarAndroid,
    AsyncStorage
} from "react-native";
import ImagePicker from "react-native-image-picker";
import Video from "react-native-video";
import HttpUtils from "../utils/HttpUtils";
import {config} from "../utils/Config";
import CountDownText from "../utils/CountDownText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import _ from 'lodash';
import * as Progress from 'react-native-progress';


let width = Dimensions.get('window').width;
// let height = Dimensions.get('window').height;

const videoOptions = {
    title: 'Select Video',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take 10s video',
    chooseFromLibraryButtonTitle: 'Choose exist video',
    videoQuality: 'medium',
    mediaType: 'video',
    durationLimit: 10,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

let defaultState = {
    user: null,
    previewVideo: null,

    videoId: null,
    audioId: null,

    // video upload
    video: null,
    videoUploaded: false,
    videoUploading: false,
    videoUploadedProgress: 0.14,

    // video loads
    videoProgress: 0.01,
    videoTotal: 0,
    currentTime: 0,
    paused: false,

    // count down
    counting: false,
    recording: false,

    // video player
    rate: 1,
    repeat: false,
    muted: true,
    resizeMode: 'contain',

    // audio
    audio: null,
    audioPlaying: false,
    recordDone: false,

    audioPath: AudioUtils.MusicDirectoryPath + '/voice.aac',

    audioUploaded: false,
    audioUploading: false,
    audioUploadedProgress: 0.14,
};

export default class CreateVideo extends React.Component {
    constructor(props) {
        super(props);
        let user = this.props.screenProps.user || {};
        let state = _.clone(defaultState);
        state.user = user;
        this.state = state;
    }

    _onLoaded = (data) => {
        console.log(data)
    };

    _onProgress = (data) => {
        let duration = data.playableDuration;
        let currentTime = data.currentTime;
        let percent = Number((currentTime / duration).toFixed(2));

        this.setState({
            videoTotal: duration,
            currentTime: Number(data.currentTime.toFixed(2)),
            videoProgress: percent,
        });
    };

    _onEnd = async () => {

        if (this.state.recording) {

            try {
                let audioPath = await AudioRecorder.stopRecording();
                console.log(audioPath);
            } catch (error) {
                console.error(error);
            }

            this.setState({
                videoProgress: 1,
                recordDone: true,
                recording: false,
                paused: true
            });
        }

        this.setState({
            videoProgress: 1,
            paused: true
        });

    };

    _onError = () => {
        this.setState({
            videoOK: false
        });
    };

    _preview() {
        this.setState({
            videoProgress: 0,
            audioPlaying: true
        });


        const sound = new Sound(this.state.audioPath, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            }

            sound.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });

        setTimeout(() => {
            this.videoPlayer.seek(0);

            this.setState({
                paused: false
            });
        }, 500);

    }

    async _record() {
        this.videoPlayer.seek(0);

        this.setState({
            videoProgress: 0,
            counting: false,
            recording: true,
            recordDone: false,
            paused: false
        });

        this._initAudio();

        try {
            await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _counting() {
        if (!this.state.counting && !this.state.recording && !this.state.audioPlaying) {
            this.setState({
                counting: true
            });

            this.videoPlayer.seek(this.state.videoTotal - 0.01);
        }
    }

    componentDidMount() {
        this._getUser();
        this._initAudio();
    }

    _getUser() {
        let that = this;

        AsyncStorage.getItem('user')
            .then((data) => {
                let user;

                if (data) {
                    user = JSON.parse(data);
                }

                if (user.accessToken !== null) {
                    that.setState({
                        user: user
                    });
                }
            });

    }

    _uploadAudio() {
        let that = this;
        let tags = 'app,audio';
        let folder = 'audio';
        let timestamp = Date.now();

        this._getToken({
            type: 'audio',
            timestamp: timestamp,
            cloud: 'cloudinary',
        })
            .catch((err) => {
                console.log(err);
            })
            .then((data) => {
                if (data && data.success) {
                    console.log(data);
                    // data.data
                    let signature = data.data.token;
                    let key = data.data.key;
                    let body = new FormData();

                    body.append('folder', folder);
                    body.append('signature', signature);
                    body.append('tags', tags);
                    body.append('timestamp', timestamp);
                    body.append('api_key', config.cloudinary.api_key);
                    body.append('resource_type', 'video');
                    body.append('file', {
                        type: 'video/mp4',
                        uri: 'file://' + that.state.audioPath,
                        name: key
                    });

                    that._upload(body, 'audio')
                }
            })
    }

    _initAudio() {
        let audioPath = this.state.audioPath;

        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    _getToken(body) {
        let signatureURL = config.api.base + config.api.signature;

        body.accessToken = this.state.user.accessToken;

        return HttpUtils.post(signatureURL, body);
    }

    _pickVideo() {
        let that = this;

        ImagePicker.showImagePicker(videoOptions, (response) => {
            if (response.didCancel) {
                return;
            }

            let uri = response.uri;
            let state = _.clone(defaultState);

            state.previewVideo = uri;
            state.user = that.state.user;

            that.setState(state);

            that._getToken({
                type: 'video',
                cloud: 'qiniu'
            })
                .catch((error) => {
                    console.log(error);
                    Alert.alert('upload failed');
                })
                .then((data) => {
                    if (data && data.success) {
                        let token = data.data.token;
                        let key = data.data.key;
                        let body = new FormData();

                        body.append('token', token);
                        body.append('key', key);
                        body.append('file', {
                            type: 'video/mp4',
                            uri: that.state.previewVideo,
                            name: key
                        });

                        that._upload(body, 'video');
                    }
                })


        });
    }


    _upload(body, type) {

        console.log(body);

        let that = this;
        let xhr = new XMLHttpRequest();
        let url = config.qiniu.upload;

        if (type === 'audio') {
            url = config.cloudinary.video;
            console.log('url', url);
        }

        let state = {};
        state[type + 'UploadedProgress'] = 0;
        state[type + 'Uploading'] = true;
        state[type + 'Uploaded'] = false;


        this.setState(state);

        xhr.open('POST', url);

        xhr.onload = (() => {

            if (xhr.status !== 200) {
                Alert.alert('Request failed');
                console.log(xhr.responseText);
                return;
            }

            if (!xhr.responseText) {
                Alert.alert('Request failed');
                return;
            }

            let response;

            try {
                response = JSON.parse(xhr.response);
            } catch (e) {
                console.log(e);
                console.log('parse fails');
            }

            if (response) {
                console.log(response);

                let newState = {};
                newState[type] = response;
                newState[type + 'Uploading'] = false;
                newState[type + 'Uploaded'] = true;
                if (type !== 'audio') {
                    newState['previewVideo'] = config.qiniu.video + response.key;
                }

                that.setState(newState);

                let updateURL = config.api.base + config.api[type];
                let accessToken = this.state.user.accessToken;
                let updateBody = {
                    accessToken: accessToken
                };

                updateBody[type] = response;

                if (type === 'audio') {
                    updateBody.videoId = that.state.videoId;
                }

                HttpUtils
                    .post(updateURL, updateBody)
                    .catch((err) => {
                        console.log(err);
                        if (type === 'video') {
                            Alert.alert('Video async failed, upload again!');
                        }
                        else if (type === 'audio') {
                            Alert.alert('Audio async failed, upload again!');
                        }
                    })
                    .then((data) => {
                        if (data && data.success) {
                            let mediaState = {};
                            mediaState[type + 'Id'] = data.data;
                            that.setState(mediaState);
                        } else {
                            if (type === 'video') {
                                Alert.alert('Video async failed, upload again!');
                            }
                            else if (type === 'audio') {
                                Alert.alert('Audio async failed, upload again!');
                            }
                        }
                    })


            }
        });

        if (xhr.upload) {
            let that = this;
            xhr.upload.onprogress = ((event) => {
                if (event.lengthComputable) {
                    let percent = Number((event.loaded / event.total).toFixed(2));

                    let progressState = {};

                    progressState[type + 'UploadedProgress'] = percent;

                    that.setState(progressState);
                }
            });
        }

        xhr.send(body);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#ee735c"
                />

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {this.state.previewVideo ? 'Enjoy your dubbing' : 'Create Your Voice'}
                    </Text>
                    {
                        this.state.previewVideo && this.state.videoUploaded
                            ? <Text style={styles.toolbarEdit}
                                    onPress={() => this._pickVideo()}>Change video</Text>
                            : null
                    }
                </View>

                <View style={styles.page}>
                    {
                        this.state.previewVideo
                            ? <View style={styles.videoContainer}>
                                <View style={styles.videoBox}>
                                    <Video
                                        ref={(ref) => this.videoPlayer = ref}
                                        source={{uri: this.state.previewVideo}}
                                        style={styles.video}
                                        volume={2.0}
                                        rate={this.state.rate}
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
                                        !this.state.videoUploaded && this.state.videoUploading
                                            ? <View style={styles.progressTipBox}>
                                                <ProgressBarAndroid
                                                    style={styles.progressBar}
                                                    styleAttr="Horizontal"
                                                    indeterminate={false}
                                                    color='#ee735c'
                                                    progress={this.state.videoUploadedProgress}/>
                                                <Text style={styles.progressTip}>
                                                    Producing the muted video,
                                                    finish {(this.state.videoUploadedProgress * 100).toFixed(2)}%
                                                </Text>
                                            </View>
                                            : null
                                    }

                                    {
                                        this.state.recording || this.state.audioPlaying
                                            ? <View style={styles.progressTipBox}>
                                                <ProgressBarAndroid
                                                    style={styles.progressBar}
                                                    styleAttr="Horizontal"
                                                    indeterminate={false}
                                                    color='#ee735c'
                                                    progress={this.state.videoProgress}/>

                                                {
                                                    this.state.recording
                                                        ? <Text style={styles.progressTip}>
                                                            Recording your voice...
                                                        </Text>
                                                        : null
                                                }
                                            </View>
                                            : null
                                    }

                                    {
                                        this.state.recordDone
                                            ? <View style={styles.previewBox}>
                                                <Ionicons
                                                    name={'md-play'}
                                                    size={20}
                                                    style={styles.previewIcon}/>
                                                <Text
                                                    onPress={() => {
                                                        this._preview()
                                                    }}
                                                    style={styles.previewText}>
                                                    Preview</Text>
                                            </View>
                                            : null
                                    }

                                </View>
                            </View>
                            : <TouchableOpacity style={styles.uploadContainer}
                                                onPress={() => this._pickVideo()}>
                                <View style={styles.uploadBox}>
                                    <Image
                                        source={require('../assets/images/record.jpg')}
                                        style={styles.uploadIcon}
                                    />
                                    <Text style={styles.uploadTitle}>click to upload video</Text>
                                    <Text style={styles.uploadDesc}>video no longer than 20s</Text>
                                </View>
                            </TouchableOpacity>
                    }

                    {
                        this.state.videoUploaded
                            ? <View style={styles.recordBox}>
                                <View style={[styles.recordIconBox,
                                    (this.state.recording || this.state.audioPlaying) && styles.recordOn]}>
                                    {
                                        this.state.counting && !this.state.recording
                                            ? <CountDownText
                                                style={styles.countBtn}
                                                countType='seconds'
                                                auto={true}
                                                afterEnd={() => {
                                                    this._record()
                                                        .catch((error) => {
                                                            console.log(error);
                                                        })
                                                }}
                                                timeLeft={3}
                                                step={-1}
                                                startText='prepare record'
                                                endText='Go'
                                                intervalText={(sec) => {
                                                    return sec === 0 ? 'Go' : sec
                                                }}/>
                                            : <TouchableOpacity onPress={() => {
                                                this._counting()
                                            }}>
                                                <Ionicons
                                                    name={'ios-microphone-outline'}
                                                    style={styles.recordIcon}
                                                    size={58}/>
                                            </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            : null
                    }

                    {
                        this.state.videoUploaded && this.state.recordDone
                            ? <View style={styles.uploadAudioBox}>
                                {
                                    !this.state.audioUploaded && !this.state.audioUploading
                                        ? <Text
                                            onPress={() => {
                                                this._uploadAudio()
                                            }}
                                            style={styles.uploadAudioText}>next</Text>
                                        : null
                                }

                                {
                                    this.state.audioUploading
                                        ? <Progress.Circle
                                            size={60}
                                            showsText={true}
                                            color={'#ee735c'}
                                            progress={this.state.audioUploadedProgress}/>
                                        : null
                                }
                            </View>
                            : null
                    }

                </View>
            </View>
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
        backgroundColor: '#ee735c',
        flexDirection: 'row'
    },
    headerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    toolbarEdit: {
        position: 'absolute',
        right: 14,
        top: 14,
        color: '#fff',
        textAlign: 'right',
        fontWeight: '600',
        fontSize: 14
    },
    page: {
        flex: 1,
        alignItems: 'center'
    },
    uploadContainer: {
        marginTop: 90,
        width: width - 40,
        height: 400,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#fff'
    },
    uploadTitle: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
        color: '#000'
    },
    uploadDesc: {
        color: '#999',
        textAlign: 'center',
        fontSize: 12
    },
    uploadIcon: {
        width: 110,
        resizeMode: 'contain'
    },
    uploadBox: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoContainer: {
        width: width,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    videoBox: {
        width: width,
        height: width * 9 / 16
    },
    video: {
        width: width,
        height: width * 9 / 16,
        backgroundColor: '#333'
    },
    progressTipBox: {
        width: width,
        height: 50,
        backgroundColor: 'rgba(244, 244, 244, 0.65)'
    },
    progressTip: {
        color: '#333',
        width: width - 10,
        padding: 5,
    },
    progressBar: {
        width: width,
        marginTop: -6
    },
    recordBox: {
        width: width,
        height: 60,
        alignItems: 'center'
    },
    recordIconBox: {
        width: 68,
        height: 68,
        marginTop: -30,
        borderRadius: 34,
        backgroundColor: '#ee735c',
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    countBtn: {
        fontSize: 32,
        fontWeight: '600',
        color: '#fff'
    },
    recordIcon: {
        backgroundColor: 'transparent',
        color: '#fff'
    },
    recordOn: {
        backgroundColor: '#ccc'
    },
    previewBox: {
        width: 80,
        height: 30,
        position: 'absolute',
        right: 10,
        bottom: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    previewIcon: {
        marginRight: 5,
        color: '#ee735c'
    },
    previewText: {
        fontSize: 10,
        color: '#ee735c'
    },
    uploadAudioBox: {
        width: width,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadAudioText: {
        width: width - 40,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 5,
        padding: 5,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#ee735c'
    },
});