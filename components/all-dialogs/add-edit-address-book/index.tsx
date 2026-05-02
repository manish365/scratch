import React, { useEffect, useState } from "react";
import { Modal, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { server } from "../../../utils/server";
import { UserDataStorageService } from '../../../utils/services';
import { clientPostApiService, clientPatchApiService } from "../../../utils/client-api.service";
import { getCountryDetails } from "../../../utils/master-data/master-data-country.service";
import { getStateDataListByCountryId } from "../../../utils/master-data/master-data-state.service";
import { getCityDataListByCountryId } from "../../../utils/master-data/master-data-city.service";

const AddEditAddressBookModal = (props: any) => {
  // console.log('Modal props==>>>', props);

  const [loggedInUserData, setLoggedInUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_err, setErr] = useState("");
  const [countryList, setCountryList] = useState<any>([]);
  const [_stateList, setStateList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const [patchValueData, setPatchValueData] = useState<any>(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ mode: "onTouched" });

  useEffect(() => {
    // console.log('On Modal', props.openModal);
    setShowModal(props.openModal.show);

    setLoggedInUserData(UserDataStorageService.getUserData()?.user);

    async function addEditAddressBookData() {
      try {
        const countryRes = await getCountryDetails();
        if (countryRes?.success) {
          setCountryList(countryRes?.results);
          // updatedProfile.countryList = [...countryRes?.results];
        }
      } catch (err: any) {
        console.error(err);
        setErr(`Error while fetching country list ${err}`);
      }

      if (props.openModal.type === 'edit') {
        // console.log('Edit Works-----------', props.openModal.data);
        if(props.openModal.data?.country) {
          try {
            const cityRes = await getCityDataListByCountryId(props.openModal.data?.country);
            if (cityRes?.success) {
                setCityList(cityRes?.results);
            }
        } catch (err: any) {
            setErr(`Error while fetching city list ${err}`);
        } 
        }
        setPatchValueData(props.openModal.data);
      }
    }
    addEditAddressBookData();
  }, [props.openModal.show]);
  // console.log('userDataAfterLoggedIn==>>>>', loggedInUserData);

  useEffect(() => {
    if (patchValueData) {
      patchFieldValue(patchValueData);
    }
  }, [patchValueData, setValue]);

  const handleClose = () => {
    setShowModal(false);
    props.onClose();
  };
  const handleSave = (savedData: any) => {
    const data = {
      address: savedData?.address,
      altMobile: savedData?.altMobile,
      city: savedData?.city,
      country: savedData?.country,
      mobile: savedData?.mobile,
      name: savedData?.name,
      success: savedData?.success,
      snackbarMsg: savedData?.snackbarMsg
    }
    props.onSave(data);
  }

  const handleCountryIdChange = async (event: any) => {
    // console.log("handleCountryIdChange", event?.target?.value);
    try {
      const stateRes = await getStateDataListByCountryId(event?.target?.value);
      if (stateRes?.success) {
        setStateList(stateRes?.results);
      }
    } catch (err: any) {
      setErr(`Error while fetching state list ${err}`);
    }

    try {
      const cityRes = await getCityDataListByCountryId(event?.target?.value);
      if (cityRes?.success) {
        setCityList(cityRes?.results);
      }
    } catch (err: any) {
      setErr(`Error while fetching city list ${err}`);
    }
  };

  async function patchFieldValue(parsedData: any) {
    // console.log("parsedData patchFieldValue===>>>", parsedData);
    if (parsedData?._id) {
      // console.log('Entering-----------------------');
      setValue('name', parsedData?.name);
      setValue('address', parsedData?.address);
      setValue('altMobile', parsedData?.altMobile);
      setValue('mobile', parsedData?.mobile);
      setValue('altMobile', parsedData?.altMobile);
      (parsedData?.country !== "")
        ? setValue("country", parsedData?.country)
        : setValue("country", "");
      (parsedData?.city !== "")
        ? setValue("city", parsedData?.city)
        : setValue("city", "");
    }
  }

  const onSubmit = async (data: any) => {
    // console.log("Request Data PayLoad===>>>", data);
    if(props.openModal.type === 'edit') {
      // console.log('Edit Works-----------', data);

      if (data) {
        // console.log('User Id==>>>', loggedInUserData?.id);
        // console.log('Modal User Id==>>>', props.openModal.data?._id);

        try {
          setLoading(true);
          const res = await clientPatchApiService(`${server}/user-auth/address/${loggedInUserData?.id}/${props.openModal.data?._id}`, {
            ...data,
          });
  
          setTimeout(() => setLoading(false), 1500);
          // console.log("API Response==>>>", res);
          if (!res?.success) {
            // console.log("Error While submitting---", res);
            data.success = false;
            data.snackbarMsg = `API call failed !!, Error: ${res}`;
            handleSave(data);
            return {
              hasError: true,
              message: `Error for Updating Address Book Response: ${res}`,
            };
          } else {
            reset();
            handleClose();
            data.success = true;
            data.snackbarMsg = `Address updated sucessfully in Address Book.`;
            handleSave(data);
          }
          return { hasError: true, message: "Error In Try Block !!" };
        } catch (err: any) {
          console.error(err);
          handleClose();
          data.success = false;
          data.snackbarMsg = `API call error !!, Error: ${err}`;
          handleSave(data);
          return {
            hasError: true,
            message: `Error ${err}`,
          };
        } finally {
          setLoading(false);
        }
      }
    } else {
      // console.log('Add Works-----------', data);

      if (data) {
        // console.log('User Id==>>>', loggedInUserData?.id);
  
        try {
          setLoading(true);
          const res = await clientPostApiService(`${server}/user-auth/address/${loggedInUserData?.id}`, {
            ...data,
          });
  
          setTimeout(() => setLoading(false), 1500);
          // console.log("API Response==>>>", res);
          if (!res?.success) {
            // console.log("Error While submitting---", res);
            // snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
            data.success = false;
            data.snackbarMsg = `API call failed !!, Error: ${res}`;
            handleSave(data);
            return {
              hasError: true,
              message: `Error for Adding Address Book Response: ${res}`,
            };
          } else {
            reset();
            // snackbarRef.current?.showSnackBar("New Address added sucessfully in Address Book.");
            handleClose();
            data.success = true;
            data.snackbarMsg = `New Address added sucessfully in Address Book.`;
            handleSave(data);
          }
          return { hasError: true, message: "Error In Try Block !!" };
        } catch (err: any) {
          console.error(err);
          // snackbarRef.current?.showSnackBar(`API call error !!, Error: ${err}`);
          handleClose();
          data.success = false;
          data.snackbarMsg = `API call error !!, Error: ${err}`;
          handleSave(data);
          return {
            hasError: true,
            message: `Error ${err}`,
          };
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            {(props.openModal.type === 'edit') ? 'Update Address Detail' : 'Add Address Detail'}
          </Modal.Title>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body className="px-0 mx-0">
          <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-between">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0">
              <div className="d-flex flex-wrap align-items-center justify-content-start">
                <Card className="w-100 d-flex flex-wrap flex-row">
                  <Card.Body className="py-2 w-auto">
                    <div className="form-page">
                      <div className="container-fluid p-0">
                        <div className="form-block w-100">
                          <form className="form"
                            onSubmit={handleSubmit(onSubmit)}
                          >
                            <div className="form-row w-100">
                              <div className="form-group col-md-6">
                                <label className="col-form-label col-form-label-md font-weight-bold">
                                  User Full Name
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  {...register("name", {
                                    required: true,
                                  })}
                                />

                                {errors.name &&
                                  errors.name.type === "required" && (
                                    <p
                                      className="message message--error"
                                      style={{ marginLeft: "5px" }}
                                    >
                                      User Full Name is required.
                                    </p>
                                  )}
                              </div>
                              <div className="form-group col-md-6">
                                <label className="col-form-label col-form-label-md font-weight-bold">
                                  Address
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  {...register("address", {
                                    required: true,
                                  })}
                                />

                                {errors.address &&
                                  errors.address.type === "required" && (
                                    <p
                                      className="message message--error"
                                      style={{ marginLeft: "5px" }}
                                    >
                                      Address is required.
                                    </p>
                                  )}
                              </div>

                              <div className="form-group col-md-6">
                                <label className="col-form-label col-form-label-md font-weight-bold">
                                  Country
                                </label>
                                <select
                                  className="form-control"
                                  {...register("country", {
                                    required: true,
                                    onChange: handleCountryIdChange,
                                  })}
                                >
                                  <option value="">Select Country</option>
                                  {countryList?.map((item: any) => (
                                    <option
                                      key={item?._id}
                                      value={item?._id}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
                                </select>

                                {errors.country &&
                                  errors.country.type === "required" && (
                                    <p
                                      className="message message--error"
                                      style={{ marginLeft: "5px" }}
                                    >
                                      Country is required.
                                    </p>
                                  )}
                              </div>
                              <div className="form-group col-md-6">
                                <label className="col-form-label col-form-label-md font-weight-bold">
                                  Mobile No.
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  {...register("mobile", {
                                    required: true,
                                  })}
                                />

                                {errors.mobileNo &&
                                  errors.mobileNo.type === "required" && (
                                    <p
                                      className="message message--error"
                                      style={{ marginLeft: "5px" }}
                                    >
                                      Mobile No. is required.
                                    </p>
                                  )}
                              </div>

                              <div className="form-group col-md-6">
                                <label className="col-form-label col-form-label-md font-weight-bold">
                                  City/Area
                                </label>
                                <select
                                  className="form-control"
                                  {...register("city", {
                                    required: true,
                                  })}
                                >
                                  <option value="">Select City/Area</option>
                                  {cityList?.map((item: any) => (
                                    <option
                                      key={item?._id}
                                      value={item?._id}
                                    >
                                      {item.name}
                                    </option>
                                  ))}
                                </select>

                                {errors.city &&
                                  errors.city.type === "required" && (
                                    <p
                                      className="message message--error"
                                      style={{ marginLeft: "5px" }}
                                    >
                                      City/Area is required.
                                    </p>
                                  )}
                              </div>
                              <div className="form-group col-md-6">
                                <label className="col-form-label col-form-label-md font-weight-bold">
                                  Alternate Phone
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  {...register("altMobile", {
                                    required: false,
                                  })}
                                />
                              </div>
                            </div>

                            <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center p-0 m-0 py-4 my-4">
                              <button
                                type="submit"
                                className={
                                  loading
                                    ? "btn btn-primary btn-large px-5"
                                    : "btn btn-secondary btn-large px-5"
                                }
                                disabled={loading}
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
                          </form>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { AddEditAddressBookModal }