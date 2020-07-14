import React, { Component } from 'react';
import { UIManager, LayoutAnimation, Alert } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';
import { Page, Button, ButtonContainer, Form, Heading } from './components';

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string
};

console.disableYellowBox = true;

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

export default class App extends Component<{}, State> {
    state = {
        hasLoggedInOnce: false,
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: ''
    };

    animateState(nextState: $Shape<State>, delay: number = 0) {
        setTimeout(() => {
            this.setState(() => {
                LayoutAnimation.easeInEaseOut();
                return nextState;
            });
        }, delay);
    }

    authorize = async () => {
        try {
            console.log("First >>", config)
            const authState = await authorize(config);
            Alert.alert("TOKEN >>", authState.accessToken);
            console.log("TOKEN >>", authState.accessToken)
            this.animateState(
                {
                    hasLoggedInOnce: true,
                    accessToken: authState.accessToken,
                    accessTokenExpirationDate: authState.accessTokenExpirationDate,
                    refreshToken: authState.refreshToken
                },
                500
            );
        } catch (error) {
            Alert.alert('Failed to log in', error.message);
        }
    };

    refresh = async () => {
        try {
            const authState = await refresh(config, {
                refreshToken: this.state.refreshToken
            });

            this.animateState({
                accessToken: authState.accessToken || this.state.accessToken,
                accessTokenExpirationDate:
                authState.accessTokenExpirationDate || this.state.accessTokenExpirationDate,
                refreshToken: authState.refreshToken || this.state.refreshToken
            });
        } catch (error) {
            Alert.alert('Failed to refresh token', error.message);
        }
    };

    revoke = async () => {
        try {
            await revoke(config, {
                tokenToRevoke: this.state.accessToken,
                sendClientId: true
            });
            this.animateState({
                accessToken: '',
                accessTokenExpirationDate: '',
                refreshToken: ''
            });
        } catch (error) {
            Alert.alert('Failed to revoke token', error.message);
        }
    }
}
