import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// import Home from './src/screens/Home';
import LoginScreen from '../screens/LoginScreen';
import Quotes from '../screens/Home';
import React from "react";
import {setNavigator} from "../navigationRef";
import Home from "../screens/Home";
import {Provider as CatalogProvider} from "../context/CatalogsContext";
//import BottomTabs from './BottomTabs';

const StackNavigator = createStackNavigator({


    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            header: null,
        },
    },
    HomeScreen: {
        screen: Home,
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
        screen: Home,
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
