import { AppRegistry } from 'react-native';
import App from './app/base/App';

import { YellowBox } from 'react-native';

AppRegistry.registerComponent('DubbingApp', () => App);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
