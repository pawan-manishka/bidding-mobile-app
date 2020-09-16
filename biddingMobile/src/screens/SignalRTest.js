import React, {useContext, useState, useRef, useReducer} from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert,
    StatusBar, ImageBackground, ActivityIndicator, TouchableOpacity, FlatList, Animated
} from 'react-native';
import {Context as CatalogContext} from "../context/CatalogContext";
import signalr from 'react-native-signalr';
import AsyncStorage from "@react-native-community/async-storage";
const signalR = require("@microsoft/signalr");

const readData = async (navigation) => {
    try {
        const accessToken = await AsyncStorage.getItem("token")

        if (accessToken !== null) {
            return accessToken
        }
    } catch (e) {
        alert('Failed to fetch the data from storage')
    }
}

const SignalRTest = () => {

    const {state: {CatalogList}, getPublishedCatalogs} = useContext(CatalogContext);
    const [animatePress, setAnimatePress] = useState(new Animated.Value(1))
    const [token, setToken] = useState('');

    const animateIn = () => {
        Animated.timing(animatePress, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true // Add This line
        }).start();
    }

    React.useEffect(() => {
        readData().then((result) => {
            console.log('Access Token check : ', result);

            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://dev1.okloapps.com/SmartAuction/hubs/auction",
                    { accessTokenFactory: () => result })
                .build();

            // connection.on("JoinAuction", data => {
            //     console.log("data",data);
            // });
            connection.start()
                .then(() => connection.invoke("JoinAuction",{ AuctionId: 6439 }).catch(err => console.error(err)));

            connection.on('AuctionStatusChanged', data => {
                console.log("data",data);
            });

            connection.on('BiddingStarted',  bidding => {
                console.log("bidding",bidding);
            });
            // connection.on("CurrentBidChanged", self.onCurrentBidChanged);
            // connection.on("OnlineCountChanged", self.onlineCountChanged);

            console.log('connection passed  >> ');

            }
        )


        // const connection = new signalR.HubConnectionBuilder()
        //     .withUrl("https://dev1.okloapps.com/SmartAuction/hubs/auction",
        //         { accessTokenFactory: () => token })
        //     .build();
        //
        // // connection.on("JoinAuction", data => {
        // //     console.log("data",data);
        // // });
        // connection.start()
        //     .then(() => connection.invoke("JoinAuction",{ AuctionId: 6439 }).catch(err => console.error(err)));
        //
        // connection.on('AuctionStatusChanged', data => {
        //     console.log("data",data);
        // });
        //
        // connection.on('BiddingStarted',  bidding => {
        //     console.log("bidding",bidding);
        // });
        // // connection.on("CurrentBidChanged", self.onCurrentBidChanged);
        // // connection.on("OnlineCountChanged", self.onlineCountChanged);
        //
        // console.log('connection passed  >> ');

    }, []);

    return (
        <View
            style={{width: '100%', backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>Signal R Test</Text>
        </View>
    );

};

export default SignalRTest;
