import React from "react";
import {View, Text, Icon} from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

import SwiperComponent from "../screens/SwiperComponent";
import SignalRTest from "../screens/SignalRTest";
import AuctionHome from "../screens/AuctionHome";
import Quotes2 from "../screens/Quotes2";
import {Provider as CatalogProvider} from "../context/CatalogContext";

const Stack = createStackNavigator();

function ChartScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a2435'}}>
            <Text style={{color: 'white'}}>Chart Screen!</Text>
        </View>
        // <HomeStack.Navigator>
        //     {/*<UserStack.Screen name="Home" options={{headerShown: false}} component={CreateWorkout}/>*/}
        //     {/*<UserStack.Screen name="Workouts" options={{headerShown: false}} component={ViewWorkouts}/>*/}
        // </HomeStack.Navigator>
    );
}

function TradeScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a2435'}}>
            <Text style={{color: 'white'}}>Trade Screen!</Text>
        </View>
    );
}

function HistoryScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a2435'}}>
            <Text style={{color: 'white'}}>History Screen!</Text>
        </View>
    );
}


const _HomeWithTabs = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator initialRouteName="Home" tabBarOptions={{
            activeTintColor: 'white',style: {
                backgroundColor: '#0b1224',//color you want to change
            }
        }}>
            <Tab.Screen name="AuctionHome" component={AuctionHome} options={{
                tabBarLabel: 'Auction Home',
                tabBarIcon: ({ focused, color, size }) => {
                    // You can return any component that you like here!
                    return <Entypo name="home" color={color} size={22}/>;
                },
                tabBarOptions: {
                    activeTintColor: 'white',
                    inactiveTintColor: '#374760',
                },
            }}/>
            <Tab.Screen name="Quotes" component={Quotes2} options={{
                tabBarLabel: 'Quotes',
                tabBarIcon: ({color, size}) => (
                    <Fontisto name="arrow-swap" color={color} size={20} style={{transform: [{ rotate: '90deg'}]}}/>
                ),
                tabBarOptions: {
                    activeTintColor: 'white',
                    inactiveTintColor: '#374760',
                },
            }}/>
            <Tab.Screen name="Chart" component={ChartScreen}
                        options={{
                            tabBarLabel: 'Chart',
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="ios-stats" color={color} size={25}/>
                            ),
                            tabBarOptions: {
                                activeTintColor: 'white',
                                inactiveTintColor: '#374760',
                            },
                        }}/>
            <Tab.Screen name="Trade" component={TradeScreen} options={{
                tabBarLabel: 'Trade',
                tabBarIcon: ({color, size}) => (
                    <Feather name="trending-up" color={color} size={24}/>
                ),
                tabBarOptions: {
                    activeTintColor: 'white',
                    inactiveTintColor: '#374760',
                },
            }}/>
            <Tab.Screen name="History" component={HistoryScreen} options={{
                tabBarLabel: 'History',
                tabBarIcon: ({color, size}) => (
                    <Entypo name="text-document" color={color} size={23}/>
                ),
            }}/>
        </Tab.Navigator>
    )
}



export default function Navigation() {
    return (
        <CatalogProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Initial">
                        <Stack.Screen name="Initial"
                                      options={{headerShown: false}}
                                      component={SwiperComponent}
                        />

                        <Stack.Screen
                            name="Home"
                            options={{
                                title: "Home",
                                headerTitleAlign: "center",
                                headerShown: false,
                                headerLeftContainerStyle: {padding: 10}

                            }}
                            component={_HomeWithTabs}


                        />


                    </Stack.Navigator>
                </NavigationContainer>
        </CatalogProvider>
    )
}
