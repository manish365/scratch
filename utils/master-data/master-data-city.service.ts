import { server } from '../server';
import { masterDataGetApiService } from '../master-data-api.service';


const getCityDetails = async () => {
    try {
        const res = await masterDataGetApiService(`${server}/area`, {});
        // console.log('API Response==>>>', res);
        if (!res?.success) {
            console.log('Error in Fetching City Details---', res);
            return { hasError: true, message: 'Error In Try Block !!' }
        } else {
            res['results'].map((_item: any, index: any) => {
                res['results'][index]['countryDataId'] = res?.['results'][index]?.['country']?.['_id'];
                res['results'][index]['stateDataId'] = res?.['results'][index]?.['state']?.['_id'];
            });
            return res;
        }
    } catch (err: any) {
        console.error('Error in getCityDetails==>>>', err);
        return {
            hasError: true,
            message: `Error ${err}`,
        };
    }
};

const getCityDataListByCountryId = async (countryId: string) => {
    // console.log('countryId==>>>>', countryId);
    try {
        if (!countryId) {
            console.error('Error in getCityDataListByCountryId==>>>, Country Id is either null or undefined');
            return;
        } else {
            const cityDataList = await getCityDetails();
            // console.log('cityDataList===>>>>', cityDataList);
            if(!cityDataList?.success) {
                console.error('Error in Fetching State Details---', cityDataList);
                return { hasError: true, message: 'Error In Try Block !!' }
            } else {
                const filteredCityData = cityDataList?.results.filter((item: any) => (item?.countryDataId === countryId));
                // console.log('filteredCityData==>>>', filteredCityData);
                cityDataList.results = filteredCityData;
                // console.log('filteredCityDataList===>>>', cityDataList);
                return cityDataList;
            }
        }
    } catch (err: any) {
        console.error('Error in getStateDetails==>>>', err);
        return {
            hasError: true,
            message: `Error ${err}`,
        };
    }
}

const getCityNameById = async (countryId: string, cityId: string) => {
    // console.log('countryId==>>>>', countryId);
    // console.log('cityId==>>>>', cityId);
    if (!countryId) {
        console.error('Error in getCityNameById==>>>, Country Id is either null or undefined');
        return;
    } else if (!cityId) {
        console.error('Error in getCityNameById==>>>, City Id is either null or undefined');
        return;
    } else {
        const cityDataListByCountryId = await getCityDataListByCountryId(countryId);
        // console.log('cityDataListByCountryId===>>>>', cityDataListByCountryId);
        const filteredCityDataByCountryId = cityDataListByCountryId?.results
        .filter((item: any) => (item?._id === cityId));
        // console.log('filteredCityDataByCountryId==>>>', filteredCityDataByCountryId);
        return filteredCityDataByCountryId;
    }
}


export { getCityDetails, getCityDataListByCountryId, getCityNameById }
