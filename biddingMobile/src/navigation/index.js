import React,{useState} from 'react';
import {View, Text,} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import SwiperComponent from '../screens/SwiperComponent';
import SignalRTest from '../screens/SignalRTest';
import AuctionHome from '../screens/AuctionHome';
import AuctionView from '../screens/AuctionView';
import QuotesBroker from '../screens/QuotesBroker';
import QuotesBuyer from '../screens/QuotesBuyer';
import {Provider as CatalogProvider} from '../context/CatalogContext';
import {Provider as AuctionProvider} from '../context/AuctionContext';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView,StatusBar,Alert} from "react-native";

const Stack = createStackNavigator();
const AuctionHomeScreen = createStackNavigator();

const readData = async () => {
    try {
        const Role = await AsyncStorage.getItem("role")

        if (Role !== null) {
            return Role
        }
    } catch (e) {
        alert('Failed to get role from async storage')
    }
}

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

function AuctionHomeStackScreen() {
    return (
        <AuctionHomeScreen.Navigator>
            <AuctionHomeScreen.Screen name="AuctionHome" options={{headerShown: false}} component={AuctionHome}/>
            <AuctionHomeScreen.Screen name="AuctionView" options={{headerShown: false}} component={AuctionView}/>
        </AuctionHomeScreen.Navigator>
    );
}
//readData().then((result) => setrole(result))

function _HomeWithTabs(){

    const [role, setrole] = useState('');
    readData().then((result) => setrole(result))

    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator initialRouteName="Home" tabBarOptions={{
            activeTintColor: 'white', style: {
                backgroundColor: '#121a2a',//color you want to change
            },
        }}>
            <Tab.Screen name="Home" component={AuctionHomeStackScreen} options={{
                tabBarLabel: 'Auction Home',
                tabBarIcon: ({focused, color, size}) => {
                    // You can return any component that you like here!
                    return <Entypo name="home" color={color} size={22}/>;
                },
                tabBarOptions: {
                    activeTintColor: 'white',
                    inactiveTintColor: '#374760',
                },
            }}/>

            {role==="Broker"?<Tab.Screen name="Quotes" component={QuotesBroker} options={{
                tabBarLabel: 'Quotes',
                tabBarIcon: ({color, size}) => (
                    <Fontisto name="arrow-swap" color={color} size={20} style={{transform: [{rotate: '90deg'}]}}/>
                ),
                tabBarOptions: {
                    activeTintColor: 'white',
                    inactiveTintColor: '#374760',
                },
            }}/>: <Tab.Screen name="Quotes" component={QuotesBuyer} options={{
                tabBarLabel: 'Quotes',
                tabBarIcon: ({color, size}) => (
                    <Fontisto name="arrow-swap" color={color} size={20} style={{transform: [{rotate: '90deg'}]}}/>
                ),
                tabBarOptions: {
                    activeTintColor: 'white',
                    inactiveTintColor: '#374760',
                },
            }}/>}

           {/*<Tab.Screen name="Quotes" component={QuotesBuyer} options={{*/}
                {/*tabBarLabel: 'Quotes',*/}
                {/*tabBarIcon: ({color, size}) => (*/}
                    {/*<Fontisto name="arrow-swap" color={color} size={20} style={{transform: [{rotate: '90deg'}]}}/>*/}
                {/*),*/}
                {/*tabBarOptions: {*/}
                    {/*activeTintColor: 'white',*/}
                    {/*inactiveTintColor: '#374760',*/}
                {/*},*/}
            {/*}}/>*/}


            <Tab.Screen name="Chart" component={SignalRTest}
                        options={{
                            tabBarLabel: 'Signal R',
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
    );
};


export default function Navigation() {
    return (

        <AuctionProvider>
            <CatalogProvider>
                <NavigationContainer>
                    {/*<SafeAreaView>*/}
                        {/*<StatusBar backgroundColor="#1a2435" barStyle="light-content"/>*/}
                    <Stack.Navigator initialRouteName="Initial">
                        <Stack.Screen name="Initial"
                                      options={{headerShown: false}}
                                      component={SwiperComponent}
                        />

                        <Stack.Screen
                            name="Home"
                            options={{
                                title: 'Home',
                                headerTitleAlign: 'center',
                                headerShown: false,
                                headerLeftContainerStyle: {padding: 10},

                            }}
                            component={_HomeWithTabs}


                        />


                    </Stack.Navigator>
                    {/*</SafeAreaView>*/}
                </NavigationContainer>
            </CatalogProvider>
        </AuctionProvider>

    );
}
