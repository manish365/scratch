import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { FaUserAlt, FaPenSquare, FaHistory, FaLock } from "react-icons/fa";
import Layout from "../layouts/Dashboard";
import { AddEditAddressBookModal, WarningPopupModal } from "components/all-dialogs";
import Link from "next/link";
import { server } from '../utils/server';
import { clientGetApiService } from '../utils/client-api.service';
import { getCountryNameById } from '../utils/master-data/master-data-country.service';
import { getStateNameById } from '../utils/master-data/master-data-state.service';
import { getCityNameById } from '../utils/master-data/master-data-city.service';
import { useDispatch } from 'react-redux';
import { setProfile } from "store/reducers/user";
import SnackBarAlert from 'components/snackbar-alert';
import { useRouter } from "next/router";


const Dashboard = ({ snackbarRef }: { snackbarRef: React.RefObject<SnackBarAlert | null> }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [noDataText, setNoDataText] = useState("Please wait while fetching your data...");
  const [showAddressModal, setShowAddressModal] = useState<any>({ show: false, type: 'add', data: null });
  const [showWarningPopupModal, setShowWarningPopupModal] = useState<any>({ show: false, msg: '', data: null });
  const icons: { [key: string]: React.ElementType } = {
    FaUserAlt,
    FaPenSquare,
    FaHistory,
    FaLock,
  };
  const dispatch = useDispatch();

  const getDashboardList = async () => {
    // setLoading(true);
    try {
      setLoading(true);
      const fetchData: any = [
        { id: 1, text: "My Profile", icon: "FaUserAlt", url: "/profile/view-user-profile" },
        { id: 2, text: "New Order", icon: "FaPenSquare", url: "/" },
        { id: 3, text: "Order History", icon: "FaHistory", url: "/profile/order-history" },
        {
          id: 4,
          text: "Change Password",
          icon: "FaLock",
          url: "/auth/change-password",
        },
      ];

      await setDashboardData(fetchData);
      setLoading(false);
      return { hasError: true, message: "Error In Try Block !!" };
    } catch (err: any) {
      console.error(err);
      setNoDataText("No Data Found !!");
      return {
        hasError: true,
        message: `Error ${err}`,
      };
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Fetch data statically on component mount
    if (dashboardData.length == 0) {
      setNoDataText("No Data Found !!");
    }
    getDashboardList();
  }, []);
  if (dashboardData.length > 0) {
    // console.log(dashboardData);
  }

  const getProfileDetails = async () => {
    try {
      setNoDataText("Please wait while fetching your data...");
      setLoading(true);
      const res: any = await clientGetApiService(`${server}/user-auth/profile`, {});
      setLoading(false);
      // console.log('API Response==>>>', res);

      if (!res?.success) {
        // console.log('Error in Fetching User Profile---', res);
        snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
        setNoDataText("No Data Found !!");
      } else {
        const updatedProfile: any = { ...res.user.profile }; // Created a shallow copy of the response object
        // console.log('updatedProfile==>>>', updatedProfile);
        const updatedAddressBookData: any[] = JSON.parse(JSON.stringify(res.user.address)); // Created a deep copy of the response objec
        // console.log('updatedAddressBookData==>>', updatedAddressBookData);

        // Get Country Name By Id
        const countryNameResults = await getCountryNameById(res?.user?.profile?.country);
        // console.log('getCountryNameById==>>>', countryNameResults);
        countryNameResults.forEach((element: any) => {
          // console.log('country element==>>>', element);
          if (element?._id) {
            updatedProfile.countryName = element?.name;
          }
        });

        // Get State Name By Id
        const stateNameResults = await getStateNameById(res?.user?.profile?.country, res?.user?.profile?.state);
        // console.log('getStateNameById==>>>', stateNameResults);
        stateNameResults?.forEach((element: any) => {
          // console.log('country element==>>>', element);
          if (element?._id) {
            updatedProfile.stateName = element?.name;
          }
        });

        // Get City Name By Id
        const cityNameResults = await getCityNameById(res?.user?.profile?.country, res?.user?.profile?.city);
        // console.log('getCityNameById==>>>', cityNameResults);
        cityNameResults?.forEach((element: any) => {
          // console.log('city element==>>>', element);
          if (element?._id) {
            updatedProfile.cityName = element?.name;
          }
        });

        let updatedAddressBookWithCountryAndCityNames: any;
        if (updatedAddressBookData?.length > 0) {
          updatedAddressBookWithCountryAndCityNames = await Promise.all(updatedAddressBookData.map(async (item: any) => {
            // Get Country Name By Id
            const countryNameResults = await getCountryNameById(item?.country);
            // console.log('getCountryNameById For AddressBook==>>>', countryNameResults);
            let countryName: any;
            countryNameResults.forEach((element: any) => {
              // console.log('country element For AddressBook==>>>', element);
              if (element?._id) {
                countryName = element?.name;
              }
            });

            // Get City Name By Id
            const cityNameResults = await getCityNameById(item?.country, item?.city);
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
          }));
        }

        const updatedRes = { ...res, user: { ...res.user, profile: updatedProfile, address: updatedAddressBookWithCountryAndCityNames } };
        console.log('Updated API Response for updatedProfile==>>>', updatedRes);

        // update the store
        dispatch(setProfile(updatedRes?.user));
        setProfileData(updatedRes);
      }
      return { hasError: true, message: 'Error In Try Block !!' }
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

  const openAddressModal = (type: string, data?: any) => {
    // console.log('type===>>>', type);
    setShowAddressModal({ show: !showAddressModal.show, type: type, data: ((data) ? data : null) });
  };
  const onCloseAddressModal = () => {
    setShowAddressModal({ show: !showAddressModal.show });
    console.log("address modal closed");
  };
  const onSaveAddressModal = (data: any) => {
    console.log(data);

    snackbarRef.current?.showSnackBar(data?.snackbarMsg);
    if (data?.success) {
      // console.log('Success True');
      setShowAddressModal({ show: !showAddressModal.show });
      console.log("address modal saved");
      getProfileDetails();
    } else {
      console.log('Failed False');
    }
  };
  const openWarningPopupModal = (data: any) => {
    setShowWarningPopupModal({ show: !showWarningPopupModal.show, msg: 'Are you sure want to delete this address from Address Book ?', data: ((data) ? data : null) });
  };
  const onCloseWarningPopupModal = () => {
    setShowWarningPopupModal({ show: !showWarningPopupModal.show });
    console.log("warning modal closed");
  };
  const onSaveWarningPopupModal = (data: any) => {
    console.log(data);

    snackbarRef.current?.showSnackBar(data?.snackbarMsg);
    if (data?.success) {
      console.log('Success True');
      setShowWarningPopupModal({ show: !showWarningPopupModal.show });
      console.log("warning modal saved");
      getProfileDetails();
    } else {
      console.log('Failed False');
    }
  };
  const gotoTrackOrder = () => {
    router.push("/order-tracking");
  };

  return (
    <Layout title="Dasboard | FlowersChamp">
      <div className="container-fluid">
        <div className="col-lg-12 col-xs-12 align-items-center p-0 m-0">
          <div className="d-flex flex-wrap">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center p-0 m-0">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2 mt-3">
                <Card className="w-auto">
                  <Card.Body className="py-1">
                    <h3>Dashboard</h3>
                  </Card.Body>
                </Card>
              </div>

              {dashboardData.length > 0 ? (
                <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center py-2 mt-3">
                  {dashboardData.map((item: any) => (
                    <div
                      className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 align-items-center justify-content-between my-2"
                      key={item?.id}
                    >
                      <div className="d-flex flex-wrap align-items-center mx-0 py-2 my-2 w-100">
                        <Link href={item?.url} className="w-100">
                          <Card
                            className="w-auto d-flex flex-row py-2 cursor-pointer"
                            style={{ minHeight: "90px" }}
                          >
                            <div
                              style={{
                                fontSize: "25px",
                                padding: "2px 5px",
                                marginLeft: "6px",
                              }}
                            >
                              {" "}
                              {React.createElement(icons[item?.icon])}{" "}
                            </div>
                            <Card.Body className="py-2 w-auto">
                              <h5 style={{ whiteSpace: "normal" }}>
                                {item?.text}
                              </h5>
                            </Card.Body>
                          </Card>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2 mt-3 mx-1 px-2">
                  <h2>{noDataText}</h2>
                </div>
              )}

              {profileData?.success ? (
                <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2">
                  <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-xs-12 my-2">
                    <Card className="w-auto">
                      <Card.Body className="py-2">
                        <Card.Title className="d-flex flex-wrap flex-row align-items-center justify-content-between py-3">
                          <h3>Address Book</h3>
                          <h6 className="pt-1">
                            <a
                              type="button"
                              href="/profile/address-book"
                              style={{ color: "#007bff" }}
                            >
                              View All
                            </a>
                          </h6>
                        </Card.Title>
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
                              {profileData?.user?.address.map(
                                (item: any, index: number) => (
                                  <div
                                    className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12"
                                    key={item?._id}
                                  >
                                    {index < 2 && (
                                      <div className="address-box">
                                        <div className="d-flex-flex-wrap d-flex-row align-items-center justify-content-start">
                                          <h5 className="p-1 m-1">
                                            {item?.name}
                                          </h5>
                                          <p className="p-1 m-1">
                                            {item?.address}
                                          </p>
                                          <p className="p-1 m-1">
                                            {item?.cityName}
                                          </p>
                                          <p className="p-1 m-1">
                                            {item?.countryName}
                                          </p>
                                          <p className="p-1 m-1">
                                            Mobile No.:{" "}
                                            <span>{item?.mobile}</span>
                                          </p>
                                          <p className="p-1 m-1">
                                            <a
                                              type="button"
                                              className="mx-1"
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
                                              className="mx-1"
                                              onClick={() =>
                                                openWarningPopupModal(item)
                                              }
                                            >
                                              <span className="font-weight-bold">
                                                Delete
                                              </span>
                                            </a>
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                    {profileData?.user?.address?.length > 1 &&
                                      index === 1 && (
                                        <p className="d-flex flex-wrap align-items-center justify-content-end font-weight-bolder p-0 m-0">
                                          ...(+
                                          {profileData?.user?.address.length -
                                            (index + 1)}
                                          )
                                        </p>
                                      )}
                                  </div>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12 my-2">
                    <Card className="w-auto">
                      <Card.Body className="py-2">
                        <Card.Title className="d-flex flex-wrap flex-row align-items-center justify-content-between py-1">
                          <h3 className="mx-1">Track Order</h3>
                        </Card.Title>
                        <div className="row" style={{ margin: "0px 0px 20px" }}>
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="d-flex-flex-wrap d-flex-row align-items-center justify-content-start p-0 m-0">
                              <p className="px-0 mx-0">Fill in the form</p>
                              <p className="px-0 mx-0">
                                {" "}
                                With your order number and get the status of
                                your order..
                              </p>
                              <p className="px-0 mx-0">
                                {" "}
                                Kindly contact us here and we will help you.{" "}
                              </p>
                            </div>

                            <div className="d-flex-flex-wrap d-flex-row align-items-center justify-content-start p-0 m-0">
                              <form className="form form-inline">
                                <div className="form-row">
                                  <div className="form-group row">
                                    <label className="col-form-label col-form-label-md font-weight-bold mr-2">
                                      Order Id
                                    </label>

                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      name="orderId"
                                    />
                                  </div>

                                  <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center p-0 m-0 py-3">
                                    <button
                                      type="submit"
                                      className={
                                        loading
                                          ? "btn btn-primary btn-large px-5"
                                          : "btn btn-warning btn-large px-5"
                                      }
                                      disabled={loading}
                                      onClick={gotoTrackOrder}
                                    >
                                      {loading ? (
                                        <div
                                          className="spinner-border text-light font-weight-bolder"
                                          role="status"
                                        >
                                          <span className="sr-only font-weight-bolder">
                                            Loading...
                                          </span>
                                        </div>
                                      ) : (
                                        "Submit"
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2">
                  <h5>{noDataText}</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

Dashboard.auth = true;
export default Dashboard;

