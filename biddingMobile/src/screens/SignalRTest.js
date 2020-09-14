import React, {useContext, useState, useRef, useReducer} from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert,
    StatusBar, ImageBackground, ActivityIndicator, TouchableOpacity, FlatList, Animated
} from 'react-native';
import {Context as CatalogContext} from "../context/CatalogContext";
import signalr from 'react-native-signalr';
import AsyncStorage from "@react-native-community/async-storage";

const SignalRTest = () => {

    const {state: {CatalogList}, getPublishedCatalogs} = useContext(CatalogContext);
    const [animatePress, setAnimatePress] = useState(new Animated.Value(1))
    const [token, setToken] = useState('');

    const animateIn = () => {
        Animated.timing(animatePress, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true // Add This line
        }).start();
    }

    const readData = async () => {
        try {
            const tokensaved = await AsyncStorage.getItem("token")
            if (tokensaved !== null) {
                return tokensaved;
            }
        } catch (e) {
            return 200
        }
    }

    React.useEffect(() => {
        readData().then((result) => {
                setToken(result)
            }
        )
        console.log('Access Token check: ', token);
        const connection = signalr.hubConnection('https://dev1.okloapps.com/SmartAuction/hubs/auction',
            {
                qs: {
                    access_token: token
                },
            });

        connection.logging = true;

        const proxy = connection.createHubProxy('Auction');

        // atempt connection, and handle errors
        connection.start().done(() => {
            console.log('Now connected, connection ID=' + connection.id);

            proxy.invoke('JoinAuction', { AuctionId: 6439 })
                .done((directResponse) => {
                    console.log('direct-response-from-server', directResponse);
                }).fail(() => {
                console.warn('Something went wrong when calling server, it might not be up and running?')
            });

        }).fail(() => {
            console.log('Failed');
        });

        //connection-handling
        connection.connectionSlow(() => {
            console.log('We are currently experiencing difficulties with the connection.')
        });

        connection.error((error) => {
            const errorMessage = error.message;
            let detailedError = '';
            if (error.source && error.source._response) {
                detailedError = error.source._response;
            }
            if (detailedError === 'An SSL error has occurred and a secure connection to the server cannot be made.') {
                console.log('When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14')
            }
            console.debug('SignalR error: ' + errorMessage, detailedError)
        });

    }, []);

    return (
        <View
            style={{width: '100%', backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>Signal R Test</Text>
        </View>
    );

};

export default SignalRTest;
