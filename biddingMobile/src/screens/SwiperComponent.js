import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';

export default class SwiperComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animation_signup: null,
            animation_login: null,
            show: false,
        };
    }
    onIndexChanged(index) {
        if (index == 1) {
            this.setState({
                animation_signup: 'bounceInLeft',
                animation_login: 'bounceInRight',
                show: true,
            });
        } else {
            this.setState({
                animation_signup: null,
                animation_login: null,
                show: false,
            });
        }
    }
    render() {
        return (
            <Swiper
                loop={false}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                onIndexChanged={(index) => this.onIndexChanged(index)}>


                <View style={styles.slide}>
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
                        {this.state.show ? (
                            <View style={{flexDirection: 'row'}}>
                                <Animatable.View
                                    animation={this.state.animation_signup}
                                    delay={0}
                                    duration={1500}
                                    useNativeDriver>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate('HomeScreen')
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
                                    animation={this.state.animation_login}
                                    delay={0}
                                    duration={1500}
                                    useNativeDriver>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.navigate('LoginScreen')
                                        }
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
