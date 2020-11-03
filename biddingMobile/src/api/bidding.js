import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const instance = axios.create({
    baseURL: 'https://smartauction.azurewebsites.net/api'
});

instance.interceptors.request.use(
    async(config)=>{
        const token = await AsyncStorage.getItem('token');
        if(token){
            config.headers.Authorization = `bearer ${token}`;
        }else {
            console.log('no token');
        }
        return config;
    },
    (err)=>{
        return Promise.reject(err);
    }
);

export default instance;
