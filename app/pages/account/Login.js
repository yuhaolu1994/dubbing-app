import React from 'react';
import {StyleSheet, Text, TextInput, View, Dimensions} from "react-native";
import Button from "react-native-button";
import HttpUtils from "../../common/HttpUtils";
import {config} from "../../common/Config";
import CountDownText from "../../common/CountDownText";
import Popup from "../../components/popup";

const {width} = Dimensions.get('window');

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            codeSent: false,
            phoneNumber: '',
            verifyCode: '',
            countingDone: false,
            hasText: false
        }
    }

    _showVerifyCode() {
        this.setState({
            codeSent: true
        });
    }

    _countingDone() {
        this.setState({
            countingDone: true
        });
    }

    _sendVerifyCode() {
        let that = this;
        let phoneNumber = this.state.phoneNumber;

        if (!phoneNumber) {
            return that.props.popAlert('Oh no', 'Phone number should not be none');
        }

        let body = {
            phoneNumber: phoneNumber
        };

        let registerURL = config.api.register;

        HttpUtils.post(registerURL, body)
            .then((data) => {
                if (data && data.success) {
                    that._showVerifyCode();
                } else {
                    that.props.popAlert('Oh no', 'Failed to get verify code, please check the phone number');
                }
            })
            .catch((error) => {
                console.log(error);
                that.props.popAlert('Oh no', 'Failed to get verify code, check the Internet connection');
            });
    }

    _submit() {
        let that = this;
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;

        if (!phoneNumber || !verifyCode) {
            return that.props.popAlert('Oh no', 'Phone number or verify code should not be none');
        }

        let body = {
            phoneNumber: phoneNumber,
            verifyCode: verifyCode
        };

        let verifyURL = config.api.verify;

        HttpUtils.post(verifyURL, body)
            .then((data) => {
                if (data && data.success) {
                    that.props.afterLogin(data.data);
                } else {
                    that.props.popAlert('Oh no', 'Failed to get verify code, please check the phone number');
                }
            })
            .catch((error) => {
                console.log(error);
                that.props.popAlert('Oh no', 'Failed to verify, check the Internet connection');
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.loginBox}>
                    <Text style={styles.title}>Login in here</Text>
                </View>
                <TextInput
                    placeholder={'Input your phone number'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={'phone-pad'}
                    style={[styles.inputField, styles.verifyField]}
                    onChangeText={(text) => {
                        this.setState({
                            phoneNumber: text
                        });
                    }}
                    underlineColorAndroid={'transparent'}
                />

                {
                    this.state.codeSent
                        ? <View style={styles.verifyCodeBox}>

                            <TextInput
                                placeholder={'Input your verify code'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                keyboardType={'phone-pad'}
                                style={styles.inputVerifyCode}
                                onChangeText={(text) => {
                                    this.setState({
                                        verifyCode: text
                                    });
                                }}
                                underlineColorAndroid={'transparent'}
                            />

                            {
                                this.state.countingDone
                                    ? <Button
                                        style={styles.countBtn}
                                        onPress={() => this._sendVerifyCode()}>Get verify code</Button>
                                    : <CountDownText
                                        style={styles.countBtn}
                                        countType='seconds'
                                        auto={true}
                                        afterEnd={() => {this._countingDone()}}
                                        timeLeft={60}
                                        step={-1}
                                        startText='get verify code'
                                        endText='get verify code'
                                        intervalText={(sec) => 'Left:' + sec}
                                    />
                            }
                        </View>
                        : null

                }

                {
                    this.state.codeSent
                        ? <Button
                            style={styles.btn}
                            onPress={() => this._submit()}>Login</Button>
                        : <Button
                            style={styles.btn}
                            onPress={() => this._sendVerifyCode()}>Get verify code</Button>
                }

                <Popup {...this.props}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9'
    },
    loginBox: {
        marginTop: 20,
    },
    title: {
        marginBottom: 20,
        color: '#333',
        fontSize: 20,
        textAlign: 'center'
    },
    inputField: {
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    verifyField: {
        width: width - 140
    },
    inputVerifyCode: {
        flex: 1,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    btn: {
        padding: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
        borderColor: '#ee735c',
        borderWidth: 1,
        borderRadius: 4,
        color: '#ee735c'
    },
    verifyCodeBox: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    countBtn: {
        width: 110,
        height: 40,
        padding: 10,
        marginLeft: 8,
        color: '#fff',
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
        borderRadius: 2
    },
});