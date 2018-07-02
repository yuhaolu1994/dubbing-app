import queryString from 'query-string';
import _ from 'lodash';
import React from 'react';
import {config} from "./Config";

export default class HttpUtils extends React.Component {
    static get(url, params) {
        if (params) {
            url += '?' + queryString.stringify(params);
        }

        return fetch(url)
            .then((response) => response.json())
    }

    static post(url, body) {
        let options = _.extend(config.header, {
            body: JSON.stringify(body)
        });
        return fetch(url, options)
            .then((response) => response.json())
    }
}