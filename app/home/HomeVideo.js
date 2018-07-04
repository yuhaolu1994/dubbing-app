import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    FlatList,
    Dimensions,
    RefreshControl,
    ActivityIndicator, AsyncStorage
} from "react-native";
import VideoItem from "./VideoItem";
import HttpUtils from "../utils/HttpUtils";
import {config} from "../utils/Config";
import {thumb} from "../utils/ThumbUtils";

let width = Dimensions.get('window').width;

const cachedResults = {
    nextPage: 1,
    items: [],
    total: 0
};

export default class HomeVideo extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoadingTail: false,
            dataSource: null,
            isRefreshing: false,
            user: null
        };
    }

    componentDidMount() {
        let that = this;

        AsyncStorage.getItem('user')
            .then((data) => {
                let user;

                if (data) {
                    user = JSON.parse(data);
                }

                if (user && user.accessToken) {
                    that.setState({
                        user: user
                    }, () => {
                        that._fetchData(1);
                    });
                }
            });

    }

    _fetchData(page) {
        let that = this;

        if (page !== 0) {
            this.setState({
                isLoadingTail: true
            });
        } else {
            this.setState({
                isRefreshing: true
            });
        }

        let user = this.state.user;

        HttpUtils.get(config.api.base + config.api.creations, {
            accessToken: user.accessToken,
            page: page
        })
            .then((data) => {
                if (data && data.success) {
                    if (data.data.length > 0) {

                        data.data.map((item) => {
                            let votes = item.votes || [];

                            if (votes.indexOf(user._id) > -1) {
                                item.liked = true;
                            } else {
                                item.liked = false;
                            }

                            return item;
                        });

                        let items = cachedResults.items.slice();

                        if (page !== 0) {
                            cachedResults.items = items.concat(data.data);
                            cachedResults.nextPage += 1;
                        } else {
                            cachedResults.items = data.data.concat(items);
                        }

                        cachedResults.total = data.total;

                        if (page !== 0) {
                            that.setState({
                                isLoadingTail: false,
                                dataSource: cachedResults.items
                            });
                        } else {
                            that.setState({
                                isRefreshing: false,
                                dataSource: cachedResults.items
                            });
                        }

                    }
                }
            })
            .catch(error => {
                if (page !== 0) {
                    this.setState({
                        isLoadingTail: false,
                    });
                } else {
                    this.setState({
                        isRefreshing: false,
                    });
                }
                console.warn(error)
            });
    }

    _hasMoreData() {
        return cachedResults.items.length !== cachedResults.total;
    }

    _fetchMoreData() {
        // no more data will stop loading more data
        if (!this._hasMoreData() || this.state.isLoadingTail) {
            return;
        }

        let page = cachedResults.nextPage;

        this._fetchData(page);
    }

    _onRefresh() {
        // no more data will stop refresh data
        if (!this._hasMoreData() || this.state.isRefreshing) {
            return;
        }

        this._fetchData(0);
    }

    _renderFooter() {
        // no more data will hide the footer
        if (!this._hasMoreData() && cachedResults.total !== 0) {
            return (
                <View style={styles.indicatorContainer}>
                    <Text style={styles.loadMoreText}>No More Video...</Text>
                </View>
            );
        }

        // prevent render again
        if (!this.state.isLoadingTail) {
            return <View/>;
        }

        return (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.commentsIndicator}
                    size={'small'}
                    animating={true}
                    color={'#ee735c'}
                />
                <Text style={styles.loadMoreText}>Loading...</Text>
            </View>
        );
    }

    _renderItem(item) {
        return (
            <VideoItem
                _id={item._id}
                title={item.title}
                qiniu_thumb={thumb(item.qiniu_thumb)}
                video={item.qiniu_video}
                author_avatar={item.author.avatar}
                nickname={item.author.nickname}
                navigate={this.props.navigation.navigate}
                user={this.state.user}
                liked={item.liked}
                accessToken={this.state.user.accessToken}/>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#ee735c"
                />
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dubbing Collection</Text>
                </View>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item}) => this._renderItem(item)}
                    // not use key
                    keyExtractor={(item, index) => index.toString()}

                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            colors={['#ff6600']}
                            tintColor={'#ff6600'}
                            titleColor={'#ff6600'}
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => {
                                this._onRefresh();
                            }}
                        />
                    }
                    ListFooterComponent={() => this._renderFooter()}
                    onEndReached={() => {
                        this._fetchMoreData();
                    }}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={20}
                />
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
        backgroundColor: '#ee735c'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    item: {
        width: width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumb: {
        width: width,
        height: width * 0.56
    },
    title: {
        padding: 10,
        fontSize: 18,
        color: '#333',
        textAlign: 'center'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },
    handleBox: {
        padding: 10,
        flexDirection: 'row',
        width: width / 2 - 0.5,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    play: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 18,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#ed7b66'
    },
    handleText: {
        paddingLeft: 12,
        fontSize: 18,
        color: '#333'
    },
    down: {
        fontSize: 22,
        color: '#333'
    },
    up: {
        fontSize: 22,
        color: '#ed7b66'
    },
    commentIcon: {
        fontSize: 22,
        color: '#333'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    commentsIndicator: {
        margin: 10
    },
    loadMoreText: {
        margin: 10,
        color: '#ed7b66',
    }
});


