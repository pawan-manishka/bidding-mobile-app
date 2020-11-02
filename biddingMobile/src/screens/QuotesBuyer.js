import React, {useContext, useState, useRef, useReducer} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    StatusBar, TouchableOpacity,
    FlatList,
    ToastAndroid,
    Platform,
    AlertIOS,
    Switch, PermissionsAndroid,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SignatureCapture from 'react-native-signature-capture';
import {Context as CatalogContext} from '../context/CatalogContext';
import CirclesLoader from 'react-native-indicator/lib/loader/CirclesLoader';
import TextLoader from 'react-native-indicator/lib/loader/TextLoader';
import vision from '@react-native-firebase/ml-vision';
import RNPickerSelect from 'react-native-picker-select';


const QuotesBuyer = () => {

        const {
            state: {CatalogList, ItemsByCatalog, ItemsByCatalogBuyer, PostBuyOutPriceStatus}, getPublishedCatalogs,
            getItemsByCatalog, getItemsByCatalogBuyer, updatePriceByID, clearupdatePriceByIDStatus,
        } = useContext(CatalogContext);
        const [priceRefs, setpriceRefs] = React.useState([]);
        const [priceIndex, setpriceIndex] = React.useState('');
        const [priceET, setpriceET] = React.useState('');
        const [minBidET, setminBidET] = React.useState('');
        const [maxBidET, setmaxBidET] = React.useState('');
        const [remarksET, setremarksET] = React.useState('');
        const [ItemID, setItemID] = React.useState('');
        const [go, setgo] = React.useState(false);
        const [go2, setgo2] = React.useState(false);

        const [isEnabled, setIsEnabled] = useState(false);
        const toggleSwitch = () => setIsEnabled(previousState => !previousState);

        const tessOptions = {
            whitelist: '0123456789',
            blacklist: '!?@#$%&*()<>_-+=/:;\'"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
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
                    flex: 1,
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
            catalogs_array.push({value: item.Id, label: item.Name})
        ));

        //console.log('items by catalog catalog list: ' + ItemsByCatalog.length)
        console.log('update price status: ' + PostBuyOutPriceStatus);
        const onChangeHandler = (value) => {
            //let filtered = photoTypes.filter(ex => ex.photo_type === photoval);
            console.log(`Selected value: ${value}`);
            getItemsByCatalogBuyer({CatalogId: value});
            setgo(true);
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

        console.log('items buy catalog buyer: ' + ItemsByCatalogBuyer.length);

        if (ItemsByCatalogBuyer.length > 0 && go) {
            setgo(false);
            let value = [];
            ItemsByCatalogBuyer.map((item, index) => {
                // Only do this if items have no stable IDs

                console.log('item name: ' + item.ItemName);
                const value = {
                    idIndex: index, ref: React.createRef(), price: 0, ref3: React.createRef(), minBid: 0,
                    ref4: React.createRef(), maxBid: 0, ref2: React.createRef(), remarks: '', val: true,
                    Id: item.Id, LotNumber: item.LotNumber,
                    SellingMark: item.SellingMark, Grade: item.Grade, Units: item.Units,
                    PerUnitWeight: item.PerUnitWeight, TotalWeight: item.TotalWeight, status: 0,
                };
                dispatch({type: 'add', value: value});
                //console.log("value array: " + JSON.stringify(value))
                //value.push(value2)
            });

            console.log('show t array: ' + JSON.stringify(showT));
        }

        //console.log("show t array: "+JSON.stringify(showT))


        function resetPrice(index) {
            //console.log("function call: "+priceRefs[index].current)
            if (isEnabled) {
                //setpriceET("");
            } else {
                showT[index].ref.current.resetImage();
                showT[index].ref2.current.resetImage();
            }
        }

        function resetRemarks(index) {
            remarkRefs[index].current.resetImage();
        }

        function saveRemarks(index) {
            remarkRefs[index].current.saveImage();
        }

        function savePrice(index, id) {
            console.log('id of correct: ' + id);
            console.log('index of correct: ' + index);
            if (isEnabled) {
                savePriceEditText(priceET, id, index);
                setpriceIndex(index);
                setItemID(id);
                setgo2(true);
            } else {
                showT[index].ref.current.saveImage();
                showT[index].ref2.current.saveImage();
                setpriceIndex(index);
                setItemID(id);
                setgo2(true);
            }
            //showT[index].succes = true

        }

        if (PostBuyOutPriceStatus === 200 && PostBuyOutPriceStatus !== '' && go2) {
            setgo2(false);
            setpriceET('');
            let items = [...showT];
            let item = {...showT[priceIndex]};
            item.status = PostBuyOutPriceStatus;
            items[priceIndex] = item;
            dispatch({type: 'change', value: items});
            clearupdatePriceByIDStatus();

        } else if (PostBuyOutPriceStatus !== 200 && PostBuyOutPriceStatus !== '' && go2) {
            setgo2(false);
            let items = [...showT];
            let item = {...showT[priceIndex]};
            item.status = PostBuyOutPriceStatus;
            items[priceIndex] = item;
            dispatch({type: 'change', value: items});
            clearupdatePriceByIDStatus();
        }

        function reDraw(index) {
            let items = [...showT];
            let item = {...showT[index]};
            console.log('index val: ', item.val);
            item.val = true;
            //item.price = result;
            items[index] = item;
            dispatch({type: 'change', value: items});
        }

        function savePriceEditText(value, id, index) {
            console.log('price value: ', value);
            if (value === '') {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Please enter the price!', ToastAndroid.SHORT);
                } else {
                    AlertIOS.alert('Please enter the price!');
                }
            } else {
                let items = [...showT];
                let item = {...showT[index]};
                console.log('index val: ', item.val);
                item.val = false;
                item.price = value;
                items[index] = item;
                dispatch({type: 'change', value: items});
                updatePriceByID({id: id, BuyOutPrice: value});
            }
        }


        async function processMinBid(result) {
            const processed = await vision().textRecognizerProcessImage(
                result.pathName,
            );
            console.log(result.pathName);
            console.log('Found text in document: ', processed.text);

            let filtord = processed.text.replace(/[^0-9]/g, '');
            if (filtord === '') {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Cannot identify the price. Please try again!', ToastAndroid.SHORT);
                } else {
                    AlertIOS.alert('Cannot identify the price. Please try again!');
                }
            } else {

                let items = [...showT];
                let item = {...showT[priceIndex]};
                console.log('index val: ', item.val);
                item.val = false;
                item.minBid = filtord;
                items[priceIndex] = item;
                dispatch({type: 'change', value: items});
                //updatePriceByID({id: ItemID, BuyOutPrice: filtord});
            }

            processed.blocks.forEach((block) => {
                console.log('Found block with text: ', block.text);
                console.log('Confidence in block: ', block.confidence);
                console.log('Languages found in block: ', block.recognizedLanguages);
            });
        }

    async function processMaxBid(result) {
        const processed = await vision().textRecognizerProcessImage(
            result.pathName,
        );
        console.log(result.pathName);
        console.log('Found text in document: ', processed.text);

        let filtord = processed.text.replace(/[^0-9]/g, '');
        if (filtord === '') {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Cannot identify the price. Please try again!', ToastAndroid.SHORT);
            } else {
                AlertIOS.alert('Cannot identify the price. Please try again!');
            }
        } else {

            let items = [...showT];
            let item = {...showT[priceIndex]};
            console.log('index val: ', item.val);
            item.val = false;
            item.maxBid = filtord;
            items[priceIndex] = item;
            dispatch({type: 'change', value: items});
            //updatePriceByID({id: ItemID, BuyOutPrice: filtord});
        }

        processed.blocks.forEach((block) => {
            console.log('Found block with text: ', block.text);
            console.log('Confidence in block: ', block.confidence);
            console.log('Languages found in block: ', block.recognizedLanguages);
        });
    }

    async function processDocument(result) {
        const processed = await vision().textRecognizerProcessImage(
            result.pathName,
        );
        console.log(result.pathName);
        console.log('Found text in document: ', processed.text);

        let filtord = processed.text.replace(/[^0-9]/g, '');
        if (filtord === '') {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Cannot identify the price. Please try again!', ToastAndroid.SHORT);
            } else {
                AlertIOS.alert('Cannot identify the price. Please try again!');
            }
        } else {

            let items = [...showT];
            let item = {...showT[priceIndex]};
            console.log('index val: ', item.val);
            item.val = false;
            item.price = filtord;
            items[priceIndex] = item;
            dispatch({type: 'change', value: items});
            updatePriceByID({id: ItemID, BuyOutPrice: filtord});
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

        function onDraggedMinBid(index) {
            console.log('min bid dragged on index: ' + index);
        }

        function onDraggedMaxBid(index) {
            console.log('max bid dragged on index: ' + index);
        }

        function onDraggedRemarks(index) {
            console.log('price dragged on index: ' + index);
        }

        const placeholder = {
            label: 'Select Catalog..',
            value: null,
            color: '#9EA0A4',
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
                        marginLeft: '3%',
                        marginRight: '3%',
                    }}>
                        {/*<Text style={{color:'white',fontSize: 18,fontWeight: 'bold'}}>Catalogs: </Text>*/}
                        <View style={{
                            flex: 1,
                            marginBottom: 15,
                            marginRight: 20,
                            backgroundColor: '#0b1224',
                            flexDirection: 'column',
                        }}>
                            <RNPickerSelect
                                placeholder={placeholder}
                                items={catalogs_array}
                                onValueChange={(value) => onChangeHandler(value)}
                                style={pickerSelectStyles}
                                // Icon={() => {
                                //     return <View><Chevron size={1.5} color="gray" /></View>;
                                // }}
                                useNativeAndroidPickerStyle={false}
                            />

                            <View style={{flexDirection: 'row', display: 'flex', paddingTop: '2%', paddingBottom: '2%'}}>
                                <Text
                                    style={{
                                        color: '#dfdfdf',
                                        fontSize: 16,
                                        marginLeft: '1%',
                                    }}>Canvas</Text>
                                <View>
                                    <Switch
                                        trackColor={{false: '#2b5f84', true: '#005900'}}
                                        thumbColor={isEnabled ? 'green' : '#489fdd'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                                </View>
                                <Text
                                    style={{
                                        color: '#dfdfdf',
                                        fontSize: 16,
                                    }}>Text Input</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: '#0b1224', height: '100%', width: '100%',
                    }}>
                        {CatalogList.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0b1224',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300,
                            }}>
                                <CirclesLoader color='#489fdd'/>
                                <TextLoader textStyle={{marginTop: '1%', color: '#489fdd'}} text="Loading"/>
                            </View>
                            : null}
                        {ItemsByCatalogBuyer.length === 0 ?
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#0b1224',
                                justifyContent: 'center',
                                alignItems: 'center', display: 'flex',
                                paddingBottom: 300,
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
                                                fontSize: 18,
                                            }}>{item.LotNumber}</Text>
                                        <Text style={{
                                            color: 'white',
                                            // fontWeight: 'bold',
                                            fontSize: 12,
                                        }}>{item.SellingMark}</Text>
                                        <Text style={{color: 'green', fontSize: 14}}>{item.Grade}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>

                                        <Text
                                            style={{
                                                fontSize: 17,
                                                color: '#fb4040',
                                                fontWeight: 'bold',
                                            }}>{item.Units}</Text>
                                        <Text style={{fontSize: 13, color: 'green'}}>{item.PerUnitWeight + ' Kg'}</Text>
                                        <Text style={{fontSize: 17, color: 'green'}}>{item.TotalWeight + ' Kg'}</Text>

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
                                                    {/*{showT[index].success ? <Text style={{color:'green'}}>success</Text> : <Text style={{color:'#fb4040'}}>failed</Text>}*/}
                                                </View>
                                                {item.val ?
                                                    <View>
                                                        {isEnabled ? <View style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                height: '100%',
                                                            }}><TextInput
                                                                //value={name}
                                                                onChangeText={text => setpriceET(text)}
                                                                placeholder='Enter Price'
                                                                placeholderTextColor="#7f7f7f"
                                                                keyboardType='numeric'
                                                                style={{
                                                                    height: 65,
                                                                    color: 'white',
                                                                    fontSize: 17,
                                                                    textAlign: 'center',
                                                                }}
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
                                                    } : {
                                                        flexDirection: 'row',
                                                        height: 100,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text style={{
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            fontSize: 20,
                                                            flex: 5,
                                                        }}>{item.price}</Text>
                                                        <View style={{
                                                            flex: 3,
                                                            height: 60,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
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
                                                                        alignItems: 'center',
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
                                        flexDirection: 'row', flex: 2, justifyContent: 'center',
                                        alignItems: 'center', marginLeft: 2,
                                    }}>
                                        <View style={{
                                            flexDirection: 'column', flex: 1.2,
                                        }}>
                                            <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Min Bid</Text>
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
                                                    {/*{showT[index].success ? <Text style={{color:'green'}}>success</Text> : <Text style={{color:'#fb4040'}}>failed</Text>}*/}
                                                </View>
                                                {item.val ?
                                                    <View>
                                                        {isEnabled ? <View style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                height: '100%',
                                                            }}><TextInput
                                                                //value={name}
                                                                onChangeText={text => setminBidET(text)}
                                                                placeholder='Enter min bid'
                                                                placeholderTextColor="#7f7f7f"
                                                                keyboardType='numeric'
                                                                style={{
                                                                    height: 65,
                                                                    color: 'white',
                                                                    fontSize: 17,
                                                                    textAlign: 'center',
                                                                }}
                                                            /></View> :
                                                            <SignatureCapture
                                                                style={{height: 96, margin: 2}}
                                                                ref={item.ref3}
                                                                onSaveEvent={processMinBid}
                                                                onDragEvent={() => onDraggedMinBid(index)}
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
                                                    } : {
                                                        flexDirection: 'row',
                                                        height: 100,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text style={{
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            fontSize: 20,
                                                            flex: 5,
                                                        }}>{item.minBid}</Text>
                                                        <View style={{
                                                            flex: 3,
                                                            height: 60,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
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
                                                                        alignItems: 'center',
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
                                        flexDirection: 'row', flex: 2, justifyContent: 'center',
                                        alignItems: 'center', marginLeft: 2,
                                    }}>
                                        <View style={{
                                            flexDirection: 'column', flex: 1.2,
                                        }}>
                                            <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Max Bid</Text>
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
                                                    {/*{showT[index].success ? <Text style={{color:'green'}}>success</Text> : <Text style={{color:'#fb4040'}}>failed</Text>}*/}
                                                </View>
                                                {item.val ?
                                                    <View>
                                                        {isEnabled ? <View style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                height: '100%',
                                                            }}><TextInput
                                                                //value={name}
                                                                onChangeText={text => setmaxBidET(text)}
                                                                placeholder='Enter max bid'
                                                                placeholderTextColor="#7f7f7f"
                                                                keyboardType='numeric'
                                                                style={{
                                                                    height: 65,
                                                                    color: 'white',
                                                                    fontSize: 17,
                                                                    textAlign: 'center',
                                                                }}
                                                            /></View> :
                                                            <SignatureCapture
                                                                style={{height: 96, margin: 2}}
                                                                ref={item.ref4}
                                                                onSaveEvent={processMaxBid}
                                                                onDragEvent={() => onDraggedMaxBid(index)}
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
                                                    } : {
                                                        flexDirection: 'row',
                                                        height: 100,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text style={{
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            fontSize: 20,
                                                            flex: 5,
                                                        }}>{item.maxBid}</Text>
                                                        <View style={{
                                                            flex: 3,
                                                            height: 60,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
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
                                                                        alignItems: 'center',
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
                                        flexDirection: 'row', flex: 2.6, justifyContent: 'center',
                                        alignItems: 'center', marginLeft: 2,
                                    }}>
                                        <View style={{
                                            flexDirection: 'column', flex: 1.4,
                                        }}>
                                            <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Remarks</Text>
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
                                                    {/*{showT[index].success ? <Text style={{color:'green'}}>success</Text> : <Text style={{color:'#fb4040'}}>failed</Text>}*/}
                                                </View>
                                                {item.val ?
                                                    <View>
                                                        {isEnabled ? <View style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                height: '100%',
                                                            }}><TextInput
                                                                //value={name}
                                                                onChangeText={text => setremarksET(text)}
                                                                placeholder='Enter Remarks'
                                                                placeholderTextColor="#7f7f7f"
                                                                style={{
                                                                    height: 65,
                                                                    color: 'white',
                                                                    fontSize: 17,
                                                                    textAlign: 'center',
                                                                }}
                                                            /></View> :
                                                            <SignatureCapture
                                                                style={{height: 96, margin: 2}}
                                                                ref={item.ref2}
                                                                //onSaveEvent={processDocument}
                                                                onDragEvent={() => onDraggedRemarks(index)}
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
                                                    } : {
                                                        flexDirection: 'row',
                                                        height: 100,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <Text style={{
                                                            color: 'white',
                                                            textAlign: 'center',
                                                            fontSize: 20,
                                                            flex: 5,
                                                        }}>{item.remarks}</Text>
                                                        <View style={{
                                                            flex: 3,
                                                            height: 60,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
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
                                                                        alignItems: 'center',
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
                                                            borderColor: '#fb4040',
                                                            borderWidth: 1,
                                                            borderRadius: 50,
                                                            width: 24,
                                                            height: 24,
                                                            marginLeft: 5,
                                                            marginRight: 5,
                                                        },
                                                    ]}>
                                                    <MaterialIcons name='clear' size={22}
                                                                   color="#fb4040"/>
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginTop: 15,
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
        marginTop: 15,
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

export default QuotesBuyer;
