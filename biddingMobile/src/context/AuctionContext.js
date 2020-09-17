import biddingAPI from '../api/bidding';
import CreateDataContext from "./CreateDataContext";

const AuctionReducer = (state, action) => {
    switch (action.type) {
        case 'get_auction_list':
            return {...state, AuctionList: action.payload};
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
        //console.log("auctions :"+response.data);
    } catch (e) {
        console.log(e)
    }
};

export const {Provider, Context} = CreateDataContext(
    AuctionReducer,
    {
        getAuctionList,
    },
    {
        AuctionList: [],

    }
);
