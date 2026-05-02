import { FormControlMobile, SelectSearch } from '@components/shared';
import React, { useState, useEffect } from 'react'
import { FaAddressBook } from 'react-icons/fa'
import { MdError } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useSession } from 'next-auth/react';

import BillingDetails from './BillingDetails';
import { setProfile } from "store/reducers/user";
import { AddEditAddressBookModal, CartAddressBookModal } from "components/all-dialogs";
import { updateCartShippingDetails } from 'store/reducers/cart';
import { server } from '../../utils/server';
import { clientGetApiService } from '../../utils/client-api.service';
import { getCountryNameById } from '../../utils/master-data/master-data-country.service';
import { getStateNameById } from '../../utils/master-data/master-data-state.service';
import { getCityNameById } from '../../utils/master-data/master-data-city.service';
import { CartShippingDetailsType } from '~types/index';


function ShippingDetails() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);
  const { cartItems }: any = useSelector((state: RootState) => state.cart);
  const { shippingDetails, metaData, cartError } = useSelector(
    (state: RootState) => state.cart
  );

  const [_loading, setLoading] = useState(false);
  const [_profileData, setProfileData] = useState<any>(null);
  const [showAddressModal, setShowAddressModal] = useState<any>({ show: false, type: 'add', data: null });
  const [showCartAddressBookModal, setShowCartAddressBookModal] = useState<any>({ show: false, data: null });
  const { data: session, status } = useSession();

  const getProfileDetails = async () => {
    try {
      setLoading(true);
      const res: any = await clientGetApiService(`${server}/user-auth/profile`, {});
      setLoading(false);

      if (!res?.success) {
        // console.log('Error in Fetching User Profile---', res);
      } else {
        const updatedProfile: any = { ...res.user.profile }; // Created a shallow copy of the response object
        const updatedAddressBookData: any[] = JSON.parse(JSON.stringify(res.user.address)); // Created a deep copy of the response objec

        // Get Country Name By Id
        const countryNameResults = await getCountryNameById(res?.user?.profile?.country);
        countryNameResults.forEach((element: any) => {
          if (element?._id) {
            updatedProfile.countryName = element?.name;
          }
        });

        // Get State Name By Id
        const stateNameResults = await getStateNameById(res?.user?.profile?.country, res?.user?.profile?.state);
        stateNameResults.forEach((element: any) => {
          if (element?._id) {
            updatedProfile.stateName = element?.name;
          }
        });

        // Get City Name By Id
        const cityNameResults = await getCityNameById(res?.user?.profile?.country, res?.user?.profile?.city);
        cityNameResults.forEach((element: any) => {
          if (element?._id) {
            updatedProfile.cityName = element?.name;
          }
        });

        let updatedAddressBookWithCountryAndCityNames: any;
        if (updatedAddressBookData?.length > 0) {
          updatedAddressBookWithCountryAndCityNames = await Promise.all(updatedAddressBookData.map(async (item: any) => {
            // Get Country Name By Id
            const countryNameResults = await getCountryNameById(item?.country);
            let countryName: any;
            countryNameResults.forEach((element: any) => {
              if (element?._id) {
                countryName = element?.name;
              }
            });

            // Get City Name By Id
            const cityNameResults = await getCityNameById(item?.country, item?.city);
            let cityName: any;
            cityNameResults.forEach((element: any) => {
              if (element?._id) {
                cityName = element?.name;
              }
            });

            // Create a new object with additional properties
            return {
              ...item,
              countryName,
              cityName,
            };
          }));
        }

        const updatedRes = { ...res, user: { ...res.user, profile: updatedProfile, address: updatedAddressBookWithCountryAndCityNames } };

        // update the store
        dispatch(setProfile(updatedRes?.user));
        setProfileData(updatedRes);
      }
      return { hasError: true, message: 'Error In Try Block !!' }
    } catch (err: any) {
      console.error(err);
      return {
        hasError: true,
        message: `Error ${err}`,
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  const openAddressModal = (type: string, data?: any) => {
    setShowAddressModal({ show: !showAddressModal.show, type: type, data: ((data) ? data : null) });
  };
  const onCloseAddressModal = () => {
    setShowAddressModal({ show: !showAddressModal.show });
  };
  const onSaveAddressModal = (data: any) => {
    if (data?.success) {
      setShowAddressModal({ show: !showAddressModal.show });
      getProfileDetails();
    } else {
      // console.log('Failed False');
    }
  };
  const openCartAddressBookModal = (data?: any) => {
    setShowCartAddressBookModal({ show: !showCartAddressBookModal.show, data: ((data) ? data : null) });
  };
  const onCloseCartAddressBookModal = () => {
    setShowCartAddressBookModal({ show: !showCartAddressBookModal.show });
  };
  const onSaveShippingData = (data: any) => {
    if (data?._id) {
      const nameArr = data?.name?.split(' ') || ['', ''];
      const formattedShippingDetails: CartShippingDetailsType = {
        firstName: nameArr[0],
        lastName: nameArr[1],
        address: data.address,
        city: (session?.user && status === "authenticated") ? data.city : cartItems[0]?.cityId,
        cityName: data.cityName,
        country: (session?.user && status === "authenticated") ? data.countryName : cartItems[0]?.countryName,
        mobile: {
          code: '+62',
          value: (session?.user && status === "authenticated") ? data.mobile : 'Indonesia',
        },
      };
      dispatch(updateCartShippingDetails(formattedShippingDetails));
    }
  }

  const gotoAddressBook = () => {
    if (profile?.address?.length > 0) {
      openCartAddressBookModal(profile?.address);
    } else {
      openAddressModal('add');
    }
  }

  const updateShippingDetails = (key: string, value: string) => {
    dispatch(updateCartShippingDetails({ [key]: value }));
  }

  const fetchCityNameFromId = (cityId: string | undefined) => {
    if (!cityId) { return '' }
    return metaData?.areas?.filter(area => area._id === cityId)[0]?.name
  }

  return (
    <>
      {cartError && (
        <div className="flex px-4 py-2 mb-4 items-center w-full bg-red-300 text-error gap-2">
          <strong className="flex items-center gap-1">
            <MdError /> Error!
          </strong>
          {cartError}
        </div>
      )}
      <div className="shadow flex flex-col w-full gap-4 p-4">
        <div className="flex justify-between items-center w-full">
          <span className="underline text-2xl">Shipping Details</span>
          {session?.user && status === "authenticated" && (
            <button
              className="btn btn-outline-dark flex gap-4 items-center"
              onClick={gotoAddressBook}
            >
              <FaAddressBook />
              Address Book
            </button>
          )}
        </div>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="fName"
              required
              value={shippingDetails?.firstName}
              onChange={($e) =>
                updateShippingDetails("firstName", $e.target.value)
              }
            />
            {shippingDetails?.hasError?.firstName && (
              <p
                className="message message--error"
                style={{ marginLeft: "5px" }}
              >
                First Name is required.
              </p>
            )}
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lName"
              required
              value={shippingDetails?.lastName}
              onChange={($e) =>
                updateShippingDetails("lastName", $e.target.value)
              }
            />
            {shippingDetails?.hasError?.lastName && (
              <p
                className="message message--error"
                style={{ marginLeft: "5px" }}
              >
                Last Name is required.
              </p>
            )}
          </div>
        </div>
        <div className="col-md-12 w-full p-0 m-0">
          <textarea
            id=""
            rows={4}
            className="w-full form-control"
            placeholder="Recipient Address"
            name="address"
            value={shippingDetails?.address}
            onChange={($e) => updateShippingDetails("address", $e.target.value)}
          ></textarea>
          {shippingDetails?.hasError?.address && (
            <p className="message message--error" style={{ marginLeft: "5px" }}>
              Address is required.
            </p>
          )}
        </div>
        <FormControlMobile />
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Enter City"
              value={fetchCityNameFromId(shippingDetails?.city)}
              onChange={($e) => updateShippingDetails("city", $e.target.value)}
              readOnly={true}
              disabled={true}
            />
            {shippingDetails?.hasError?.city && (
              <p
                className="message message--error"
                style={{ marginLeft: "5px" }}
              >
                City name is required.
              </p>
            )}
          </div>
          <div className="col-md-6">
            {metaData?.countries && (
              <SelectSearch
                list={metaData?.countries?.filter((ct) => ct.shippingAllowed)}
                onChange={(value: string) =>
                  updateShippingDetails("country", value)
                }
                value={shippingDetails?.country}
                disabled={false}
                countryFlag={false}
              />
            )}
          </div>
        </div>
        <BillingDetails />
      </div>

      {showAddressModal.show && (
        <AddEditAddressBookModal
          openModal={showAddressModal}
          onClose={onCloseAddressModal}
          onSave={onSaveAddressModal}
        />
      )}

      {showCartAddressBookModal.show && (
        <CartAddressBookModal
          openModal={showCartAddressBookModal}
          onClose={onCloseCartAddressBookModal}
          openAddAddressModal={openAddressModal}
          onSave={onSaveShippingData}
        />
      )}
    </>
  );
}

export default ShippingDetails
