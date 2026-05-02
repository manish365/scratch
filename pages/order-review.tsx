import React, { useEffect, useState } from "react";
import Layout from "../layouts/Main";
import Breadcrumb from "@components/breadcrumb";
import {
  clientGetApiService,
  clientPostApiService,
} from "@utils/client-api.service";
import { server } from "@utils/server";
import { Loader } from "@components/shared";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import { RxDot } from "react-icons/rx";
import SnackBarAlert from "components/snackbar-alert";

const OrderReview = ({
  snackbarRef,
}: {
  snackbarRef: React.RefObject<SnackBarAlert | null>;
}) => {
  const router = useRouter();
  const { code }: any = router.query;
  const { profile } = useSelector((state: RootState) => state.user);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    mode: "onTouched",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [order, setOrder] = useState<any>(null);
  const [orderNo, setOrderNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errorRating, setErrorRating] = useState<boolean>(false);

  useEffect(() => {
    if (code) {
      setOrderNo(code?.toString());
    }
    if (profile?.email?.address) {
      setEmail(profile?.email?.address);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        await getOrderDetails(profile?.email?.address, code);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Sorry! We are unable to fetch order details");
      }
    };

    fetchData();
  }, [profile?.email?.address, code, email, orderNo]);

  const getOrderDetails = async (email: string = "", orderId: string = "") => {
    if (!email) {
      // setError("Please enter a valid email first");
      // return;
    }
    if (!orderId?.trim()) {
      setError("Please enter a valid order code");
      return;
    }
    try {
      setLoading(true);
      const url = `${server}/user-auth/review-order/${orderId}`;
      const response = await clientGetApiService(url, {});

      if (response?.success) {
        setOrder(response.order);
        setLoading(false);
        setError("");
      } else {
        setLoading(false);
        setError("Sorry! We are unable to fetch order details");
      }
    } catch (error) {
      setLoading(false);
      setError("Sorry! We are unable to fetch order details");
    }
  };

  const handleRatingChange = (newRating: number) => {
    console.log(newRating);
    setRating(newRating);
    setErrorRating(false);
  };
  const handleRatingReset = () => {
    setRating(0);
    setErrorRating(false);
  };
  const onSubmit = async (data: any) => {
    if (rating === 0) {
      setErrorRating(true);
      return;
    }

    const dataPayLoad = {
      rating: rating,
      title: data?.heading,
      review: data?.review,
      name: profile?.profile?.name || order?.billingInfo?.name,
      status: "INACTIVE",
      email: email || order?.billingInfo?.email,
      orderId: orderNo,
      product: {
        _id: order?.products[0]?._id,
        name: order?.products[0]?.name,
      },
      phone:
        profile?.profile?.mobile?.number || order?.billingInfo?.mobile?.number,
      website: {
        _id: order?.website,
        name: "Flowers Champ",
      },
    };

    try {
      setLoading(true);
      const res = await clientPostApiService(`${server}/review`, {
        ...dataPayLoad,
      });

      setTimeout(() => setLoading(false), 1500);
      if (!res?.success) {
        snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
        return {
          hasError: true,
          message: `Error for Submit User Review Response: ${res}`,
        };
      } else {
        reset();
        snackbarRef.current?.showSnackBar("User Review Submitted Sucessfully.");
        router.push("/profile/order-history");
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
    <Layout title="Order Review | FlowersChamp">
      <Breadcrumb pName={"Feedback"} mainPath="Home" />
      {loading && <Loader showLabel={false} />}
      <div className="container">
        {error && (
          <span className="flex items-center w-full bg-red-300 text-error mb-4 px-4 py-2 gap-2">
            <strong>Error!</strong>
            {error}
          </span>
        )}
        <div className="row items-center justify-center">
          <div className="col-md-10 col-sm-12 user_center">
            <div className="rwe-bx">
              <h3 className="feedback-title">
                Give us your Feedback {orderNo}
              </h3>
              <form
                className="form text-left"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="form-row w-100 px-2">
                  <div className="col-md-6 col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label col-form-label-md label-rws2">
                        Your Rating:
                      </label>
                      <label className="col-form-label col-form-label-md ml-2">
                        <div
                          className="rating-container custom-stars-container"
                          style={{
                            top: errorRating && rating === 0 ? "30px" : "-3px",
                          }}
                        >
                          <RxDot
                            onClick={handleRatingReset}
                            style={{
                              position: "relative",
                              fontSize: "25px",
                              top: "2px",
                            }}
                          />
                          <Rating
                            onClick={handleRatingChange}
                            initialValue={rating}
                            iconsCount={5}
                            size={25}
                            transition
                            allowFraction={true}
                            allowHover={true}
                          />
                        </div>
                        {errorRating && rating === 0 && (
                          <p
                            className="message message--error"
                            style={{
                              position: "relative",
                              top: "24px",
                              marginLeft: "5px",
                            }}
                          >
                            The Rating field is required.
                          </p>
                        )}
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label col-form-label-md label-rws2">
                        Full Name:
                      </label>
                      <label className="col-form-label col-form-label-md ml-2">
                        {profile?.profile?.name || order?.billingInfo?.name}
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label col-form-label-md label-rws2">
                        Email:
                      </label>
                      <label className="col-form-label col-form-label-md ml-2">
                        {email || order?.billingInfo?.email}
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label col-form-label-md label-rws2">
                        Mobile Number:
                      </label>
                      <label className="col-form-label col-form-label-md ml-2">
                        {profile?.profile?.mobile?.number ||
                          order?.billingInfo?.mobile?.number}
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label col-form-label-md label-rws2">
                        Heading:
                      </label>
                      <label className="rew-wd">
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          placeholder="Heading"
                          {...register("heading", {
                            required: true,
                          })}
                        />

                        {errors.heading &&
                          errors.heading.type === "required" && (
                            <p
                              className="message message--error"
                              style={{ marginLeft: "5px" }}
                            >
                              This field is required.
                            </p>
                          )}
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="col-form-label col-form-label-md label-rws2">
                        Review:
                      </label>
                      <label className="rew-wd">
                        <textarea
                          id="review"
                          rows={4}
                          className="form-control"
                          placeholder="Write a Review"
                          {...register("review", {
                            required: true,
                          })}
                        ></textarea>

                        {errors.review && errors.review.type === "required" && (
                          <p
                            className="message message--error"
                            style={{ marginLeft: "5px" }}
                          >
                            This field is required.
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6">
                    <img
                      src="https://www.probunga.com/assets/template/templateprobunga/image/review1.jpg"
                      style={{ width: "100%" }}
                      alt="order-review-img"
                    />
                    <p
                      className="rew-p"
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        marginBottom: "-5px",
                        marginTop: "26px",
                      }}
                    >
                      Thank you for shopping with us FlowersChamp.
                    </p>
                    <p className="rew-p">
                      We strive the best service. To help us continue our high
                      quality of service. we would like your valuable
                      feedback/suggestion in order to help us serve you better.{" "}
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 items-center justify-center p-0 m-0 py-3">
                  <button
                    type="submit"
                    className={
                      loading
                        ? "btn btn-success btn-large px-5 py-1"
                        : "btn btn-secondary btn-large px-5 py-1 text-light"
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
                      "SUBMIT REVIEW"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderReview;
