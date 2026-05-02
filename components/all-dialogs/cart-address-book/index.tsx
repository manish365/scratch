import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const CartAddressBookModal = (props: any) => {
  // console.log('CartAddressBookModal props==>>>', props);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // console.log('On Modal', props.openModal);
    setShowModal(props.openModal.show);
  }, [props.openModal.show]);

  const handleClose = () => {
    setShowModal(false);
    props.onClose();
  };
  const handleOpenAddAddressModal = () => {
    props.openAddAddressModal("add"); // Open AnotherModal and close ChildModal
    props.onClose();
  };
  const handleShippingData = (data: any) => {
    const savedData: any = { ...data };
    // console.log('handleShippingData===>>>', savedData);
    props.onSave(savedData);
    props.onClose();
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Product chosen is for delivery in Indonesia</Modal.Title>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body className="px-0 mx-0">
          <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-between">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0">
              <div className="d-flex flex-wrap align-items-center justify-content-start">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 my-2">
                  <div className="row" style={{ margin: "0px 0px 20px" }}>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                      <div className="address-box0">
                        <a
                          type="button"
                          data-toggle="modal"
                          onClick={handleOpenAddAddressModal}
                        >
                          +
                        </a>
                        <span>Add Address</span>
                      </div>
                    </div>
                    {props.openModal?.data.length > 0 && (
                      <>
                        {props.openModal?.data.map((item: any) => (
                          <div
                            className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12"
                            key={item?._id}
                          >
                            <div className="address-box">
                              <div className="d-flex-flex-wrap d-flex-row align-items-center justify-content-start">
                                <h5
                                  className="px-1 m-0 font-weight-bold"
                                  style={{ fontSize: "14px" }}
                                >
                                  {item?.name}
                                </h5>
                                <p
                                  className="px-1 m-0"
                                  style={{ fontSize: "12px" }}
                                >
                                  {item?.address}
                                </p>
                                <p
                                  className="px-1 m-0"
                                  style={{ fontSize: "12px" }}
                                >
                                  {item?.cityName}
                                </p>
                                <p
                                  className="px-1 m-0"
                                  style={{ fontSize: "12px" }}
                                >
                                  {item?.countryName}
                                </p>
                                <p
                                  className="px-1 m-0"
                                  style={{ fontSize: "12px" }}
                                >
                                  Mobile No.: <span>{item?.mobile}</span>
                                </p>
                                <p className="p-1 m-0">
                                  <a
                                    type="button"
                                    className="mx-1 btn btn-small btn-warning"
                                    onClick={() => handleShippingData(item)}
                                  >
                                    <span
                                      className="font-weight-bold"
                                      style={{ fontSize: "12px" }}
                                    >
                                      Deliver to this address
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
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { CartAddressBookModal };
