import React from 'react';
import {
    StyleSheet, ActivityIndicator
} from 'react-native';

const styles = StyleSheet.create({
    loading: {
        marginVertical: 20,
    }
});

const Loading = () => {
    return (
        <ActivityIndicator
            style={styles.loading}
            size={'small'}
            animating={true}
            color={'#ee735c'}
        />
    );
};

export default Loading;



