import React from "react";
import {ActivityIndicator, View, StyleSheet, Dimensions} from "react-native";

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    bootPage: {
        width: width,
        height: height,
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
});

const Boot = () => {
    return (<View style={styles.bootPage}>
        <ActivityIndicator color={'#ee735c'} size="large"/>
    </View>);
};

export default Boot;