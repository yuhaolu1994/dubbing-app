import {createBottomTabNavigator, createStackNavigator,} from 'react-navigation';
import CreateVideo from "../creation/CreateVideo";
import Profile from "../account/Profile";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from "react";
import VideoDetails from "./VideoDetails";
import HomeVideo from "./HomeVideo";
import {StyleSheet} from "react-native";

const HomeStack = createStackNavigator({
        Home: HomeVideo,
        Details: VideoDetails,
    },
    {
        navigationOptions: () => ({
            title: 'Video Detail',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTintColor: '#fff'
        }),
    }
);


export const AppTabNavigator = createBottomTabNavigator(
    // RouteConfigs
    {
        // routeName: routeComponent
        HomePage: HomeStack,
        CreatePage: CreateVideo,
        ProfilePage: Profile,
    },
    // BottomTabNavigatorConfig
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
                return <Ionicons name={iconName} size={25} color={tintColor}/>;
            },
        }),
        initialRouteName: 'ProfilePage',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    }
);

const styles = StyleSheet.create({
    header: {
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#ee735c',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        alignSelf: 'center',
    },
});



