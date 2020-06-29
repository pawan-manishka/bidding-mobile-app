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

const Quotes2 = () => {

        const {state: {CatalogList, ItemsByCatalog}, getPublishedCatalogs, getItemsByCatalog} = useContext(CatalogContext);

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

//console.log('table data: '+JSON.stringify(catalogs_array))
        const onChangeHandler = (value) => {
            console.log(`Selected value: ${value}`);
            getItemsByCatalog({id: value})
            // renderData()
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
                        <View style={{flex: 1, marginBottom: 15, marginRight: 20}}>
                            <Dropdown
                                pickerStyle={{marginTop: 50}}
                                textColor='red'
                                itemColor='red'
                                selectedItemColor='green'
                                baseColor='red'
                                label='Select catalog'
                                data={catalogs_array}
                                onChangeText={(value => onChangeHandler(value))}
                            />
                        </View>
                    </View>
                    <FlatList
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
                                        style={{color: 'red', fontWeight: 'bold', fontSize: 16}}>{item.InvoiceNumber}</Text>
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>{item.ItemName}</Text>
                                    <Text style={{color: 'green', fontSize: 13}}>{item.ItemId}</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'column', flex: 1.2, justifyContent: 'center',
                                    alignItems: 'center',
                                }}>

                                    <Text
                                        style={{fontSize: 16, color: 'red', fontWeight: 'bold'}}>{item.UnitTypeName}</Text>
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
                                        <Text style={{color: 'white', paddingLeft: 8, paddingTop: 2}}>Price</Text>
                                        <View>
                                            <SignatureCapture
                                                style={{height: 60, marginLeft: 5, marginRight: 5}}
                                                //ref={priceRefs[index]}
                                                //onSaveEvent={onSavePrice}
                                                //onDragEvent={() => onDraggedPrice(index)}
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
                                                        //savePrice(index);
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
                                                        //resetPrice(index);
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

                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={renderSeparator}
                    />
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
