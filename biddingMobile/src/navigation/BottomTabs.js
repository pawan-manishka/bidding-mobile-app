import React from 'react';
import {createAppContainer } from "react-navigation";
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Quotes from '../screens/Quotes';
// import Notification from "../screens/Notification";
// import MyTours from "../screens/MyTours";
// import Home from "../screens/Home";
// import TourHistory from "../screens/TourHistory";
// import BillUpload from "../screens/BillUpload";
// import ExtraBillUpload from "../screens/ExtraBillUpload";
// import TourDetail from "../screens/TourDetail";
// import SettlementUpload from "../screens/SettlementUpload";
// import Support from "../screens/Support";
// import HomeTabIcon from "../components/HomeTabIcon";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HomeTab = createStackNavigator({
    Home: {
        screen: Quotes
    }
});
const QuotesTab = createStackNavigator({
    Quotes: {
        screen: Quotes
    }
});
const ChartTab = createStackNavigator({
    Chart: {
        screen: Quotes
    }
});
const TradeTab = createStackNavigator({
    Trade: {
        screen: Quotes
    }
});
const HistoryTab = createStackNavigator({
    History: {
        screen: Quotes
    }
});

// const NotificationTab = createStackNavigator({
//     Notification: {
//         screen: Notification
//     }
// });
// const MyToursTab = createStackNavigator({
//     // Quotes: {
//     //     screen: Quotes
//     // },
//     // TourDetail: {
//     //     screen: TourDetail
//     // },
//     // BillUpload: {
//     //     screen: BillUpload
//     // },
//     // ExtraBillUpload: {
//     //     screen: ExtraBillUpload
//     // },
//     // SettlementUpload: {
//     //     screen: SettlementUpload
//     // }
// });
// const HomeTab = createStackNavigator({
//     Home: {
//         screen: Home
//     }
// });
// const TourHistoryTab = createStackNavigator({
//     TourHistory: {
//         screen: TourHistory
//     }
// });
// const SupportTab = createStackNavigator({
//     Support: {
//         screen: Support
//     }
// });

const Tabs = createBottomTabNavigator({
    Home: {
        screen: HomeTab,
        navigationOptions: ({navigation}) => ({
            title: ''
        })
    },
    Quotes: QuotesTab,
    Chart: ChartTab,
    Trade: TradeTab,
    History: HistoryTab
}, {
    initialRouteName: 'Quotes',
    defaultNavigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, tintColor}) => {

            const {routeName} = navigation.state;
            if (routeName === 'Home') {
                //return <MaterialIcons name="notifications-active" size={20} color={tintColor}/>
            } else if (routeName === 'Quotes') {
                // return <MaterialIcons name="location-on" size={20} color={tintColor}/>
            } else if (routeName === 'Chart') {
                //returned Custom HomeTab Icon
                // return <HomeTabIcon/>
            } else if (routeName === 'Trade') {
                // return <FontAwesome name="history" size={20} color={tintColor}/>
            } else if (routeName === 'History') {
                // return <FontAwesome name="commenting" size={20} color={tintColor}/>
            }
        }
    }),
    tabBarOptions: {
        activeTintColor: 'white',
    },
});

export default createAppContainer(Tabs);
