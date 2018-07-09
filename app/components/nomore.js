import React from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    loadingMore: {
        marginVertical: 20,
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    }
});

const NoMore = () => {
    return (
        <View style={styles.loadingMore}>
            <Text style={styles.loadingText}>No More...</Text>
        </View>
    );
};

export default NoMore;



