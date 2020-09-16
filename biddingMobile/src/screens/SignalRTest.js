import React, {useContext, useState, useRef, useReducer} from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert,
    StatusBar, ImageBackground, ActivityIndicator, TouchableOpacity, FlatList, Animated
} from 'react-native';
import {Context as CatalogContext} from "../context/CatalogContext";
import signalr from 'react-native-signalr';
import AsyncStorage from "@react-native-community/async-storage";
const signalR = require("@microsoft/signalr");

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

    const readData = async () => {
        try {
            const tokensaved = await AsyncStorage.getItem("token")
            if (tokensaved !== null) {
                return tokensaved;
            }
        } catch (e) {
            return 200
        }
    }

    React.useEffect(() => {
        readData().then((result) => {
                setToken(result)
            }
        )
        console.log('Access Token check : ', token);

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://dev1.okloapps.com/SmartAuction/hubs/auction", { accessTokenFactory: () => token })
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

    }, []);

    return (
        <View
            style={{width: '100%', backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>Signal R Test</Text>
        </View>
    );

};

export default SignalRTest;
