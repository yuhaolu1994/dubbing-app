import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image
} from "react-native";
import ActionButton from "react-native-button";
import {avatar} from "../../common/ThumbUtils";

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const user = this.props.user;

        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#ee735c"/>

                <View style={styles.fieldItem}>
                    <Text style={styles.label}>Avatar</Text>
                    <View style={styles.avatarBox}>
                        <Image
                            source={{uri: avatar(user.avatar)}}
                            style={styles.avatar}/>
                    </View>
                </View>

                <View style={styles.fieldItem}>
                    <Text style={styles.label}>Nickname</Text>
                    <Text style={styles.content}>{user.nickname}</Text>
                </View>

                <View style={styles.fieldItem}>
                    <Text style={styles.label}>Age</Text>
                    <Text style={styles.content}>{user.age}</Text>
                </View>

                <View style={styles.fieldItem}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.content}>{user.breed}</Text>
                </View>

                <View style={styles.fieldItem}>
                    <Text style={styles.label}>Gender</Text>
                    {user.gender === 'male' && <Text style={styles.content}>Male</Text>}
                    {user.gender === 'female' && <Text style={styles.content}>Female</Text>}
                </View>

                <ActionButton
                    style={styles.btn}
                    onPress={() => this.props.logout()}>Logout</ActionButton>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#fff'
    },
    avatarBox: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    avatar: {
        marginBottom: 15,
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderColor: '#f9f9f9',
        borderWidth: 1,
        borderRadius: 20
    },

    fieldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#eee',
        borderBottomWidth: 1
    },

    label: {
        textAlign: 'left',
        color: '#999',
        marginRight: 10
    },

    content: {
        textAlign: 'right',
        color: '#555'
    },

    btn: {
        marginTop: 25,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'transparent',
        borderColor: '#ee735c',
        borderWidth: 1,
        color: '#ee735c',
        borderRadius: 0
    },

    normalBtn: {
        borderColor: '#ccc',
        color: '#ccc'
    }
});