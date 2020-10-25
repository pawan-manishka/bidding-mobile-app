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
import index from 'react-native-swiper/src';
import {Dropdown} from 'react-native-material-dropdown';
import {Context as CatalogContext} from "../context/CatalogContext";

const Quotes = () => {

    const {state: {CatalogList}, getPublishedCatalogs} = useContext(CatalogContext);

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

    const data = [
        {key: 'Android'}, {key: 'iOS'}, {key: 'Java'}, {key: 'Swift'},
        {key: 'Php'}, {key: 'Hadoop'}, {key: 'Sap'},
        {key: 'Python'}, {key: 'Ajax'}, {key: 'C++'},
        {key: 'Ruby'}, {key: 'Rails'}, {key: '.Net'},
        {key: 'Perl'},
    ];

    const arrLength = data.length;
    const [priceRefs, setpriceRefs] = React.useState([]);
    const [remarkRefs, setremarkRefs] = React.useState([]);

    const [showtext, setshowtext] = React.useState(true);
    const [price, setprice] = React.useState([]);
    const [priceIndex, setpriceIndex] = React.useState('');
    //const [showT, setshowT] = React.useState([]);

    const tessOptions = {
        // whitelist: '^[0-9]*$',
        blacklist: '\'!,."#$%&/()={}[]+*-_:;<>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    };

    React.useEffect(() => {
        // add or remove refs
        setpriceRefs(priceRefs => (
            Array(arrLength).fill().map((_, i) => priceRefs[i] || React.createRef())
        ));
    }, [arrLength]);

    React.useEffect(() => {
        // add or remove refs
        setremarkRefs(remarkRefs => (
            Array(arrLength).fill().map((_, i) => remarkRefs[i] || React.createRef())
        ));
    }, [arrLength]);

    const [showT, dispatch] = useReducer((showT, {type, value}) => {
        switch (type) {
            case 'add':
                return [...showT, value];
            case 'remove':
                return showT.filter((_, index) => index !== value);
            case 'change':
                console.log('changed array: ' + JSON.stringify(value));
                return value;
            default:
                return showT;
        }
    }, []);

    React.useEffect(() => {
        // add or remove refs
        // dispatch({type: "add", value: (showT => (
        //         Array(arrLength).fill().map((_, i) => showT[i] || {val: true})
        //     ))})

        Array(arrLength).fill().map((_, i) => {
            showT[i] || dispatch({type: 'add', value: {price: 0, val: true}});
        });

    }, [arrLength]);

    console.log('array values: ' + JSON.stringify(showT));


    function resetPrice(index) {
        //console.log("function call: "+priceRefs[index].current)
        priceRefs[index].current.resetImage();
    }

    function resetRemarks(index) {
        remarkRefs[index].current.resetImage();
    }

    function savePrice(index) {
        priceRefs[index].current.saveImage();
        setpriceIndex(index);
    }

    function saveRemarks(index) {
        remarkRefs[index].current.saveImage();
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

    // function onSavePrice(result) {
    //     console.log(result.pathName);
    //     RNTesseractOcr.recognize(result.pathName, 'LANG_ENGLISH', tessOptions)
    //         .then((result) => {
    //             //this.setState({ ocrResult: result });
    //             //this.setState({text: result})
    //             //alert(result);
    //             //price.push(result);
    //             console.log(priceIndex);
    //             let items = [...showT];
    //             let item = {...showT[priceIndex]};
    //             console.log('index val: ', item.val);
    //             item.val = false;
    //             item.price = result;
    //             items[priceIndex] = item;
    //             dispatch({type: 'change', value: items});
    //             console.log('OCR Result: ', result);
    //             console.log('showT array: ', showT[priceIndex]);
    //         })
    //         .catch((err) => {
    //             console.log('OCR Error: ', err);
    //         })
    //         .done();
    // }

    function onDraggedPrice(index) {
        console.log('price dragged on index: ' + index);
    }

    function onDraggedRemarks(index) {
        console.log('remarks dragged on index: ' + index);
    }

    let data2 = [
        {value: 'Android'}, {value: 'iOS'}, {value: 'Java'}, {value: 'Swift'},
        {value: 'Php'}, {value: 'Hadoop'}, {value: 'Sap'},
        {value: 'Python'}, {value: 'Ajax'}, {value: 'C++'},
        {value: 'Ruby'}, {value: 'Rails'}, {value: '.Net'},
        {value: 'Perl'},
    ];

    let catalogs_array = [];

    CatalogList.map((item, index) => (
        catalogs_array = catalogs_array.concat({value:item.Name})
    ))

    //console.log('table data: '+JSON.stringify(catalogs_array))


    return (
        <View style={{width: '100%', backgroundColor: '#0b1224'}}>
            <View>
                <View style={{width: '100%', backgroundColor: '#0b1224',flexDirection:'row',display:'flex',justifyContent:'center',alignItems:'center',marginLeft:10,marginRight:10}}>
                    {/*<Text style={{color:'white',fontSize: 18,fontWeight: 'bold'}}>Catalogs: </Text>*/}
                    <View style={{ flex: 1,marginBottom:15,marginRight:20 }}>
                    <Dropdown
                        pickerStyle={{marginTop:50}}
                        textColor='red'
                        itemColor='red'
                        selectedItemColor='green'
                        baseColor='red'
                        label='Select catalog'
                        data={catalogs_array}
                    />
                    </View>
                </View>
                <FlatList
                    data={showT}
                    renderItem={({item, index}) => (
                        <View style={{
                            flex: 1, flexDirection: 'row', backgroundColor: '#0b1224', justifyContent: 'center',
                            alignItems: 'stretch', padding: 2,
                        }}>
                            <View style={{
                                flexDirection: 'column', flex: 0.7, justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                                <Text style={{color: 'red', fontWeight: 'bold', fontSize: 18}}>0235</Text>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>MS00U34</Text>
                                <Text style={{color: 'green', fontSize: 13}}>OPABC</Text>
                            </View>
                            <View style={{
                                flexDirection: 'column', flex: 0.7, justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                <Text style={{fontSize: 16, color: 'red', fontWeight: 'bold'}}>20 B</Text>
                                <Text style={{fontSize: 13, color: 'green'}}>26.00</Text>
                                <Text style={{fontSize: 16, color: 'green'}}>260.00 Kg</Text>

                            </View>
                            <View style={{
                                flexDirection: 'row', flex: 2, justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    width: '65%',
                                    height: 105,
                                    backgroundColor: '#192535',
                                    borderRadius: 10,
                                    margin: 1,
                                }}>
                                    <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Price</Text>
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
                                                        savePrice(index);
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
                                <View style={{
                                    width: '35%',
                                    height: 105,
                                    backgroundColor: '#192535',
                                    borderRadius: 10,
                                    margin: 2,
                                }}>
                                    <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Remarks</Text>
                                    <SignatureCapture
                                        style={{height: 60, marginLeft: 5, marginRight: 5}}
                                        ref={remarkRefs[index]}
                                        // onSaveEvent={this._onSaveEvent}
                                        onDragEvent={() => onDraggedRemarks(index)}
                                        saveImageFileInExtStorage={true}
                                        showNativeButtons={false}
                                        showTitleLabel={false}
                                        viewMode={'portrait'}
                                        backgroundColor={'#192535'}
                                        strokeColor="white"
                                        maxStrokeWidth={0.1}
                                    />
                                    <View style={{
                                        flexDirection: 'row', justifyContent: 'flex-end', marginTop: 2,
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                saveRemarks(index);
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
                                                resetRemarks(index);
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
                            </View>

                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={renderSeparator}
                />
            </View>
        </View>
    );

};

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

export default Quotes;
