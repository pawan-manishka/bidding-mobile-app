import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../screens/Login';
// import Home from './src/screens/Home';
import SwiperComponent from '../screens/SwiperComponent';
import Quotes from '../screens/Quotes';
//import BottomTabs from './BottomTabs';
import {Provider as CatalogProvider} from "../context/CatalogContext";
import React from "react";
import Quotes2 from "../screens/Quotes2";
import SignalRTest from "../screens/SignalRTest";
import {setNavigator} from "../navigationRef";

const StackNavigator = createStackNavigator({

    SwiperComponent: {
        screen: SwiperComponent,
        navigationOptions: {
            headerShown: false,
        },
    },

    // HomeScreen: {
    //     screen: Login,
    //     navigationOptions: {
    //         headerShown: false,
    //     },
    // },
    // QuotesScreen: {
    //     screen: Quotes,
    //     navigationOptions: {
    //         headerShown: false,
    //     },
    // },
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
        screen: SignalRTest,
    },
    // TourDetail: {
    //     screen: TourStack,
    // },
});

const App = createAppContainer(Main);
export default () => {
    return (
        <CatalogProvider>
            <App ref={(navigator) => {
                setNavigator(navigator)
            }}/>
        </CatalogProvider>
    )
};
