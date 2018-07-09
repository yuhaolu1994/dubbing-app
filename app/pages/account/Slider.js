import React from "react";
import {Dimensions, Image, View, StyleSheet} from "react-native";
import ActionButton from "react-native-button";
import Swiper from 'react-native-swiper';

let width = Dimensions.get('window').width;

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loop: false,
            banners: [
                require('../../static/images/s1.jpg'),
                require('../../static/images/s2.jpg'),
                require('../../static/images/s3.jpg')
            ]
        }
    }

    _enter() {
        this.props.enterSlider();
    }

    render() {
        return (
            <Swiper
                dot={<View style={styles.dot}/>}
                activeDot={<View style={styles.activeDot}/>}
                paginationStyle={styles.pagination}
                loop={this.state.loop}>

                <View style={styles.slide}>
                    <Image style={styles.image}
                           source={this.state.banners[0]}/>
                </View>

                <View style={styles.slide}>
                    <Image style={styles.image}
                           source={this.state.banners[1]}/>
                </View>

                <View style={styles.slide}>
                    <Image style={styles.image}
                           source={this.state.banners[2]}/>

                    <ActionButton
                        style={styles.btn}
                        onPress={() => this._enter()}>Enjoy right now</ActionButton>

                </View>

            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        width: width
    },
    image: {
        flex: 1,
        width: width,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        marginLeft: 12,
        marginRight: 12,
        backgroundColor: 'transparent',
        borderColor: '#ff6600',
    },
    activeDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        marginLeft: 12,
        marginRight: 12,
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',

    },
    pagination: {
        bottom: 30
    },
    btn: {
        width: width - 20,
        height: 50,
        padding: 10,
        marginBottom: 150,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
        borderColor: '#ee735c',
        borderWidth: 1,
        borderRadius: 3,
        fontSize: 18,
        color: '#ee735c'
    },
});