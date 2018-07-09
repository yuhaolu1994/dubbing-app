import {createBottomTabNavigator, createStackNavigator,} from 'react-navigation';
import CreateVideo from "./edit";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from "react";
import VideoDetails from "./detail";
import HomeVideo from "./creation";
import Comment from './comment';
import Profile from "./account";
import UpdateProfile from './accountUpdate';
import {StyleSheet, Text} from "react-native";

const HomeStack = createStackNavigator({
        Home: {
            screen: HomeVideo,
            navigationOptions: () => ({
                title: 'Dubbing Collection',
                headerStyle: styles.header,
                headerTitleStyle: styles.homeHeaderTitle,
                headerTintColor: '#fff',
            })
        },
        Detail: {
            screen: VideoDetails,
            navigationOptions: ({navigation}) => ({
                title: `${navigation.state.params.rowData.author.nickname}'s creation`,
                headerStyle: styles.header,
                headerTitleStyle: styles.detailHeaderTitle,
                headerTintColor: '#fff',
            })
        },
        Comment: {
            screen: Comment,
            navigationOptions: () => ({
                title: 'Add comment',
                headerStyle: styles.header,
                headerTitleStyle: styles.detailHeaderTitle,
                headerTintColor: '#fff',
            })
        }
    });

HomeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible
    };
};

const AccountStack = createStackNavigator({
    Account: {
        screen: Profile,
        navigationOptions: ({navigation}) => ({
            title: 'Your Account',
            headerStyle: styles.header,
            headerTitleStyle: styles.accountHeaderTitle,
            headerTintColor: '#fff',
            headerRight: (
                <Text
                    style={{color: '#fff', paddingRight: 10}}
                    onPress={() => navigation.navigate('AccountUpdate')}>EDIT</Text>
            ),
        })
    },
    AccountUpdate: {
        screen: UpdateProfile,
        navigationOptions: () => ({
            title: 'Update profile',
            headerStyle: styles.header,
            headerTitleStyle: styles.detailHeaderTitle,
            headerTintColor: '#fff',
        })
    }
});

AccountStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }

    return {
        tabBarVisible
    };
};

export const AppTabNavigator = createBottomTabNavigator(
    {
        HomePage: HomeStack,
        CreatePage:  CreateVideo,
        ProfilePage: AccountStack,
    },

    {
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, tintColor}) => {
                const {routeName} = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'HomePage':
                        iconName = `ios-videocam${focused ? '' : '-outline'}`;
                        break;
                    case 'CreatePage':
                        iconName = `ios-add-circle${focused ? '' : '-outline'}`;
                        break;
                    case 'ProfilePage':
                        iconName = `ios-more${focused ? '' : '-outline'}`;
                        break;
                }
                return <Ionicons name={iconName} size={30} color={tintColor}/>;
            },
        }),
        initialRouteName: 'CreatePage',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            showLabel: false
        },
    }
);

const styles = StyleSheet.create({
    header: {
        height: 50,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#ee735c',
    },
    homeHeaderTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        width: '95%'
    },
    accountHeaderTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        width: '105%'
    },
    detailHeaderTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        width: '75%'
    }
});



