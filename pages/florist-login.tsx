import React, { useState } from 'react'
import Layout from "../layouts/Main";
import Breadcrumb from "@components/breadcrumb";
import { Loader } from '@components/shared';
import { CiLogin } from "react-icons/ci";
import { clientPostApiService } from '@utils/client-api.service';
import { server } from '@utils/server';
import { VscSave } from "react-icons/vsc";

function FloristLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [vendor, setVendor] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [orderCode, setOrderCode] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [receivedBy, setReceivedBy] = useState<string>("");

  const fetchVendor = async () => {
    setError("");
    if (!email) {
      setError("Please enter a valid email first");
      return;
    }
    if (!password) {
      setError("Invalid credentials");
      return;
    }

    try {
      setLoading(true);
      const response = await clientPostApiService(
        `${server}/user-auth/vendor`,
        {
          email,
          password,
        }
      );
      if (response?.success) {
        setVendor(response.results);
        setLoading(false);
        setOrderCode('');
      } else {
        setLoading(false);
        setError("Sorry. We are unable to fetch vendor details currently");
      }
    } catch (error) {
      setLoading(false);
      setError("Sorry! Server error, please try again later");
    }
  }

  const updateOrderData = async () => {
    setError('');
    setSuccess('');
    if (!orderCode) {
      setError("Please enter order id first");
      return;
    }
    if (!orderStatus) {
      setError("Please enter a order status");
      return;
    }

    try {
      setLoading(true);
      const response = await clientPostApiService(
        `${server}/user-auth/update-order-status`,
        {
          email,
          code: orderCode,
          status: orderStatus,
          receivedBy,
        }
      );
      if (response?.success) {
        setSuccess('Successfully updated status');
        setVendor(null);
        setOrderStatus('');
        setReceivedBy('');
        setLoading(false);
      } else {
        setLoading(false);
        setOrderCode("");
        setError("Sorry. We are unable to update order status");
      }
    } catch (error) {
      setLoading(false);
      setError("Sorry! Server error, please try again later");
    }
  };

  return (
    <Layout title="Florist login | FlowersChamp">
      <Breadcrumb pName={"Florist Login"} mainPath="Home" />
      {loading && (
        <div className="w-full flex justify-center">
          <Loader showLabel={true} height="h-auto" />
        </div>
      )}
      <div className="container">
        {error && (
          <span className="flex items-center w-full bg-red-300 text-error mb-4 px-4 py-2 gap-2">
            <strong>Error!</strong>
            {error}
          </span>
        )}
        {success && (
          <span className="flex items-center w-full bg-green-300 text-green-700 mb-4 px-4 py-2 gap-2">
            <strong>Success!</strong>
            {success}
          </span>
        )}
        <div className="row items-center justify-center">
          <div className="col-md-10 col-sm-12 p-4">
            <div className="row">
              <div className="col-6 col-xs-12">
                <img
                  src="/images/florist-login.webp"
                  alt="Florist Login"
                  height={"306px"}
                  width={"426px"}
                />
              </div>
              <div className="col-6 col-xs-12 shadow pt-4">
                {!vendor && (
                  <div className="w-full flex flex-col">
                    <h2>Florist Login</h2>
                    <div className="form-group">
                      <label>Email Id:</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Email address"
                        autoComplete="off"
                        className="form-control"
                        value={email}
                        onChange={($e) => setEmail($e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Password:</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        autoComplete="off"
                        className="form-control"
                        value={password}
                        onChange={($e) => setPassword($e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-outline-dark flex items-center gap-2 justify-center text-lg"
                      onClick={fetchVendor}
                      disabled={loading}
                    >
                      {loading && (
                        <Loader
                          showLabel={false}
                          width="w-auto"
                          height="h-auto"
                        />
                      )}
                      {!loading && <CiLogin fontSize={18} width="w-auto" />}
                      Login
                    </button>
                  </div>
                )}
                {vendor && (
                  <div className="w-full flex flex-col mb-4">
                    <h2>
                      <span className="text-upper text-2xl text-blue-600">
                        {vendor?.company?.name}
                      </span>
                    </h2>
                    <h4 className="text-lg text-blue-600">
                      [{vendor?.email?.address}]
                    </h4>
                    <div className="form-group mt-4">
                      <label>Enter Order Code:</label>
                      <input
                        type="text"
                        name="code"
                        placeholder="ex: FCIDXXXXX"
                        autoComplete="off"
                        className="form-control"
                        value={orderCode}
                        onChange={($e) => setOrderCode($e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Order Status:</label>
                      <select
                        name="status"
                        autoComplete="off"
                        className="form-control appear-auto"
                        value={orderStatus}
                        onChange={($e) => setOrderStatus($e.target.value)}
                      >
                        <option value="">Select a status</option>
                        <option value="PENDING">Pending</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Received By:</label>
                      <input
                        type="text"
                        name="receivedBy"
                        placeholder="Person name whom received the order"
                        autoComplete="off"
                        className="form-control"
                        value={receivedBy}
                        onChange={($e) => setReceivedBy($e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-outline-dark flex items-center gap-2 justify-center text-lg"
                      onClick={updateOrderData}
                      disabled={loading}
                    >
                      {loading && (
                        <Loader
                          showLabel={false}
                          width="w-auto"
                          height="h-auto"
                        />
                      )}
                      {!loading && <VscSave fontSize={18} width="w-auto" />}
                      Update Order Status
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FloristLogin
