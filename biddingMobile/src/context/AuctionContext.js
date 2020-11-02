import biddingAPI from '../api/bidding';
import CreateDataContext from "./CreateDataContext";
import AsyncStorage from "@react-native-community/async-storage";

const AuctionReducer = (state, action) => {
    switch (action.type) {
        case 'get_auction_list':
            return {...state, AuctionList: action.payload};

        case 'get_user_details':
            return {...state, UserDetails: action.payload};

        default:
            return state;
    }
};

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getAuctionList = dispatch => async () => {
    try {
        const response = await biddingAPI.get('/Auctions/pending-auction-list', config);
        dispatch({type: 'get_auction_list', payload: response.data});
    } catch (e) {
        console.log(e)
    }
};


const getUserDetails = dispatch => async () => {
    try {
        const response = await biddingAPI.get('/Users/get-user-details', config);
        dispatch({type: 'get_user_details', payload: response.data});
        console.log("User Details >>>>>>>>>>> "+response.data.Role);
        await AsyncStorage.setItem("role", response.data.Role)
    } catch (e) {
        console.log(e)
    }
};

export const {Provider, Context} = CreateDataContext(
    AuctionReducer,
    {
        getAuctionList, getUserDetails
    },
    {
        AuctionList: [], UserDetails:[]

    }
);
