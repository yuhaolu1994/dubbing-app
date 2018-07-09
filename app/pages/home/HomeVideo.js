import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    FlatList,
    RefreshControl,
} from "react-native";
import VideoItem from "./VideoItem";
import Popup from "../../components/popup";
import NoMore from '../../components/nomore';
import Loading from '../../components/loading';

import {bindActionCreators} from "redux";
import {connect} from 'react-redux'
import * as appActions from '../../actions/app'


class HomeVideo extends React.Component {

    constructor(props) {
        super(props);
    }

    _hasMoreData() {
        const {
            videoList,
            videoTotal
        } = this.props;

        return videoList.length < videoTotal;
    }

    _fetchMoreData() {
        const {
            isLoadingTail,
            fetchCreations
        } = this.props;

        if (this._hasMoreData() || isLoadingTail) {
            fetchCreations();
        }
    }

    _onRefresh() {
        this.props.fetchCreations('recent');
    }

    _renderFooter() {
        const {
            videoTotal,
            isLoadingTail
        } = this.props;

        if (!this._hasMoreData() && videoTotal !== 0) {
            return <NoMore/>
        }

        if (isLoadingTail) {
            return <Loading/>;
        }

        return null;
    }

    _popup(title, content) {
        this.props.popAlert(title, content);
    }

    _renderItem(item) {
        return (
            <VideoItem
                _id={item._id}
                row={item}
                user={this.props.user}
                popAlert={this._popup.bind(this)}
                onSelect={() => this.props.onLoadItem(item)}/>
        );
    }

    render() {
        const {
            videoList,
            isRefreshing,
        } = this.props;

        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#ee735c"
                />
                <FlatList
                    data={videoList}
                    renderItem={({item}) => this._renderItem(item)}
                    // not use key
                    keyExtractor={(item, index) => index.toString()}

                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            colors={['#ff6600']}
                            tintColor={'#ff6600'}
                            titleColor={'#ff6600'}
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._fetchMoreData.bind(this)}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={20}
                />
                <Popup {...this.props}/>
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        popup: state.get('app').popup
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeVideo)

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});


