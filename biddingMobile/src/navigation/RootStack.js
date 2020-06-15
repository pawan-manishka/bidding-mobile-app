import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../screens/Login';
// import Home from './src/screens/Home';
import SwiperComponent from '../screens/SwiperComponent';
import Quotes from '../screens/Quotes';
//import BottomTabs from './BottomTabs';

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
    QuotesScreen: {
        screen: Quotes,
        navigationOptions: {
            headerShown: false,
        },
    },
});

// const Stack = createStackNavigator(
//     {
//         Tabs: BottomTabs,
//     }
// );

//Switch Navigator
const Main = createSwitchNavigator({
    Auth: {
        screen: StackNavigator,
    },
    App: {
        screen: Quotes,
    },
    // TourDetail: {
    //     screen: TourStack,
    // },
});

export default createAppContainer(Main);
