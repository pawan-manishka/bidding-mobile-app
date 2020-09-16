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
    const [auctionStatus, setAuctionStatus] = useState('');
    const [auctionData, setAuctionData] = useState('');

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
                setAuctionStatus(data)
            });


            const arr = {"Changed": [{"AskingPrice": 140, "AuctionId": 6439, "AutoClosed": false, "Bidders": null, "BiddingEndTime": "2020-09-11T17:47:58.9136667",
                    "BiddingPrice": 45, "BiddingStartTime": "2020-09-11T17:47:38.9136667", "Broker": "FW", "BrokerId": 6, "BrokerTimeDisplay": "",
                    "BrokerUserId": 0, "Buyer": null, "BuyerId": 0, "BuyerUserId": 0, "CatalogItemId": 0, "Closed": true, "Extensions": 0,
                    "Followers": null, "Grade": "BOP", "Id": 187471, "ItemId": 93353, "LastBidTime": null, "LotNumber": 99, "MinBid": 0,
                    "OpenToBid": false, "OpenToSell": false, "Pending": false, "PerUnitWeight": 10, "Seller": "CRAIGHEAD", "SellerId": 116,
                    "SellerName": "CRAIGHEAD", "SellerRegistrationNumber": "MF0608", "SellingEndTime": "2020-09-11T17:48:28.9136667",
                    "SellingMark": "CRAIGHEAD", "Sold": false, "SoldTimeUtc": "0001-01-01T00:00:00", "SoldTo": "", "Status": 15, "StatusId": 15,
                    "TimeDisplay": "", "TotalWeight": 400, "UnitType": "Bags", "UnitTypeId": 1, "Units": 40, "WaitingForBroker": false},

                    {"AskingPrice": 140, "AuctionId": 6439, "AutoClosed": false, "Bidders": null, "BiddingEndTime": "2020-09-11T17:48:18.9136667",
                        "BiddingPrice": 45, "BiddingStartTime": "2020-09-11T17:47:58.9136667", "Broker": "FW", "BrokerId": 6, "BrokerTimeDisplay": "",
                        "BrokerUserId": 0, "Buyer": null, "BuyerId": 0, "BuyerUserId": 0, "CatalogItemId": 0, "Closed": true, "Extensions": 0,
                        "Followers": null, "Grade": "BOP", "Id": 187470, "ItemId": 93352, "LastBidTime": null, "LotNumber": 100, "MinBid": 0,
                        "OpenToBid": false, "OpenToSell": false, "Pending": false, "PerUnitWeight": 10, "Seller": "CRAIGHEAD", "SellerId": 116,
                        "SellerName": "CRAIGHEAD", "SellerRegistrationNumber": "MF0608", "SellingEndTime": "2020-09-11T17:48:48.9136667",
                        "SellingMark": "CRAIGHEAD", "Sold": false, "SoldTimeUtc": "0001-01-01T00:00:00", "SoldTo": "", "Status": 15, "StatusId": 15,
                        "TimeDisplay": "", "TotalWeight": 400, "UnitType": "Bags", "UnitTypeId": 1, "Units": 40, "WaitingForBroker": false},

                        ], "UniqueName": "AUCTION_6439"}

            console.log("bidding Changed > ",arr.Changed);
            console.log("bidding Changed status  > ",arr.Changed[0].Status);
            console.log("bidding name  > ",arr.UniqueName);



            connection.on('BiddingStarted',  bidding => {
                setAuctionData(bidding)
                console.log("bidding >>",bidding);
                console.log("bidding changed array >",bidding);
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
            <Text style={{fontSize: 18,}}>Auction ID : {auctionStatus.AuctionId} </Text>
            <Text style={{fontSize: 18, color:'green'}}>Status : {auctionStatus.StatusName}</Text>
        </View>
    );

};

export default SignalRTest;
