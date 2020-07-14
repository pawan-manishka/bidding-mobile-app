import biddingAPI from '../../api/bidding';
import CreateDataContext from "./CreateDataContext";
import {navigate} from "../navigationRef";

const CatalogReducer = (state, action) => {
    switch (action.type) {
        case 'get_published_catalogs':
            return {...state, CatalogList: action.payload};
        case 'get_items_by_catalog':
            return {...state, ItemsByCatalog: action.payload};
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
        console.log("catalogs :"+response.status);
        if (response.data === null){
            //alert('session expired!')
            navigate("LoginScreen");
        }
    } catch (e) {
        console.log(e.message)
        navigate("LoginScreen");
    }
};

const getItemsByCatalog = dispatch => async ({id}) => {
    try {
        console.log(id);
        const response = await biddingAPI.get('/CatalogsManager/get-items-by-catalog/'+id);
        dispatch({type: 'get_items_by_catalog', payload: response.data});

    } catch (e) {
        console.log(e)
    }
};

export const {Provider, Context} = CreateDataContext(
    CatalogReducer,
    {
        getPublishedCatalogs,
        getItemsByCatalog
    },
    {
        CatalogList: [],
        ItemsByCatalog: [],
    }
);
