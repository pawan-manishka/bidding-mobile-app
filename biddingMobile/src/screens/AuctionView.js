import React, {useContext, useState} from 'react';
import {
    Text,
    View,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';
import {BackHandler} from 'react-native';
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

const AuctionView = ({route, navigation}) => {

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
        .withUrl("https://smartauction.azurewebsites.net/hubs/auction",
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

        console.log("auction data: >>", auctionData);
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
        <View style={{width: '100%', backgroundColor: '#121a2a'}}>
            <StatusBar backgroundColor="#121a2a" barStyle="light-content"/>

            <View style={{flexDirection: "row", alignItems: 'flex-end', alignSelf: 'flex-end', paddingRight: 15}}>
                <TouchableOpacity style={{paddingTop: 10}}
                                  onPress={() => navigation.reset({
                                      index: 0,
                                      routes: [{name: 'Home'}],
                                  })}>
                    <MaterialCommunityIcons name="arrow-left" color="white" size={25}/>
                </TouchableOpacity>
                <Text style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
                    fontSize: 18, paddingLeft: 10, paddingTop: 10
                }}>Back</Text>
            </View>
            <View>

                <View style={{
                    backgroundColor: '#121a2a', height: '100%', width: '100%', marginTop: 15
                }}>
                    <Text style={{
                        width: '100%', fontSize: 18, color: 'white',
                        paddingBottom: 2, paddingLeft: '4%'
                    }}> Auction : {auctionStatus.UniqueName}</Text>
                    <Text style={{
                        width: '100%', fontSize: 18, color: '#43d86d',
                        paddingTop: 2, paddingBottom: 20, paddingLeft: '4%'
                    }}> Status : {auctionStatus.StatusName}</Text>

                    {auctionData.length === 0 ?
                        <View style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#121a2a',
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
                                flex: 1, flexDirection: 'row', backgroundColor: '#121a2a', justifyContent: 'center',
                                alignItems: 'stretch', padding: '2 %',
                            }}>
                                <View style={{
                                    flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                    <Text
                                        style={{
                                            color: '#fb4040',
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
                                        style={{
                                            fontSize: 17,
                                            color: '#fb4040',
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
                                            color: '#fb4040',
                                            fontWeight: 'bold',
                                            fontSize: 13
                                        }}>Ask (Rs)</Text>
                                    <Text style={{
                                        color: '#43d86d',
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
                                            color: '#fb4040',
                                            fontWeight: 'bold',
                                            fontSize: 13
                                        }}>Bid (Rs)</Text>
                                    <Text style={{
                                        color: '#43d86d',
                                        fontWeight: 'bold',
                                        fontSize: 23
                                    }}>{item.BiddingPrice}</Text>
                                    <Text style={{color: '#43d86d', fontSize: 14}}>{item.Buyer}</Text>
                                </View>


                                <View style={{
                                    flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                    {item.Status === 15 ? <View style={{
                                        flexDirection: 'column', justifyContent: 'center',
                                        alignItems: 'center', backgroundColor: '#fb4040', width: 70, height: 30,
                                        borderRadius: 15
                                    }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}>CLOSED</Text>
                                    </View> : item.Status === 12 ? <View style={{
                                        flexDirection: 'column', justifyContent: 'center',
                                        alignItems: 'center', backgroundColor: '#f7c346', width: 70, height: 30,
                                        borderRadius: 15
                                    }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}>PENDING</Text>
                                    </View> : item.Status === 13 ? <View style={{
                                        flexDirection: 'column', justifyContent: 'center',
                                        alignItems: 'center', backgroundColor: '#43d86d', width: 70, height: 30,
                                        borderRadius: 15
                                    }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: 13
                                            }}>OPEN</Text>
                                    </View> : null}

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
