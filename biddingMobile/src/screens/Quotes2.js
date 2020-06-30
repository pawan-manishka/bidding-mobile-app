import React, {useContext, useState, useRef, useReducer} from 'react';
//import {Context as AuthContext} from "../context/AuthContext";
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
    Animated
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Main from '../navigation/RootStack';
import SignatureCapture from 'react-native-signature-capture';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import index from 'react-native-swiper/src';
import {Dropdown} from 'react-native-material-dropdown';
import {Context as CatalogContext} from "../context/CatalogContext";
import CirclesLoader from "react-native-indicator/lib/loader/CirclesLoader";
import TextLoader from "react-native-indicator/lib/loader/TextLoader";
import {DotsLoader} from "react-native-indicator";

const Quotes2 = () => {

        const {state: {CatalogList, ItemsByCatalog,PostBuyOutPriceStatus}, getPublishedCatalogs, getItemsByCatalog,updatePriceByID,clearupdatePriceByIDStatus} = useContext(CatalogContext);
        const [priceRefs, setpriceRefs] = React.useState([]);
        const [priceIndex, setpriceIndex] = React.useState('');
        const [ItemID, setItemID] = React.useState('');

    const tessOptions = {
        // whitelist: '^[0-9]*$',
        blacklist: '\'!,."#$%&/()={}[]+*-_:;<>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    };

        React.useEffect(() => {
            // add or remove refs
            getPublishedCatalogs();
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

        let catalogs_array = [];

        CatalogList.map((item, index) => (
            catalogs_array.push({value: item.Id})
        ))

        //console.log('items by catalog catalog list: ' + ItemsByCatalog.length)
        console.log('update price status: ' + PostBuyOutPriceStatus)
        const onChangeHandler = (value) => {
            console.log(`Selected value: ${value}`);
            getItemsByCatalog({id: value})
            // renderData()
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


        React.useEffect(() => {
            // add or remove refs
            setpriceRefs(priceRefs => (
                Array(25).fill().map((_, i) => priceRefs[i] || React.createRef())
            ));
        }, [25]);

        React.useEffect(() => {
            // add or remove refs
            // dispatch({type: "add", value: (showT => (
            //         Array(arrLength).fill().map((_, i) => showT[i] || {val: true})
            //     ))})

            Array(25).fill().map((_, i) => {
                showT[i] || dispatch({type: 'add', value: {price: 0, val: true,status:false}});
            });

        }, [25]);

        function resetPrice(index) {
            //console.log("function call: "+priceRefs[index].current)
            priceRefs[index].current.resetImage();
        }

        function savePrice(index,id) {
            priceRefs[index].current.saveImage();
            //showT[index].succes = true
            setpriceIndex(index);
            setItemID(id)
        }

        // if (PostBuyOutPriceStatus === 200){
        //     clearupdatePriceByIDStatus();
        //     let items = [...showT];
        //     let item = {...showT[index]};
        //     item.status = true;
        //     items[index] = item;
        //     dispatch({type: 'change', value: items});
        // }else if (PostBuyOutPriceStatus === 400 || PostBuyOutPriceStatus === 404) {
        //     clearupdatePriceByIDStatus();
        //     let items = [...showT];
        //     let item = {...showT[index]};
        //     item.status = false;
        //     items[index] = item;
        //     dispatch({type: 'change', value: items});
        // }

        function reDraw(index) {
            let items = [...showT];
            let item = {...showT[index]};
            console.log('index val: ', item.val);
            item.val = true;
            //item.price = result;
            items[index] = item;
            dispatch({type: 'change', value: items});
        }

        function onSavePrice(result) {
            //result.encoded - for the base64 encoded png
            //result.pathName - for the file path name
            console.log(result.pathName);
            RNTesseractOcr.recognize(result.pathName, 'LANG_ENGLISH', tessOptions)
                .then((result) => {
                    //this.setState({ ocrResult: result });
                    //this.setState({text: result})
                    //alert(result);
                    //price.push(result);
                    console.log(priceIndex);
                    let items = [...showT];
                    let item = {...showT[priceIndex]};
                    console.log('index val: ', item.val);
                    item.val = false;
                    item.price = result;
                    items[priceIndex] = item;
                    dispatch({type: 'change', value: items});
                    updatePriceByID({id:ItemID,BuyOutPrice:result})
                    console.log('OCR Result: ', result);
                    console.log('showT array: ', showT[priceIndex]);
                })
                .catch((err) => {
                    console.log('OCR Error: ', err);
                })
                .done();

        }

        function onDraggedPrice(index) {
            console.log('price dragged on index: ' + index);
        }

        return (
            <View style={{width: '100%', backgroundColor: '#0b1224'}}>
                <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                <View>
                    <View style={{
                        width: '100%',
                        backgroundColor: '#0b1224',
                        flexDirection: 'row',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                        marginRight: 10
                    }}>
                        {/*<Text style={{color:'white',fontSize: 18,fontWeight: 'bold'}}>Catalogs: </Text>*/}
                        <View style={{flex: 1, marginBottom: 15, marginRight: 20, backgroundColor: '#0b1224'}}>
                            <Dropdown
                                pickerStyle={{marginTop: 50}}
                                textColor='red'
                                itemColor='red'
                                selectedItemColor='green'
                                baseColor='white'
                                label='Select Auction'
                                data={catalogs_array}
                                onChangeText={(value => onChangeHandler(value))}
                            />
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: '#0b1224', height: '100%', width: '100%'
                    }}>
                        {CatalogList.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0b1224',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300
                            }}>
                                <CirclesLoader color='red'/>
                                <TextLoader textStyle={{color: 'red'}} text="Loading"/>
                            </View>
                            : null}
                        {ItemsByCatalog.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0b1224',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300
                            }}>
                                <Text style={{color: 'red'}}>No Record Found...</Text>
                            </View>
                            : null}
                        <FlatList
                            contentContainerStyle={{paddingBottom: 40}}
                            data={ItemsByCatalog}
                            renderItem={({item, index}) => (
                                <View style={{
                                    flex: 1, flexDirection: 'row', backgroundColor: '#0b1224', justifyContent: 'center',
                                    alignItems: 'stretch', padding: 2,
                                }}>
                                    <View style={{
                                        flexDirection: 'column', flex: 1, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 16
                                            }}>{item.InvoiceNumber}</Text>
                                        <Text style={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: 12
                                        }}>{item.ItemName}</Text>
                                        <Text style={{color: 'green', fontSize: 13}}>{item.ItemId}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>

                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: 'red',
                                                fontWeight: 'bold'
                                            }}>{item.UnitTypeName}</Text>
                                        <Text style={{fontSize: 13, color: 'green'}}>{item.PerUnitWeight + " Kg"}</Text>
                                        <Text style={{fontSize: 16, color: 'green'}}>{item.TotalWeight + " Kg"}</Text>

                                    </View>
                                    <View style={{
                                        flexDirection: 'row', flex: 2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{
                                            width: '100%',
                                            height: 105,
                                            backgroundColor: '#192535',
                                            borderRadius: 10,
                                            margin: 1,
                                        }}>
                                            <View style={{
                                                flexDirection: 'row', alignItems: 'center',
                                            }}>
                                            <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Price</Text>
                                                {/*{showT[index].success ? <Text style={{color:'green'}}>success</Text> : <Text style={{color:'red'}}>failed</Text>}*/}
                                            </View>
                                            {showT[index].val ?
                                                <View>
                                                    <SignatureCapture
                                                        style={{height: 60, marginLeft: 5, marginRight: 5}}
                                                        ref={priceRefs[index]}
                                                        onSaveEvent={onSavePrice}
                                                        onDragEvent={() => onDraggedPrice(index)}
                                                        saveImageFileInExtStorage={true}
                                                        showNativeButtons={false}
                                                        showTitleLabel={false}
                                                        viewMode={'portrait'}
                                                        backgroundColor={'#192535'}
                                                        strokeColor="white"
                                                        maxStrokeWidth={1}
                                                    />

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        marginTop: 2,
                                                    }}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                savePrice(index,item.ItemId);
                                                            }}
                                                            style={[
                                                                styles.button,
                                                                {
                                                                    borderColor: 'green',
                                                                    borderWidth: 1,
                                                                    borderRadius: 50,
                                                                    width: 20,
                                                                    height: 20,
                                                                    marginLeft: 5,
                                                                    marginRight: 5,
                                                                },
                                                            ]}>
                                                            <MaterialIcons name='done' size={18}
                                                                           color="green"/>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                resetPrice(index);
                                                            }}
                                                            style={[
                                                                styles.button,
                                                                {
                                                                    borderColor: 'red',
                                                                    borderWidth: 1,
                                                                    borderRadius: 50,
                                                                    width: 20,
                                                                    height: 20,
                                                                    marginLeft: 5,
                                                                    marginRight: 5,
                                                                },
                                                            ]}>
                                                            <MaterialIcons name='clear' size={18}
                                                                           color="red"/>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                : <View style={{
                                                    flexDirection: 'row',
                                                    height: 60,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}><Text style={{
                                                    color: 'white',
                                                    textAlign: 'center',
                                                    fontSize: 20,
                                                    flex: 5
                                                }}>{showT[index].price}</Text>
                                                    <View style={{
                                                        flex: 3,
                                                        height: 60,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                reDraw(index);
                                                            }}
                                                            style={[
                                                                styles.button,
                                                                {
                                                                    borderColor: 'white',
                                                                    borderWidth: 1,
                                                                    borderRadius: 50,
                                                                    width: 25,
                                                                    height: 25,
                                                                    marginRight: 5,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                },
                                                            ]}>
                                                            <AntDesign name='edit' size={18}
                                                                       color="white"/>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                        </View>
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

export default Quotes2;
