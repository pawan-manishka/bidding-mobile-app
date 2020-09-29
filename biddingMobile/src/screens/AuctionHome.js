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
import {Context as AuctionContext} from "../context/AuctionContext";

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


const AuctionHome = ({navigation}) => {

    const {state: {AuctionList}, getAuctionList,} = useContext(AuctionContext);

    const [animatePress, setAnimatePress] = useState(new Animated.Value(1))
    const [token, setToken] = useState('');
    const [auctionStatus, setAuctionStatus] = useState('');
    const [auctionData, setAuctionData] = useState('');
    const [AuctionId, setAuctionId] = useState('');


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
                    //console.log('Access Token check : ', result);

                    // const connection = new signalR.HubConnectionBuilder()
                    //     .withUrl("https://dev1.okloapps.com/SmartAuction/hubs/auction",
                    //         {accessTokenFactory: () => result})
                    //     .build();

                    // connection.on("JoinAuction", data => {
                    //     console.log("data",data);
                    // });
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
                    // connection.on("CurrentBidChanged", self.onCurrentBidChanged);
                    // connection.on("OnlineCountChanged", self.onlineCountChanged);

                    //console.log('connection passed  >> ');
                    //connection.stop().done(console.log('connection stopped!'))

                }

        console.log("auction data: >>",auctionData);
        getAuctionList();

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

    const onChangeHandler = (value) => {
        //let filtered = photoTypes.filter(ex => ex.photo_type === photoval);
        console.log(`Selected value: ${value}`);
        //connection.stop()
        //setAuctionId(value)
        navigation.navigate("AuctionView");
        navigation.navigate('AuctionView', {
            AuctionId: value,
        })
        //getItemsByCatalog({id: value})
        //setgo(true)
        // renderData()
    };

    const placeholder = {
        label: 'Select Auction..',
        value: null,
        color: '#9EA0A4',
    };

        return (
            <View style={{width: '100%', backgroundColor: '#121a2a'}}>
                <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                <View>
                    <View style={{
                        width: '100%',
                        backgroundColor: '#121a2a',
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '3%',
                        marginRight: '3%'
                    }}>
                        {/*<Text style={{color:'white',fontSize: 18,fontWeight: 'bold'}}>Catalogs: </Text>*/}
                        <View style={{
                            flex: 1,
                            marginBottom: 15,
                            marginRight: 20,
                            backgroundColor: '#121a2a',
                            flexDirection: 'column',
                        }}>
                            <RNPickerSelect
                                placeholder={placeholder}
                                items={auction_array}
                                onValueChange={(value) => onChangeHandler(value)}
                                style={pickerSelectStyles}
                                useNativeAndroidPickerStyle={false}
                            />
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: '#121a2a', height: '100%', width: '100%'
                    }}>

                        {AuctionList.length === 0 ?
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
                        {AuctionList.length > 0 && AuctionId === '' ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#121a2a',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300
                            }}>
                                <Text style={{color: '#489fdd'}}>Select Auction from the list ...</Text>
                            </View>
                            : null}

                        <FlatList
                            contentContainerStyle={{paddingBottom: 40}}
                            data={auctionData}
                            renderItem={({item, index}) => (
                                <View style={{
                                    flex: 1, flexDirection: 'row', backgroundColor: '#121a2a', justifyContent: 'center',
                                    alignItems: 'stretch', padding: '2%',
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
                                            style={{fontSize: 17,
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
                                                color: '#fb4040',
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
