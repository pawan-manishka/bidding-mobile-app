import React, {useContext, useState, useRef, useReducer} from 'react';
import {Context as CatalogsContext} from "../context/CatalogsContext";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    Alert,
    Button,
    StatusBar, ImageBackground, ActivityIndicator, TouchableOpacity,
    FlatList,
} from 'react-native';

const Home = () => {
    const {state: {CatalogList}, getPublishedCatalogs} = useContext(CatalogsContext);

    //console.log("catalogs list: "+CatalogList);
    // if (CatalogList !== []) {
    //     alert(JSON.stringify(CatalogList))
    // }

    return (
        <View style={{width: '100%', backgroundColor: 'white'}}>
            <View style={{flexDirection: 'column', display: 'flex'}}>
                <Button
                    onPress={()=>{getPublishedCatalogs()}}
                    style={{backgroundColor: 'red'}}
                    title="Get Catalogs"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
                <Text>{JSON.stringify(CatalogList).toString()}</Text>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({});

export default Home;
