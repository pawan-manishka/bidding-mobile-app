import React, {Component} from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar,
} from 'react-native';
export default class Login extends React.Component {
    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="#1a2435" barStyle="light-content"/>
                <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('SwiperComponent')
                } style={styles.login1}>
                    {/*<MaterialIcons*/}
                        {/*name="arrow-back"*/}
                        {/*size={20}*/}
                        {/*color="white"*/}

                    {/*/>*/}

                </TouchableOpacity>
                <Text style={styles.title}>Nice to{'\n'}see you Again</Text>
                <Text style={styles.text}>
                    Please login to your account,{'\n'}using email.
                </Text>
                <View style={styles.selection}>
                    {/*<MaterialIcons style={{marginLeft: 30}}*/}
                                   {/*name="email"*/}
                                   {/*size={20}*/}
                                   {/*color="white"*/}

                    {/*/>*/}
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor="white"
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.selection}>
                    {/*<MaterialIcons style={{marginLeft: 30}}*/}
                                   {/*name="lock"*/}
                                   {/*size={20}*/}
                                   {/*color="white"*/}

                    {/*/>*/}
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="white"
                        style={styles.textInput}
                        sourceTextWntry
                    />
                </View>

                <TouchableOpacity style={styles.login}>
                    <Text style={styles.textLogin}>Login</Text>
                </TouchableOpacity>
                <View style={{
                    flexDirection: 'row',
                    marginTop:'15%'
                }}>

                    <Image source={require('../asset/google.png')}
                           style={{width: 36, height: 36, marginTop: 2}}
                    />
                    <Text style={styles.signinWith}>Sign In with{'\n'}Google</Text>
                    <Image source={require('../asset/microsoft.png')}
                           style={{width: 48, height: 48, marginLeft: '10%', marginTop: -2}}
                    />
                    <Text style={styles.signinWith}>Sign in with{'\n'}Microsoft</Text>
                </View>
            </View>
        );
    }
}
styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a2435',
        // justifyContent: 'center',
        paddingHorizontal: 30,
        paddingVertical: 50,
    },
    title:{
        color:'white',
        fontSize: 24,
        marginBottom:'7%'
    },
    text:{
        color:'white',
        marginBottom:'20%'
    },
    textLogin:{
        color:'white',
        fontSize:16
    },
    login: {
        width: '36%',
        height: 50,
        backgroundColor: '#489fdd',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        borderRadius: 50,
    },
    login1: {
        width: '36%',
        height: 50,
        backgroundColor: '#1a2435',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        marginLeft:-30,
        borderRadius: 50,
    },
    textInput:{
        color:'white',
        flex: 1,
        paddingLeft: 0,
        marginLeft: 60,
    },
    selection: {
        flexDirection: 'row',
        borderRadius: 50,
        // paddingHorizontal: 10,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#2b3a52',
        marginTop: '5%',
    },
    signinWith: {
        textAlign: 'left',
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
})
