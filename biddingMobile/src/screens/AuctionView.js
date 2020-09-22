import React, {useContext, useState} from 'react';
import {
    Text,
    View,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const signalR = require("@microsoft/signalr");
import {Context as AuctionContext} from "../context/AuctionContext";
import CirclesLoader from 'react-native-indicator/lib/loader/CirclesLoader';
import TextLoader from 'react-native-indicator/lib/loader/TextLoader';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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


const AuctionView = ({route,navigation}) => {

       const {AuctionId} = route.params;
        const {state: {AuctionList}, getAuctionList,} = useContext(AuctionContext);

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

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://dev1.okloapps.com/SmartAuction/hubs/auction",
                {accessTokenFactory: () => readData().then((result) => result)})
            .build();

        React.useEffect(() => {
            if (AuctionId !== '') {

                connection.start()
                    .then(() => connection.invoke("JoinAuction", {AuctionId: AuctionId}).catch(err => console.error(err)));

                connection.on('AuctionStatusChanged', data => {
                    console.log("data", data);
                    setAuctionStatus(data)
                });

                connection.on('BiddingStarted', bidding => {
                    setAuctionData(bidding.Changed)
                    console.log("bidding >>", bidding.Changed);
                    //console.log("bidding changed array >",bidding);
                });

            }

            console.log("auction data: >>",auctionData);
            getAuctionList();

            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };

        }, [AuctionId]);

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

        let auction_array = [];

        AuctionList.map((item, index) => (
            auction_array.push({value: item.AuctionId, label: item.Name})
        ))

    function handleBackButtonClick() {
        navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
        })
        return true;
    }

        return (
            <View style={{width: '100%', backgroundColor: '#0b1224'}}>
                <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                <View style={{flexDirection: "row",alignItems:'center'}}>
                    <TouchableOpacity style={{paddingLeft:10,paddingTop:10}}
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                        })}>
                        <MaterialCommunityIcons name="arrow-left" color="white" size={25}/>
                    </TouchableOpacity>
                    <Text style={{display:'flex',justifyContent:'center',alignItems:'center',color:'white',
                    fontSize:18,paddingLeft:10,paddingTop:10}}>Auction Details</Text>
                </View>
                <View>

                    <View style={{
                        backgroundColor: '#0b1224', height: '100%', width: '100%',marginTop:15
                    }}>
                        <Text style={{width:'100%',fontSize:18,color:'white',
                            paddingBottom:2,paddingLeft: '4%'}}> Auction : {auctionStatus.UniqueName}</Text>
                        <Text style={{width:'100%',fontSize:18,color:'green',
                            paddingTop:2,paddingBottom:20,paddingLeft: '4%'}}> Status : {auctionStatus.StatusName}</Text>

                        {auctionData.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0b1224',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300
                            }}>
                                <CirclesLoader color='#489fdd'/>
                                <TextLoader textStyle={{marginTop: '1%', color: '#489fdd'}} text="Loading"/>
                            </View>
                            : null}

                        <FlatList
                            contentContainerStyle={{paddingBottom: 40}}
                            data={auctionData}
                            renderItem={({item, index}) => (
                                <View style={{
                                    flex: 1, flexDirection: 'row', backgroundColor: '#0b1224', justifyContent: 'center',
                                    alignItems: 'stretch', padding: '2 %',
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
                                        <Text style={{color: '#489fdd', fontSize: 14}}>{item.TimeDisplay}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>

                                        <Text
                                            style={{fontSize: 17,
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
                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                        <Text
                                            style={{
                                                color: '#489fdd',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}>{item.Status === 15 ? "Closed" :item.Status === 12 ? "Pending" : item.Status === 13 ? "Open":""}</Text>
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

    };

export default AuctionView;
