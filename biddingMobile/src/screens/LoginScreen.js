import React, {useContext, useState} from 'react';
import {StyleSheet, Alert,} from 'react-native';
import {Button, ButtonContainer, Form, Heading, Page} from "../../components";
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

const LoginScreen = ({navigation}) => {

    const {hasLoggedInOnce, sethasLoggedInOnce} = useState(false);
    const [accessToken, setaccessToken] = useState('');
    const [accessTokenExpirationDate, setaccessTokenExpirationDate] = useState('');
    const [refreshToken, setrefreshToken] = useState('');

    const token = AsyncStorage.getItem('token');
    if (token){
        navigation.navigate('HomeScreen');
    }

    const authorized = async () => {
        try {
            const authState = await authorize(config);
            console.log('accessTokenExpirationDate: '+authState.accessTokenExpirationDate)
            console.log('scopes: '+authState.scopes)
            console.log('tokenType: '+authState.tokenType)
            console.log('refreshToken: '+authState.tokenType)
            console.log('accessToken: '+authState.accessToken)
            AsyncStorage.setItem('token',authState.accessToken);
            navigation.navigate('HomeScreen');

        } catch (error) {
            Alert.alert('Failed to log in', error.message);
        }
    };

    return (
        <Page>

            <ButtonContainer>
                {!accessToken && (
                    <Button onPress={()=> authorized()} text="Login" color="#DA2536" />
                )}
            </ButtonContainer>
        </Page>
    )

}

LoginScreen.navigationOptions = () => {
    return {
        header: null
    };
};
const styles = StyleSheet.create({

});

export default LoginScreen;
