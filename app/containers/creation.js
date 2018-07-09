import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as creationActions from '../actions/creation';
import HomeVideo from '../pages/home/HomeVideo';

class CreationContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCreations();
    }

    _onLoadItem(row) {
        this.props.navigation.navigate('Detail', {
            rowData: row
        })
    }

    render() {
        return (
            <HomeVideo
                onLoadItem={this._onLoadItem.bind(this)}
                {...this.props}/>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        user
    } = state.get('app');

    const {
        isRefreshing,
        isLoadingTail,
        videoList,
        videoTotal,
        page
    } = state.get('creations');

    return {
        isRefreshing,
        isLoadingTail,
        videoList,
        videoTotal,
        page,
        user
    }

};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(creationActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationContainer)
