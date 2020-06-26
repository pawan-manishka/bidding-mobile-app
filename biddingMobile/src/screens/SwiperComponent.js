import React, {useContext, useState} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity, StatusBar,Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import {authorize} from "react-native-app-auth";
import AsyncStorage from '@react-native-community/async-storage';

const config = {
    issuer: 'https://oklob2ctest.onmicrosoft.com.b2clogin.com/52eb8007-baf7-4f96-9b52-a0b8e79ad06b/v2.0/',
    clientId: 'eb4d6883-4d04-43b9-946d-e86a288df4bc',
    // redirectUrl: 'urn.ietf.wg.oauth.2.0.oob://oauthredirect',
    redirectUrl: 'com.azureadb2c://callback',
    additionalParameters: {},
    scopes: ['https://oklob2ctest.onmicrosoft.com/146ac18c-69ac-48bf-a9d6-cea3fc04c31d/Auction.Read'],

    serviceConfiguration: {
        authorizationEndpoint: 'https://oklob2ctest.b2clogin.com/oklob2ctest.onmicrosoft.com/B2C_1_SISU_AuctionPlatform/oauth2/v2.0/authorize',
        tokenEndpoint: 'https://oklob2ctest.b2clogin.com/oklob2ctest.onmicrosoft.com/B2C_1_SISU_AuctionPlatform/oauth2/v2.0/token',
        revocationEndpoint: 'https://oklob2ctest.b2clogin.com/oklob2ctest.onmicrosoft.com/B2C_1_SISU_AuctionPlatform/oauth2/v2.0//logout'
    }
};

const SwiperComponent = ({navigation}) => {

    const {hasLoggedInOnce, sethasLoggedInOnce} = useState(false);
    const [accessToken, setaccessToken] = useState('');
    const [accessTokenExpirationDate, setaccessTokenExpirationDate] = useState('');
    const [refreshToken, setrefreshToken] = useState('');
    const [animation_signup, setanimation_signup] = useState(null);
    const [animation_login, setanimation_login] = useState(null);
    const [show, setshow] = useState(false);

    // const token = AsyncStorage.getItem('token');
    // if (token){
    //     navigation.navigate('App');
    // }

    const authorized = async () => {
        try {
            const authState = await authorize(config);
            console.log('accessTokenExpirationDate: '+authState.accessTokenExpirationDate)
            console.log('scopes: '+authState.scopes)
            console.log('tokenType: '+authState.tokenType)
            console.log('refreshToken: '+authState.tokenType)
            console.log('accessToken: '+authState.accessToken)
            AsyncStorage.setItem('token',authState.accessToken);
            navigation.navigate('App');

        } catch (error) {
            Alert.alert('Failed to log in', error.message);
        }
    };

    function onIndexChanged(index) {
        if (index === 1) {
            setanimation_signup('bounceInLeft');
            setanimation_login('bounceInRight');
            setshow(true)
        } else {
            setanimation_signup(null);
            setanimation_login(null);
            setshow(false)
        }
    }


        return (
            <Swiper
                loop={false}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                onIndexChanged={(index) => onIndexChanged(index)}>


                <View style={styles.slide}>
                    <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                    <View style={styles.header}>
                        <Image
                            source={require('../asset/SmartAuction.png')}
                            style={styles.image}
                            resizeMode={'stretch'}
                        />
                    </View>
                    <View style={styles.footer}>
                        {/*<Text style={styles.title}> Welcome to Smart Auction</Text>*/}
                        <Text style={styles.title}>Welcome to{'\n'}Smart Auction</Text>

                        <Text style={styles.text}>
                            Smart Auction app facilitate more conveinient bidding for your lives
                        </Text>
                    </View>
                </View>

                {/*<View style={styles.slide}>*/}
                {/*<View style={styles.header}>*/}
                {/*<Image*/}
                {/*source={require('../asset/SmartAuction.png')}*/}
                {/*style={styles.image}*/}
                {/*resizeMode={'stretch'}*/}
                {/*/>*/}
                {/*</View>*/}
                {/*<View style={styles.footer}>*/}
                {/*<Text style={styles.title}> 24 Streets slide 2</Text>*/}
                {/*<Text style={styles.text}>*/}
                {/*Running jetifier to migrate libraries to AndroidX. You can disable*/}
                {/*it using "--no-jetifier" flag.*/}
                {/*</Text>*/}
                {/*</View>*/}
                {/*</View>*/}

                <View style={styles.slide}>
                    <View style={styles.header}>
                        <Image
                            source={require('../asset/SmartAuction.png')}
                            style={styles.image}
                            resizeMode={'stretch'}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.title}> Let's Start</Text>
                        <Text style={styles.text}>
                            Smart Auction app facilitate more conveinient bidding for your lives
                        </Text>
                        {show ? (
                            <View style={{flexDirection: 'row'}}>
                                <Animatable.View
                                    animation={animation_signup}
                                    delay={0}
                                    duration={1500}
                                    useNativeDriver>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('HomeScreen')
                                        }
                                        style={[
                                            styles.button,
                                            {
                                                borderColor: '#489fdd',
                                                borderWidth: 1,
                                                borderRadius: 50,
                                                marginTop: 15,
                                            },
                                        ]}>
                                        <Text style={{color:'#489fdd'}}>Sign Up</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                                <Animatable.View
                                    animation={animation_login}
                                    delay={0}
                                    duration={1500}
                                    useNativeDriver>
                                    <TouchableOpacity
                                        onPress={()=> authorized()}
                                        style={[
                                            styles.button,
                                            {
                                                backgroundColor: '#489fdd',
                                                borderRadius: 50,
                                                marginTop: 15,
                                                marginLeft: 20,
                                            },
                                        ]}>
                                        <Text style={{color: 'white'}}>Log In</Text>
                                    </TouchableOpacity>
                                </Animatable.View>
                            </View>
                        ) : null}
                    </View>
                </View>

            </Swiper>
        );
}
const {width, height} = Dimensions.get('screen');
// const height_image = height * 0.4 * 0.8;
// const width_image = height_image * 1.1;
const width_button = width * 0.3;
var styles = StyleSheet.create({
    slide: {
        flex: 1,
        // backgroundColor: 'white',
        backgroundColor: '#1a2435',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    image: {
        height: 100,
        width: 240,
    },
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    text: {
        color: '#dfdfdf', marginTop:20,
        textAlign: 'center',
    },
    dot: {
        backgroundColor: 'rgba(52,101,217,.4)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    activeDot: {
        backgroundColor: '#489fdd',
        width: 20,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
        marginVertical: 3,
    },
    button: {
        width: width_button,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SwiperComponent;
