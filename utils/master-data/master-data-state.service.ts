import { server } from '../server';
import { masterDataGetApiService } from '../master-data-api.service';


const getStateDetails = async () => {
    try {
        const res = await masterDataGetApiService(`${server}/state`, {});
        // console.log('API Response==>>>', res);
        if (!res?.success) {
            console.error('Error in Fetching State Details---', res);
            return { hasError: true, message: 'Error In Try Block !!' }
        } else {
            res['results'].map((_item: any, index: any) => {
                // console.log(index, '===>>>', item);
                res['results'][index]['countryDataId'] = res?.['results'][index]?.['countryId']?.['_id'];
            });
            return res;
        }
    } catch (err: any) {
        console.error('Error in getStateDetails==>>>', err);
        return {
            hasError: true,
            message: `Error ${err}`,
        };
    }
};

const getStateDataListByCountryId = async (countryId: string) => {
    // console.log('countryId==>>>>', countryId);
    try {
        if (!countryId) {
            console.error('Error in getStateDataListByCountryId==>>>, Country Id is either null or undefined');
            return;
        } else {
            const stateDataList = await getStateDetails();
            // console.log('stateDataList===>>>>', stateDataList);
            if(!stateDataList?.success) {
                console.error('Error in Fetching State Details---', stateDataList);
                return { hasError: true, message: 'Error In Try Block !!' }
            } else {
                const filteredStateData = stateDataList?.results.filter((item: any) => (item?.countryDataId === countryId));
                // console.log('filteredStateData==>>>', filteredStateData);
                stateDataList.results = filteredStateData;
                // console.log('filteredStateDataList===>>>', stateDataList);
                return stateDataList;
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

const getStateNameById = async (countryId: string, stateId: string) => {
    // console.log('countryId==>>>>', countryId);
    // console.log('stateId==>>>>', stateId);
    if (!countryId) {
        console.error('Error in getStateNameById==>>>, Country Id is either null or undefined');
        return;
    } else if (!stateId) {
        console.error('Error in getStateNameById==>>>, State Id is either null or undefined');
        return;
    } else {
        const stateDataListByCountryId = await getStateDataListByCountryId(countryId);
        // console.log('stateDataListByCountryId===>>>>', stateDataListByCountryId);
        const filteredStateDataByCountryId = stateDataListByCountryId?.results
        .filter((item: any) => (item?._id === stateId));
        // console.log('filteredStateDataByCountryId==>>>', filteredStateDataByCountryId);
        return filteredStateDataByCountryId;
    }
}


export { getStateDetails, getStateDataListByCountryId, getStateNameById }
