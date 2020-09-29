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


const AuctionHome2 = () => {

        const {state: {CatalogList, ItemsByCatalog, PostBuyOutPriceStatus}, getPublishedCatalogs, getItemsByCatalog, updatePriceByID, clearupdatePriceByIDStatus} = useContext(CatalogContext);
        const [priceRefs, setpriceRefs] = React.useState([]);
        const [priceIndex, setpriceIndex] = React.useState('');
        const [priceET, setpriceET] = React.useState('');
        const [ItemID, setItemID] = React.useState('');
        const [go, setgo] = React.useState(false);
        const [go2, setgo2] = React.useState(false);

        const [isEnabled, setIsEnabled] = useState(false);
        const toggleSwitch = () => setIsEnabled(previousState => !previousState);


        React.useEffect(() => {
            getItemsByCatalog({id: 1169})
            setgo(true)
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

        const [showT, dispatch] = useReducer((showT, {type, value}) => {
            switch (type) {
                case 'add':
                    return [...showT, value];
                case 'remove':
                    return showT.filter((_, index) => index !== value);
                case 'change':
                    //console.log('changed array: ' + JSON.stringify(value));
                    return value;
                default:
                    return showT;
            }
        }, []);

        if (ItemsByCatalog.length > 0 && go) {
            setgo(false)
            let value = []
            ItemsByCatalog.map((item, index) => {
                // Only do this if items have no stable IDs

                //console.log("index: " + index)<Text
                const value = {
                    idIndex: index, ref: React.createRef(), price: 0, val: true, Id: item.Id, ItemNumber: item.ItemNumber,
                    BrandName: item.BrandName, ItemCode: item.ItemCode, ItemType: item.ItemType,
                    NetWeight: item.NetWeight, TotalWeight: item.TotalWeight, status: 0
                }
                dispatch({type: 'add', value: value})
                // console.log("value array: " + JSON.stringify(value))
                //value.push(value2)
            })
            //dispatch({type: 'add', value: value})
            // console.log("showT array: " + JSON.stringify(showT))
            //console.log("value array: " + JSON.stringify(value))
        }

        return (
            <View style={{width: '100%', backgroundColor: '#0b1224'}}>
                <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                <View>
                    <View style={{
                        backgroundColor: '#0b1224', height: '100%', width: '100%'
                    }}>
                        {ItemsByCatalog.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0b1224',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300
                            }}>
                                <Text style={{color: '#489fdd'}}>No Records Found ...</Text>
                            </View>
                            : null}
                        <FlatList
                            contentContainerStyle={{paddingBottom: 40}}
                            data={showT}
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
                                                color: '#fb4040',
                                                fontWeight: 'bold',
                                                fontSize: 18
                                            }}>{item.ItemNumber}</Text>
                                        <Text style={{
                                            color: 'white',
                                            // fontWeight: 'bold',
                                            fontSize: 12
                                        }}>{item.BrandName}</Text>
                                        <Text style={{color: 'green', fontSize: 14}}>{item.ItemCode}</Text>
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
                                            }}>{item.ItemType}</Text>
                                        <Text style={{fontSize: 13, color: 'green'}}>{item.NetWeight + " Kg"}</Text>
                                        <Text style={{fontSize: 17, color: 'green'}}>{item.TotalWeight + " Kg"}</Text>

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

export default AuctionHome2;
