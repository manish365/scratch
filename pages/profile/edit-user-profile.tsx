import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Layout from "../../layouts/Dashboard";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { server } from "../../utils/server";
import { clientPatchApiService } from "../../utils/client-api.service";
import { getCountryDetails } from "../../utils/master-data/master-data-country.service";
import { getStateDataListByCountryId } from "../../utils/master-data/master-data-state.service";
import { getCityDataListByCountryId } from "../../utils/master-data/master-data-city.service";
import SnackBarAlert from "components/snackbar-alert";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "store/reducers/user";
import { RootState } from "store";

const EditUserDetails = ({
  snackbarRef,
}: {
  snackbarRef: React.RefObject<SnackBarAlert | null>;
}) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [patchValueData, setPatchValueData] = useState<any>(null);
  const [countryList, setCountryList] = useState<any>([]);
  const [stateList, setStateList] = useState<any>([]);
  const [cityList, setCityList] = useState<any>([]);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    mode: "onTouched",
  });
  const router: any = useRouter();
  // const { data } = router.query;
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (profile) {
      const updateProfileData = async () => {
        const updatedProfile = { ...profile }; // Created a shallow copy of the response object

        try {
          const countryRes = await getCountryDetails();
          if (countryRes?.success) {
            setCountryList(countryRes?.results);
            updatedProfile.countryList = [...countryRes?.results];
          }
        } catch (err: any) {
          console.error(err);
          setErr(`Error while fetching country list ${err}`);
        }

        try {
          const stateRes = await getStateDataListByCountryId(
            updatedProfile?.profile?.country
          );
          if (stateRes?.success) {
            setStateList(stateRes?.results);
            updatedProfile.stateList = [...stateRes?.results];
          }
        } catch (err: any) {
          setErr(`Error while fetching state list ${err}`);
        }

        try {
          const cityRes = await getCityDataListByCountryId(
            updatedProfile?.profile?.country
          );
          if (cityRes?.success) {
            setCityList(cityRes?.results);
            updatedProfile.cityList = [...cityRes?.results];
          }
        } catch (err: any) {
          setErr(`Error while fetching state list ${err}`);
        }

        // Update form values and state
        // console.log('updatedProfile==>>>', updatedProfile);
        setPatchValueData(updatedProfile);
      };
      updateProfileData();
    }
  }, [profile]);

  useEffect(() => {
    if (patchValueData) {
      patchFieldValue(patchValueData);
    }
  }, [patchValueData, setValue]);

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

  function patchFieldValue(parsedData: any) {
    // console.log("parsedData patchFieldValue===>>>", parsedData);
    if (parsedData?._id) {
      // console.log('Entering-----------------------');
      setValue("email", parsedData?.email?.address);
      setValue("name", parsedData?.profile?.name);
      setValue("mobileNo", parsedData?.profile?.mobile?.number);
      setValue("companyName", parsedData?.company?.name);
      setValue("altEmail", parsedData?.emailAlt);
      setValue("contactNo", parsedData?.profile?.contactNumber);
      parsedData?.profile?.country !== ""
        ? setValue("country", parsedData?.profile?.country)
        : setValue("country", "");
      parsedData?.profile?.state !== ""
        ? setValue("state", parsedData?.profile?.state)
        : setValue("state", "");
      parsedData?.profile?.city !== ""
        ? setValue("city", parsedData?.profile?.city)
        : setValue("city", "");
      parsedData?.profile?.zipCode !== "000000"
        ? setValue("zip", parsedData?.profile?.zipCode)
        : setValue("zip", "");
      setValue("address", parsedData?.profile?.address);
      setValue("vatNo", parsedData?.company?.vatNumber);
    }
  }

  const onSubmit = async (data: any) => {
    console.log("Request Data PayLoad===>>>", data);
    const dataPayLoad = {
      company: {
        name: data.companyName,
        contact: "",
        address: "",
        registrationDate: "",
        vatCheck: "",
        vatNumber: data.vatNo,
      },
      emailAlt: data.altEmail,
      profile: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zip !== "" || data.zip !== "000000" ? data.zip : "000000",
        mobile: {
          number: data.mobileNo,
          prefix: "",
          verified: false,
        },
        contactNumber: data.contactNo,
      },
    };

    if (!data.city) {
      delete dataPayLoad.profile.city;
    }
    console.log("dataPayLoad==>>>>", dataPayLoad);
    if (patchValueData) {
      delete patchValueData?.cityList;
      delete patchValueData?.countryList;
      delete patchValueData?.stateList;
    }
    console.log("patchValueData===>>>>", patchValueData);
    const updateUserProfileData = {
      ...patchValueData,
      ...dataPayLoad,
    };
    console.log("updateUserProfileData===>>>", updateUserProfileData);
    dispatch(updateProfile(updateUserProfileData));

    try {
      setLoading(true);
      const res = await clientPatchApiService(`${server}/user-auth/profile`, {
        ...dataPayLoad,
      });

      setTimeout(() => setLoading(false), 1500);
      console.log("API Response==>>>", res);
      if (!res?.success) {
        console.log("Error in While submitting---", res);
        snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
        return {
          hasError: true,
          message: `Error for Update Profile Response: ${res}`,
        };
      } else {
        reset();
        snackbarRef.current?.showSnackBar("User Profile Updated Sucessfully.");
        router.push("/profile/view-user-profile");
      }
      return { hasError: true, message: "Error In Try Block !!" };
    } catch (err: any) {
      console.error(err);
      snackbarRef.current?.showSnackBar(`API call error !!, Error: ${err}`);
      return {
        hasError: true,
        message: `Error ${err}`,
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="User Profile | FlowersChamp">
      <section className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-start">
        <div className="container-fluid">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center p-0 m-0">
            <div className="d-flex flex-wrap">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center p-0 m-0">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-2 mt-3">
                  <Card className="w-auto">
                    <Card.Body className="py-1">
                      <h3>Personal Details</h3>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-1 px-2 m-0">
                  <div className="d-flex flex-wrap mx-2 py-2 m-0">
                    {err && <div>{err}</div>}
                    <Card className="w-100 d-flex flex-wrap flex-row">
                      <Card.Body className="py-2 w-auto">
                        <div className="form-page">
                          <div className="container-fluid">
                            <div className="form-block w-100 p-0 m-0">
                              <form
                                className="form"
                                onSubmit={handleSubmit(onSubmit)}
                              >
                                <div className="form-row w-100">
                                  <div className="form-group col-md-4">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Email
                                    </label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder=""
                                      readOnly
                                      {...register("email", {
                                        required: true,
                                      })}
                                    />
                                  </div>
                                  <div className="form-group col-md-4">
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
                                  <div className="form-group col-md-4">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Mobile No.
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      {...register("mobileNo", {
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

                                  <div className="form-group col-md-4">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Company Name
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      {...register("companyName", {
                                        required: false,
                                      })}
                                    />
                                  </div>
                                  <div className="form-group col-md-4">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Alternate Email Id
                                    </label>
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder=""
                                      {...register("altEmail", {
                                        required: false,
                                      })}
                                    />
                                  </div>
                                  <div className="form-group col-md-4">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Alternate Contact No.
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      {...register("contactNo", {
                                        required: false,
                                      })}
                                    />
                                  </div>

                                  <div className="form-group col-md-4">
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
                                  <div className="form-group col-md-3">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      State
                                    </label>
                                    <select
                                      className="form-control"
                                      {...register("state", {
                                        required: true,
                                      })}
                                    >
                                      <option value="">Select State</option>
                                      {stateList?.map((item: any) => (
                                        <option
                                          key={item?._id}
                                          value={item?._id}
                                        >
                                          {item.name}
                                        </option>
                                      ))}
                                    </select>

                                    {errors.state &&
                                      errors.state.type === "required" && (
                                        <p
                                          className="message message--error"
                                          style={{ marginLeft: "5px" }}
                                        >
                                          State is required.
                                        </p>
                                      )}
                                  </div>
                                  <div className="form-group col-md-3">
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
                                  <div className="form-group col-md-2">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Zip Code
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      {...register("zip", {
                                        required: false,
                                      })}
                                    />
                                  </div>

                                  <div className="form-group col-md-8">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Address
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      {...register("address", {
                                        required: false,
                                      })}
                                    />
                                  </div>
                                  <div className="form-group col-md-4">
                                    <label className="col-form-label col-form-label-md font-weight-bold">
                                      Vat Number
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder=""
                                      {...register("vatNo", {
                                        required: false,
                                      })}
                                    />
                                  </div>
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
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

EditUserDetails.auth = true;
export default EditUserDetails;
