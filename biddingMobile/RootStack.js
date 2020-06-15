import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './src/screens/Login';
// import Home from './src/screens/Home';
import SwiperComponent from './src/screens/SwiperComponent';
import Quotes from './src/screens/Quotes';

const StackNavigator = createStackNavigator({

    SwiperComponent: {
        screen: SwiperComponent,
        navigationOptions: {
            headerShown: false,
        },
    },

    HomeScreen: {
        screen: Login,
        navigationOptions: {
            headerShown: false,
        },
    },
    // Home1Screen: {
    //     screen: Home,
    //     navigationOptions: {
    //         headerShown: false,
    //     },
    // },
});
export default createAppContainer(StackNavigator);
