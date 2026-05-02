import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Layout from "../../layouts/Dashboard";
import { getCountryNameById } from "../../utils/master-data/master-data-country.service";
import { getStateNameById } from "../../utils/master-data/master-data-state.service";
import { getCityNameById } from "../../utils/master-data/master-data-city.service";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "store/reducers/user";
import { RootState } from "store";
import SnackBarAlert from "components/snackbar-alert";

interface PropTypes {
  snackbarRef: React.RefObject<SnackBarAlert | null>;
}

const Profile = ({}: PropTypes) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [err, setErr] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);

  const getProfileDetails = async () => {
    if (profile) {
      console.log("============= from store >>>>>", profile);
      try {
        // update your Data here
        //const updatedProfile = { ...profile }; // Created a shallow copy of the response object
        const updatedProfile = JSON.parse(JSON.stringify(profile)); // Create a deep copy of the profile object
        // console.log('updatedProfile==>>>', updatedProfile);

        // Get Country Name By Id
        const countryNameResults = await getCountryNameById(
          updatedProfile?.profile?.country
        );
        console.log("getCountryNameById==>>>", countryNameResults);
        // Delete the countryName property
        delete updatedProfile?.profile?.countryName;
        countryNameResults.forEach((element: any) => {
          console.log("country element==>>>", element);
          if (element?._id) {
            updatedProfile.profile.countryName = element?.name;
            console.log(
              "updatedProfile.profile.countryName====>>>>",
              updatedProfile.profile.countryName
            );
          }
        });

        // Get State Name By Id
        const stateNameResults = await getStateNameById(
          updatedProfile?.profile?.country,
          updatedProfile?.profile?.state
        );
        console.log("getStateNameById==>>>", stateNameResults);
        // Delete the stateName property
        delete updatedProfile?.profile?.stateName;
        stateNameResults?.forEach((element: any) => {
          console.log("country element==>>>", element);
          if (element?._id) {
            updatedProfile.profile.stateName = element?.name;
            console.log(
              "updatedProfile.profile.stateName====>>>>",
              updatedProfile.profile.stateName
            );
          }
        });

        // Get City Name By Id
        const cityNameResults = await getCityNameById(
          updatedProfile?.profile?.country,
          updatedProfile?.profile?.city
        );
        console.log("getCityNameById==>>>", cityNameResults);
        // Delete the cityName property
        delete updatedProfile?.profile?.cityName;
        cityNameResults?.forEach((element: any) => {
          console.log("city element==>>>", element);
          if (element?._id) {
            updatedProfile.profile.cityName = element?.name;
            console.log(
              "updatedProfile.profile.cityName====>>>>",
              updatedProfile.profile.cityName
            );
          }
        });

        console.log("updatedProfile==>>>", updatedProfile);
        dispatch(updateProfile(updatedProfile));
        setProfileData(updatedProfile);
        setLoading(false);
        return { hasError: true, message: "Error In Try Block !!" };
      } catch (err: any) {
        setLoading(false);
        console.error(err);
        setErr(`Error while fetching User Profile Data ${err}`);
      }
    }
  };
  useEffect(() => {
    getProfileDetails();
  }, []);
  console.log("profileData===>>>>>>", profileData);

  const handleButtonClick = () => {
    // Convert data to JSON string and then URL encode it
    // const encodedData = encodeURIComponent(JSON.stringify(profileData));
    // console.log(encodedData);
    router.push({
      pathname: "/profile/edit-user-profile",
      // query: { data: encodedData }
    });
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

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center py-1 px-2 m-0">
                    <div className="d-flex flex-wrap mx-2 py-2 m-0">
                      {err && (
                        <div className="flex px-4 py-2 mb-4 items-center w-full bg-red-300 text-error gap-2">
                          <strong className="flex items-center gap-1">
                            Error!
                          </strong>
                          {err}
                        </div>
                      )}
                      <Card className="w-100 d-flex flex-wrap flex-row">
                        {/* <div style={{ fontSize: '30px', padding: '2px 5px' }}> {React.createElement(icons[item?.icon])} </div> */}
                        <Card.Body className="py-2 w-auto">
                          <div>
                            {/* {profileData && profileData?.user?.company &&  */}
                            <p className="font-weight-bolder text-dark">
                              Company Name:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.company?.name}
                              </span>
                            </p>
                            {/* } */}
                            <p className="font-weight-bolder text-dark">
                              Full Name:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.name}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              Address:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.address}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              Email Id(User Name):{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.email?.address}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              City:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.city
                                  ? profileData?.profile?.cityName
                                  : ""}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              State/Province:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.state
                                  ? profileData?.profile?.stateName
                                  : ""}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              Country:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.country
                                  ? profileData?.profile?.countryName
                                  : ""}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              Mobile No:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.mobile?.number}
                              </span>
                            </p>
                            <p className="font-weight-bolder text-dark">
                              Alternate Contact No:{" "}
                              <span className="font-weight-normal mx-3">
                                {profileData?.profile?.contactNumber}
                              </span>
                            </p>
                          </div>

                          <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center p-0 m-0 py-3">
                            <button
                              type="button"
                              className="btn btn-primary btn-large px-5"
                              onClick={handleButtonClick}
                            >
                              Edit Details
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

Profile.auth = true;
export default Profile;
