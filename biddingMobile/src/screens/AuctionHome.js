import React, {useContext, useState, useRef, useReducer} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Alert,
    StatusBar, ImageBackground, ActivityIndicator, TouchableOpacity,
    FlatList,
    Animated,
    ToastAndroid,
    Platform,
    AlertIOS,
    Switch, PermissionsAndroid
} from 'react-native';
import { Chevron } from 'react-native-shapes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SignatureCapture from 'react-native-signature-capture';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import {Dropdown} from 'react-native-material-dropdown';
import {Context as CatalogContext} from "../context/CatalogContext";
import CirclesLoader from "react-native-indicator/lib/loader/CirclesLoader";
import TextLoader from "react-native-indicator/lib/loader/TextLoader";
import {DotsLoader} from "react-native-indicator";
import Entypo from 'react-native-vector-icons/Entypo';
import index from 'react-native-swiper/src';
import {utils} from '@react-native-firebase/app';
import vision from '@react-native-firebase/ml-vision';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-community/async-storage';
const signalR = require("@microsoft/signalr");

const readData = async () => {
    try {
        const accessToken = await AsyncStorage.getItem("token")

        if (accessToken !== null) {
            return accessToken
        }
    } catch (e) {
        alert('Failed to fetch the data from storage')
    }
}


const AuctionHome = () => {

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
                    setAuctionData(bidding.Changed)
                    console.log("bidding >>",bidding.Changed);
                    //console.log("bidding changed array >",bidding);
                });
                // connection.on("CurrentBidChanged", self.onCurrentBidChanged);
                // connection.on("OnlineCountChanged", self.onlineCountChanged);

                //console.log('connection passed  >> ');

            }
        )
        console.log("auction data: >>",auctionData);

    }, []);

    function renderSeparator() {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}>
                <View
                    style={{
                        height: 1,
                        width: '90%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#1f2837',
                    }}
                />
            </View>
        );
    };

        return (
            <View style={{width: '100%', backgroundColor: '#0b1224'}}>
                <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                <View>
                    <View style={{
                        backgroundColor: '#0b1224', height: '100%', width: '100%'
                    }}>
                        {/*{ItemsByCatalog.length === 0 ?*/}
                        {/*    <View style={{*/}
                        {/*        width: '100%',*/}
                        {/*        height: '100%',*/}
                        {/*        backgroundColor: '#0b1224',*/}
                        {/*        justifyContent: 'center',*/}
                        {/*        alignItems: 'center', display: 'flex',*/}
                        {/*        paddingBottom: 300*/}
                        {/*    }}>*/}
                        {/*        <Text style={{color: '#489fdd'}}>No Records Found ...</Text>*/}
                        {/*    </View>*/}
                        {/*    : null}*/}
                        <Text style={{width:'100%',fontSize:18,color:'green',
                        paddingTop:20,paddingBottom:20,paddingLeft: 10}}> Status: {auctionStatus.StatusName}</Text>
                        <FlatList
                            contentContainerStyle={{paddingBottom: 40}}
                            data={auctionData}
                            renderItem={({item, index}) => (
                                <View style={{
                                    flex: 1, flexDirection: 'row', backgroundColor: '#0b1224', justifyContent: 'center',
                                    alignItems: 'stretch', padding: 2,
                                }}>
                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 22
                                            }}>{item.LotNumber}</Text>
                                        <Text style={{
                                            color: 'white',
                                            // fontWeight: 'bold',
                                            fontSize: 15
                                        }}>{item.Grade}</Text>
                                        <Text style={{color: 'white', fontSize: 14}}>{item.TimeDisplay}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>

                                        <Text
                                            style={{
                                                fontSize: 17,
                                                color: 'red',
                                                fontWeight: 'bold'
                                            }}>{item.SellerRegistrationNumber}</Text>
                                        <Text style={{fontSize: 13, color: 'white'}}>{item.PerUnitWeight}</Text>
                                        <Text style={{fontSize: 17, color: 'white'}}>{item.TotalWeight + " Kg"}</Text>

                                    </View>

                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}>Ask (Rs)</Text>
                                        <Text style={{
                                            color: 'green',
                                            fontWeight: 'bold',
                                            fontSize: 23
                                        }}>{item.AskingPrice}</Text>
                                        <Text style={{color: 'white', fontSize: 14}}>{item.Broker}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}>Bid (Rs)</Text>
                                        <Text style={{
                                            color: 'green',
                                            fontWeight: 'bold',
                                            fontSize: 23
                                        }}>{item.BiddingPrice}</Text>
                                        <Text style={{color: 'green', fontSize: 14}}>{item.Buyer}</Text>
                                    </View>

                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={renderSeparator}
                        />
                    </View>
                </View>
            </View>
        );

    }
;

const styles = StyleSheet.create({
    progress: {
        margin: 10,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
    ,
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        borderBottomColor: '#8e7ce8',
        backgroundColor: '#9384f5',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 300,
        height: 50,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputs: {
        height: 57,
        marginLeft: '10%',
        borderColor: '#a3addf',
        flex: 1,
        color: 'white',
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center',
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 250,
        borderRadius: 30,
    },
    loginButton: {
        width: 160,
        height: 50,
        backgroundColor: '#f1f3f4',
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#7537dd',
    },
    logoTop: {
        width: 160,
        height: 50,
        margin: '8%',
    },
    logoBottom: {
        width: 210,
        height: 110,
        marginTop: '14%',
        marginBottom: '1%',
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginTop:15,
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        marginTop:15,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: 8,
        color: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default AuctionHome;
