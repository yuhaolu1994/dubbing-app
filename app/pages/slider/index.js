import React from "react";
import {Dimensions, Image, View, StyleSheet,} from "react-native";
import ActionButton from "react-native-button";
import Swiper from 'react-native-swiper';

const {width} = Dimensions.get('window');

export default class Slider extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            banners,
            sliderLoop,
            enteredSlide
        } = this.props;

        const bannersSlider = banners.map((item, i) => {
            let innerButton = null;

            if (i + 1 === banners.length) {
                // innerButton = (
                //     <TouchableOpacity style={styles.btn} onPress={enterSlide}>
                //     <Text style={styles.btnText}>Enjoy right now!</Text>
                // </TouchableOpacity>)
                innerButton = (<ActionButton
                    style={styles.btn}
                    onPress={enteredSlide}>Enjoy right now</ActionButton>)
            }

            return (<View style={styles.slide} key={i}>
                <Image style={styles.image} source={banners[i]}/>
                {innerButton}
            </View>);

        });

        return (
            <Swiper
                dot={<View style={styles.dot}/>}
                activeDot={<View style={styles.activeDot}/>}
                paginationStyle={styles.pagination}
                loop={sliderLoop}>
                {bannersSlider}
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