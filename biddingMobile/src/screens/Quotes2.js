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


const Quotes2 = () => {

        const {state: {CatalogList, ItemsByCatalog, PostBuyOutPriceStatus}, getPublishedCatalogs, getItemsByCatalog, updatePriceByID, clearupdatePriceByIDStatus} = useContext(CatalogContext);
        const [priceRefs, setpriceRefs] = React.useState([]);
        const [priceIndex, setpriceIndex] = React.useState('');
        const [priceET, setpriceET] = React.useState('');
        const [ItemID, setItemID] = React.useState('');
        const [go, setgo] = React.useState(false);
        const [go2, setgo2] = React.useState(false);

        const [isEnabled, setIsEnabled] = useState(false);
        const toggleSwitch = () => setIsEnabled(previousState => !previousState);

        // const tessOptions = {
        //     // whitelist: '^[0-9]*$',
        //     blacklist: '\'!,."#$%&/()={}[]+*-_:;<>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        // };

        const tessOptions = {
            whitelist: "0123456789",
            blacklist: "!?@#$%&*()<>_-+=/:;'\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
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
            catalogs_array.push({value: item.Id+" - "+item.Name})
        ))

        //console.log('items by catalog catalog list: ' + ItemsByCatalog.length)
        console.log('update price status: ' + PostBuyOutPriceStatus)
        const onChangeHandler = (value) => {
            console.log(`Selected value: ${value}`);
            getItemsByCatalog({id: value.substring(0,4)})
            setgo(true)
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

        //console.log("showT array: " + JSON.stringify(showT))


        // React.useEffect(() => {
        //     // add or remove refs
        //     setpriceRefs(priceRefs => (
        //         Array(25).fill().map((_, i) => priceRefs[i] || React.createRef())
        //     ));
        // }, [25]);

        // React.useEffect(() => {
        //     // add or remove refs
        //     // dispatch({type: "add", value: (showT => (
        //     //         Array(arrLength).fill().map((_, i) => showT[i] || {val: true})
        //     //     ))})
        //
        //     Array(25).fill().map((_, i) => {
        //         showT[i] || dispatch({type: 'add', value: {price: 0, val: true, status: false}});
        //     });
        //
        // }, [25]);

        function resetPrice(index) {
            //console.log("function call: "+priceRefs[index].current)
            if (isEnabled){
                //setpriceET("");
            }else {
                showT[index].ref.current.resetImage();
            }
        }

        function savePrice(index, id) {
            console.log('id of correct: '+id)
            console.log('index of correct: '+index)
            if (isEnabled){
                savePriceEditText(priceET,id,index)
                setpriceIndex(index);
                setItemID(id)
                setgo2(true);
            }else {
                showT[index].ref.current.saveImage();
                setpriceIndex(index);
                setItemID(id)
                setgo2(true);
            }
            //showT[index].succes = true

        }

        if (PostBuyOutPriceStatus === 200 && PostBuyOutPriceStatus !== "" && go2) {
            setgo2(false)
            setpriceET("");
            let items = [...showT];
            let item = {...showT[priceIndex]};
            item.status = PostBuyOutPriceStatus;
            items[priceIndex] = item;
            dispatch({type: 'change', value: items});
            clearupdatePriceByIDStatus();

        } else if (PostBuyOutPriceStatus !== 200 && PostBuyOutPriceStatus !== "" && go2) {
            setgo2(false)
            let items = [...showT];
            let item = {...showT[priceIndex]};
            item.status = PostBuyOutPriceStatus;
            items[priceIndex] = item;
            dispatch({type: 'change', value: items});
            clearupdatePriceByIDStatus();
        }
        //console.log("show t status: "+showT[priceIndex].status)
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
                    updatePriceByID({id: ItemID, BuyOutPrice: result})
                    console.log('OCR Result: ', result);
                    console.log('showT array: ', showT[priceIndex]);
                })
                .catch((err) => {
                    console.log('OCR Error: ', err);
                })
                .done();

        }

        function savePriceEditText(value,id,index){
            console.log('price value: ', value);
            if (value === '') {
                if (Platform.OS === 'android') {
                    ToastAndroid.show("Please enter the price!", ToastAndroid.SHORT)
                } else {
                    AlertIOS.alert("Please enter the price!");
                }
            } else {
                let items = [...showT];
                let item = {...showT[index]};
                console.log('index val: ', item.val);
                item.val = false;
                item.price = value;
                items[index] = item;
                dispatch({type: 'change', value: items});
                updatePriceByID({id: id, BuyOutPrice: value})
            }
        }


        async function processDocument(result) {
            const processed = await vision().textRecognizerProcessImage(
                result.pathName,
            );
            console.log(result.pathName);
            console.log('Found text in document: ', processed.text);

            let filtord = processed.text.replace(/[^0-9]/g, '')
            if (filtord === '') {
                if (Platform.OS === 'android') {
                    ToastAndroid.show("Cannot identify the price. Please try again!", ToastAndroid.SHORT)
                } else {
                    AlertIOS.alert("Cannot identify the price. Please try again!");
                }
            } else {

                let items = [...showT];
                let item = {...showT[priceIndex]};
                console.log('index val: ', item.val);
                item.val = false;
                item.price = filtord;
                items[priceIndex] = item;
                dispatch({type: 'change', value: items});
                updatePriceByID({id: ItemID, BuyOutPrice: filtord})
            }

            processed.blocks.forEach((block) => {
                console.log('Found block with text: ', block.text);
                console.log('Confidence in block: ', block.confidence);
                console.log('Languages found in block: ', block.recognizedLanguages);
            });
        }

        function onDraggedPrice(index) {
            console.log('price dragged on index: ' + index);
        }

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage Permissions",
                    message:
                        "You needs to give storage permission before using the app",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the app");
            } else {
                console.log("Storage permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

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
                        <View style={{
                            flex: 1,
                            marginBottom: 15,
                            marginRight: 20,
                            backgroundColor: '#0b1224',
                            flexDirection: 'column',
                        }}>
                            <Dropdown
                                pickerStyle={{marginTop: 50}}
                                textColor='#489fdd'
                                itemColor='#489fdd'
                                selectedItemColor='green'
                                baseColor='white'
                                label='Select Catalog :'
                                data={catalogs_array}
                                onChangeText={(value => onChangeHandler(value))}
                            />
                            <View style={{flexDirection: 'row', display: 'flex', paddingTop: '2%', paddingBottom: '2%'}}>
                                <Text
                                    style={{
                                        color: '#dfdfdf',
                                        fontSize: 16
                                    }}>Canvas</Text>
                                <View>
                                    <Switch
                                        trackColor={{false: "#2b5f84", true: "#005900"}}
                                        thumbColor={isEnabled ? "green" : "#489fdd"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                                </View>
                                <Text
                                    style={{
                                        color: '#dfdfdf',
                                        fontSize: 16
                                    }}>Text Input</Text>
                            </View>
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
                                <CirclesLoader color='#489fdd'/>
                                <TextLoader textStyle={{marginTop: '1%', color: '#489fdd'}} text="Loading"/>
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
                                                color: 'red',
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
                                                color: 'red',
                                                fontWeight: 'bold'
                                            }}>{item.ItemType}</Text>
                                        <Text style={{fontSize: 13, color: 'green'}}>{item.NetWeight + " Kg"}</Text>
                                        <Text style={{fontSize: 17, color: 'green'}}>{item.TotalWeight + " Kg"}</Text>

                                    </View>

                                    <View style={{
                                        flexDirection: 'row', flex: 2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <View style={{
                                            flexDirection: 'column', flex: 1.2,
                                        }}>
                                            <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Price</Text>
                                            <View style={isEnabled ? {
                                                width: '100%',
                                                height: 65,
                                                backgroundColor: '#1a2332',
                                                borderRadius: 10,
                                                margin: 1,
                                            } : {
                                                width: '100%',
                                                height: 100,
                                                backgroundColor: '#1a2332',
                                                borderRadius: 10,
                                                margin: 1,
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row', alignItems: 'center',
                                                }}>
                                                    {/*{showT[index].success ? <Text style={{color:'green'}}>success</Text> : <Text style={{color:'red'}}>failed</Text>}*/}
                                                </View>
                                                {item.val ?
                                                    <View>
                                                        {isEnabled ? <View style={{justifyContent:'center',alignItems:'center',display:'flex',height:'100%'}}><TextInput
                                                                //value={name}
                                                                onChangeText={text => setpriceET(text)}
                                                                placeholder='Enter your price'
                                                                placeholderTextColor = "#7f7f7f"
                                                                keyboardType='numeric'
                                                                style={{height: 65,color:'white',fontSize: 17,textAlign:'center'}}
                                                            /></View> :
                                                            <SignatureCapture
                                                                style={{height: 96, margin: 2}}
                                                                ref={item.ref}
                                                                onSaveEvent={processDocument}
                                                                onDragEvent={() => onDraggedPrice(index)}
                                                                saveImageFileInExtStorage={true}
                                                                showNativeButtons={false}
                                                                showTitleLabel={false}
                                                                viewMode={'portrait'}
                                                                backgroundColor={'#1a2332'}
                                                                strokeColor="white"
                                                                maxStrokeWidth={1}
                                                            />
                                                        }

                                                    </View>
                                                    :
                                                    <View style={isEnabled ? {
                                                        flexDirection: 'row',
                                                        height: 60,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }: {
                                                        flexDirection: 'row',
                                                        height: 100,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text style={{
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            fontSize: 20,
                                                            flex: 5
                                                        }}>{item.price}</Text>
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
                                    <View style={{
                                        flexDirection: 'column', flex: 1, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>

                                        {item.val ?
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                marginTop: 2,
                                            }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        savePrice(index, item.Id);
                                                    }}
                                                    style={[
                                                        styles.button,
                                                        {
                                                            borderColor: 'green',
                                                            borderWidth: 1,
                                                            borderRadius: 50,
                                                            width: 24,
                                                            height: 24,
                                                            marginLeft: 5,
                                                            marginRight: 5,
                                                        },
                                                    ]}>
                                                    <MaterialIcons name='done' size={22}
                                                                   color="green"/>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        resetPrice(index);
                                                    }}
                                                    disabled={isEnabled}
                                                    style={[
                                                        styles.button,
                                                        {
                                                            borderColor: 'red',
                                                            borderWidth: 1,
                                                            borderRadius: 50,
                                                            width: 24,
                                                            height: 24,
                                                            marginLeft: 5,
                                                            marginRight: 5,
                                                        },
                                                    ]}>
                                                    <MaterialIcons name='clear' size={22}
                                                                   color="red"/>
                                                </TouchableOpacity>
                                            </View>
                                            : item.status === 200 ?
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                    marginTop: 2,
                                                }}>
                                                    <Text style={{fontSize: 14, color: '#489fdd'}}> Saved</Text>
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
