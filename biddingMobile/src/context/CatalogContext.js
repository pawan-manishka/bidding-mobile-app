import biddingAPI from '../api/bidding';
import CreateDataContext from "./CreateDataContext";

const CatalogReducer = (state, action) => {
    switch (action.type) {
        case 'get_published_catalogs':
            return {...state, CatalogList: action.payload};
        case 'get_items_by_catalog':
            return {...state, ItemsByCatalog: action.payload};
        case 'get_items_by_catalog_buyer':
            return {...state, ItemsByCatalogBuyer: action.payload};
        case 'get_post_buy_out_price_status':
            return {...state, PostBuyOutPriceStatus: action.payload};
        case 'clear_post_buy_out_price_status':
            return {...state, PostBuyOutPriceStatus: ""};
        default:
            return state;
    }
};

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getPublishedCatalogs = dispatch => async () => {
    try {
        const response = await biddingAPI.get('/CatalogsManager/published-catalogs', config);
        dispatch({type: 'get_published_catalogs', payload: response.data});
        //console.log("catalogs :"+response.data);
    } catch (e) {
        console.log(e)
    }
};

const getItemsByCatalog = dispatch => async ({id}) => {
    try {
        console.log("passed id: "+id);
        const response = await biddingAPI.get('/CatalogsManager/get-items-by-catalog/'+id+'?page=1&size=15&ignorePaging=false');

        if (response.data.data !== undefined){
            dispatch({type: 'get_items_by_catalog', payload: response.data.data});
        }
        console.log("response: "+response.data.data)

    } catch (e) {
        console.log(e)
    }
};

const getItemsByCatalogBuyer = dispatch => async ({CatalogId}) => {
    try {
        console.log("passed catalog id: "+CatalogId );
        const response = await biddingAPI.post('/CatalogItems/get-followed-catalogitems', {CatalogId});

        if (response.data !== undefined){
            dispatch({type: 'get_items_by_catalog_buyer', payload: response.data});
        }
        console.log("get items by catalog for buyer response: "+response.data)

    } catch (e) {
        console.log(e)
    }
};

const updatePriceByID = dispatch => async ({id,BuyOutPrice}) => {
    try {
        console.log("passed id: "+id);
        const response = await biddingAPI.post('/CatalogsManager/'+id+'/update-item-pricing',{BuyOutPrice});
        dispatch({type: 'get_post_buy_out_price_status', payload: response.status});

    } catch (e) {
        console.log(e)
        dispatch({type: 'get_post_buy_out_price_status', payload: 400});
    }
};

const clearupdatePriceByIDStatus = dispatch => () => {
    dispatch({type: "clear_post_buy_out_price_status"});
};

export const {Provider, Context} = CreateDataContext(
    CatalogReducer,
    {
        getPublishedCatalogs,
        getItemsByCatalog,
        getItemsByCatalogBuyer,
        updatePriceByID,
        clearupdatePriceByIDStatus,
    },
    {
        CatalogList: [],
        ItemsByCatalog: [],
        ItemsByCatalogBuyer:[],
        PostBuyOutPriceStatus:""
    }
);
