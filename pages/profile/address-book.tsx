import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Layout from "../../layouts/Dashboard";
import {
  AddEditAddressBookModal,
  WarningPopupModal,
} from "components/all-dialogs";
import { server } from "../../utils/server";
import { clientGetApiService } from "../../utils/client-api.service";
import { getCountryNameById } from "../../utils/master-data/master-data-country.service";
import { getStateNameById } from "../../utils/master-data/master-data-state.service";
import { getCityNameById } from "../../utils/master-data/master-data-city.service";
import { useDispatch } from "react-redux";
import { updateProfile } from "store/reducers/user";
import SnackBarAlert from "components/snackbar-alert";

const AddressBook = ({ snackbarRef }: { snackbarRef: React.RefObject<SnackBarAlert | null> }) => {
  const [_loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [_noDataText, setNoDataText] = useState(
    "Please wait while fetching your data..."
  );
  const [showAddressModal, setShowAddressModal] = useState<any>({
    show: false,
    type: "add",
    data: null,
  });
  const [showWarningPopupModal, setShowWarningPopupModal] = useState<any>({
    show: false,
    msg: "",
    data: null,
  });
  const dispatch = useDispatch();

  const getProfileDetails = async () => {
    try {
      setNoDataText("Please wait while fetching your data...");
      setLoading(true);
      const res: any = await clientGetApiService(
        `${server}/user-auth/profile`,
        {}
      );
      setLoading(false);
      // console.log("API Response==>>>", res);

      if (!res?.success) {
        // console.log("Error in Fetching User Profile---", res);
        snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
        setNoDataText("No Data Found !!");
      } else {
        const updatedProfile: any = { ...res.user.profile }; // Created a shallow copy of the response object
        // console.log("updatedProfile==>>>", updatedProfile);
        const updatedAddressBookData: any[] = JSON.parse(
          JSON.stringify(res.user.address)
        ); // Created a deep copy of the response objec
        // console.log("updatedAddressBookData==>>", updatedAddressBookData);

        // Get Country Name By Id
        const countryNameResults = await getCountryNameById(
          res?.user?.profile?.country
        );
        // console.log('getCountryNameById==>>>', countryNameResults);
        countryNameResults.forEach((element: any) => {
          // console.log("country element==>>>", element);
          if (element?._id) {
            updatedProfile.countryName = element?.name;
          }
        });

        // Get State Name By Id
        const stateNameResults = await getStateNameById(
          res?.user?.profile?.country,
          res?.user?.profile?.state
        );
        // console.log('getStateNameById==>>>', stateNameResults);
        stateNameResults.forEach((element: any) => {
          // console.log("country element==>>>", element);
          if (element?._id) {
            updatedProfile.stateName = element?.name;
          }
        });

        // Get City Name By Id
        const cityNameResults = await getCityNameById(
          res?.user?.profile?.country,
          res?.user?.profile?.city
        );
        // console.log('getCityNameById==>>>', cityNameResults);
        cityNameResults.forEach((element: any) => {
          // console.log("city element==>>>", element);
          if (element?._id) {
            updatedProfile.cityName = element?.name;
          }
        });

        let updatedAddressBookWithCountryAndCityNames: any;
        if (updatedAddressBookData?.length > 0) {
          updatedAddressBookWithCountryAndCityNames = await Promise.all(
            updatedAddressBookData.map(async (item: any) => {
              // Get Country Name By Id
              const countryNameResults = await getCountryNameById(
                item?.country
              );
              // console.log('getCountryNameById For AddressBook==>>>', countryNameResults);
              let countryName: any;
              countryNameResults.forEach((element: any) => {
                // console.log('country element For AddressBook==>>>', element);
                if (element?._id) {
                  countryName = element?.name;
                }
              });

              // Get City Name By Id
              const cityNameResults = await getCityNameById(
                item?.country,
                item?.city
              );
              // console.log('getCityNameById For AddressBook==>>>', cityNameResults);
              let cityName: any;
              cityNameResults.forEach((element: any) => {
                // console.log('city element For AddressBook==>>>', element);
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
            })
          );
        }

        const updatedRes = {
          ...res,
          user: {
            ...res.user,
            profile: updatedProfile,
            address: updatedAddressBookWithCountryAndCityNames,
          },
        };
        // console.log("Updated API Response for updatedProfile==>>>", updatedRes);

        // update the store
        dispatch(updateProfile(updatedRes?.user));
        setProfileData(updatedRes);
      }
      return { hasError: true, message: "Error In Try Block !!" };
    } catch (err: any) {
      console.error(err);
      setNoDataText("No Data Found !!");
      snackbarRef.current?.showSnackBar(`API call error !!, Error: ${err}`);
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
  // console.log("profileData===>>>>>>", profileData);

  const openAddressModal = (type: string, data?: any) => {
    // console.log("type===>>>", type);
    setShowAddressModal({
      show: !showAddressModal.show,
      type: type,
      data: data ? data : null,
    });
  };
  const onCloseAddressModal = () => {
    setShowAddressModal({ show: !showAddressModal.show });
    // console.log("address modal closed");
  };
  const onSaveAddressModal = (data: any) => {
    // console.log(data);

    snackbarRef.current?.showSnackBar(data?.snackbarMsg);
    if (data?.success) {
      // console.log("Success True");
      setShowAddressModal({ show: !showAddressModal.show });
      // console.log("address modal saved");
      getProfileDetails();
    } else {
      // console.log("Failed False");
    }
  };
  const openWarningPopupModal = (data: any) => {
    setShowWarningPopupModal({
      show: !showWarningPopupModal.show,
      msg: "Are you sure want to delete this address from Address Book ?",
      data: data ? data : null,
    });
  };
  const onCloseWarningPopupModal = () => {
    setShowWarningPopupModal({ show: !showWarningPopupModal.show });
    // console.log("warning modal closed");
  };
  const onSaveWarningPopupModal = (data: any) => {
    // console.log(data);

    snackbarRef.current?.showSnackBar(data?.snackbarMsg);
    if (data?.success) {
      // console.log("Success True");
      setShowWarningPopupModal({ show: !showWarningPopupModal.show });
      // console.log("warning modal saved");
      getProfileDetails();
    } else {
      // console.log("Failed False");
    }
  };

  return (
    <Layout title="Adress Book | FlowersChamp">
      <section className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-start">
        <div className="container-fluid">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center p-0 m-0">
            <div className="d-flex flex-wrap">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center p-0 m-0">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2 mt-3">
                  <Card className="w-auto">
                    <Card.Body className="py-1">
                      <h3>Your Receivers Address</h3>
                    </Card.Body>
                  </Card>
                </div>

                <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2 mt-3">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 my-2">
                    <Card className="w-auto">
                      <Card.Body className="py-1 mt-3">
                        <div className="row" style={{ margin: "0px 0px 20px" }}>
                          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                            <div className="address-box0">
                              <a
                                type="button"
                                data-toggle="modal"
                                onClick={() => openAddressModal("add")}
                              >
                                +
                              </a>
                              <span>Add Address</span>
                            </div>
                          </div>
                          {profileData?.user?.address?.length > 0 && (
                            <>
                              {profileData?.user?.address.map((item: any) => (
                                <div
                                  className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12"
                                  key={item?._id}
                                >
                                  <div className="address-box">
                                    <div className="d-flex-flex-wrap d-flex-row align-items-center justify-content-start">
                                      <h5 className="p-1 m-1">{item?.name}</h5>
                                      <p className="p-1 m-1">{item?.address}</p>
                                      <p className="p-1 m-1">
                                        {item?.cityName}
                                      </p>
                                      <p className="p-1 m-1">
                                        {item?.countryName}
                                      </p>
                                      <p className="p-1 m-1">
                                        Mobile No: <span>{item?.mobile}</span>
                                      </p>
                                      <p className="p-1 m-1">
                                        <a
                                          type="button"
                                          className="mx-1 btn btn-outline-dark"
                                          onClick={() =>
                                            openAddressModal("edit", item)
                                          }
                                        >
                                          <span className="font-weight-bold">
                                            Edit
                                          </span>
                                        </a>
                                        <a
                                          type="button"
                                          className="mx-1 btn btn-outline-danger"
                                        >
                                          <span
                                            className="font-weight-bold"
                                            onClick={() =>
                                              openWarningPopupModal(item)
                                            }
                                          >
                                            Delete
                                          </span>
                                        </a>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showAddressModal.show && (
        <AddEditAddressBookModal
          openModal={showAddressModal}
          onClose={onCloseAddressModal}
          onSave={onSaveAddressModal}
        />
      )}

      {showWarningPopupModal.show && (
        <WarningPopupModal
          openModal={showWarningPopupModal}
          onClose={onCloseWarningPopupModal}
          onSave={onSaveWarningPopupModal}
        />
      )}
    </Layout>
  );
};

AddressBook.auth = true;
export default AddressBook;
