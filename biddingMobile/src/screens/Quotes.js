import React, {useContext, useState, useRef} from 'react';
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
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Main from '../navigation/RootStack';
import SignatureCapture from 'react-native-signature-capture';
import RNTesseractOcr from 'react-native-tesseract-ocr';

const Quotes = () => {

    function renderSeparator() {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: 'black',
                }}
            />
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

    // const [showtext, setshowtext] = React.useState(true);

    const tessOptions = {
        whitelist: '^[0-9]+$',
        blacklist: '\'!"#$%&/()={}[]+*-_:;<>ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
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

    function resetPrice(index) {
        //console.log("function call: "+priceRefs[index].current)
        priceRefs[index].current.resetImage();
    }

    function resetRemarks(index) {
        remarkRefs[index].current.resetImage();
    }

    function savePrice(index) {
        priceRefs[index].current.saveImage();
    }

    function saveRemarks(index) {
        remarkRefs[index].current.saveImage();
    }

    function onSavePrice(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result.pathName);
        RNTesseractOcr.recognize(result.pathName, 'LANG_ENGLISH', tessOptions)
            .then((result) => {
                //this.setState({ ocrResult: result });
                //this.setState({text: result})
                alert(result);
                console.log('OCR Result: ', result);
            })
            .catch((err) => {
                console.log('OCR Error: ', err);
            })
            .done();

    }

    function onDraggedPrice(index) {
        console.log('price dragged on index: ' + index);
    }

    function onDraggedRemarks(index) {
        console.log('remarks dragged on index: ' + index);
    }


    return (
        <View style={{width: '100%'}}>
            <FlatList
                data={data}
                renderItem={({item, index}) => (
                    <View style={{
                        flex: 1, flexDirection: 'row', backgroundColor: '#0b1224', justifyContent: 'center',
                        alignItems: 'stretch', padding: 5,
                    }}>
                        <View style={{
                            flexDirection: 'column', flex: 0.5, justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {/*<Text style={{color: 'white'}}>{item.key}</Text>*/}
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>AUCO45</Text>
                            <Text style={{color: 'white', fontSize: 12}}>Spread 3</Text>
                            <Text style={{color: 'white', fontSize: 12}}>18:53:30</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row', flex: 1.3, justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 20, lineHeight: 30, color: 'red'}}>1.08</Text>
                                    <Text style={{fontSize: 25, lineHeight: 30, color: 'red'}}>04</Text>
                                    <Text style={{fontSize: 11, lineHeight: 18, color: 'red'}}>9</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Entypo
                                        name="arrow-long-down" size={15}
                                        color="red"/>
                                    <Text style={{color: 'red', fontSize: 12}}>1.08026</Text>
                                </View>

                            </View>
                            <View style={{
                                flexDirection: 'column',
                                paddingLeft: 5,
                                paddingRight: 5,
                                justifyContent: 'center',
                            }}>
                                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                                    <Text style={{fontSize: 20, lineHeight: 30, color: 'red'}}>1.08</Text>
                                    <Text style={{fontSize: 25, lineHeight: 30, color: 'red'}}>05</Text>
                                    <Text style={{fontSize: 11, lineHeight: 18, color: 'red'}}>2</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <Entypo
                                        name="arrow-long-up" size={15}
                                        color="green"/>
                                    <Text style={{color: 'green', fontSize: 12}}>1.08026</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row', flex: 2, justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                width: '40%',
                                height: 85,
                                backgroundColor: '#192535',
                                borderRadius: 10,
                                margin: 2,
                            }}>
                                <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Price</Text>
                                {/*{showtext ?*/}
                                {/*    <View>*/}
                                        <SignatureCapture
                                            style={{height: 40, marginLeft: 5, marginRight: 5}}
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
                                    {/*</View>*/}
                                    {/*: <Text style={{*/}
                                    {/*    color: 'white',*/}
                                    {/*}}>100</Text>*/}
                                {/*}*/}
                            </View>
                            <View style={{
                                width: '55%',
                                height: 85,
                                backgroundColor: '#192535',
                                borderRadius: 10,
                                margin: 2,
                            }}>
                                <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Remarks</Text>
                                <SignatureCapture
                                    style={{height: 40, marginLeft: 5, marginRight: 5}}
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
                ItemSeparatorComponent={renderSeparator}
            />
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
