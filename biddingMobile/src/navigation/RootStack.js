import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import SwiperComponent from '../screens/SwiperComponent';
import {Provider as CatalogProvider} from "../context/CatalogContext";
import React from "react";
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
