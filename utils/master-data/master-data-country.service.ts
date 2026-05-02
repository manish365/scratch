import { server } from '../server';
import { masterDataGetApiService } from '../master-data-api.service';

const getCountryDetails = async () => {
    try {
        const res = await masterDataGetApiService(`${server}/country`, {});
        // console.log('API Response==>>>', res);
        if (!res?.success) {
            console.error('Error in Fetching Country Details---', res);
            return { hasError: true, message: 'Error In Try Block !!' }
          } else {
            return res;
          }
    } catch (err: any) {
        console.error('Error in getCountryDetails==>>>', err);
        return {
            hasError: true,
            message: `Error ${err}`,
        };
    }
};

const getCountryNameById = async(countryId: string) => {
    // console.log('countryId==>>>>', countryId);
    if(!countryId) {
        console.error('Error in getCountryNameById==>>>, Country Id is either null or undefined');
        return;
    } else {
        const countryDataList = await getCountryDetails();
        // console.log('countryDataList===>>>>', countryDataList);
        if(countryDataList?.success) {
            const filteredCountryDataByCountryId = countryDataList?.results.filter((item: any) => (item?._id === countryId));
            // console.log('filteredCountryDataByCountryId==>>>', filteredCountryDataByCountryId);
            return filteredCountryDataByCountryId;
        }
    }
};


export { getCountryDetails, getCountryNameById }