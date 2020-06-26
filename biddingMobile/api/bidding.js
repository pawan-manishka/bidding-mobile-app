import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const instance = axios.create({
    baseURL: 'https://dev1.okloapps.com/SmartAuction/api'
});

instance.interceptors.request.use(
    async(config)=>{
        const token = await AsyncStorage.getItem('token');
        console.log('token: '+token)
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
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
