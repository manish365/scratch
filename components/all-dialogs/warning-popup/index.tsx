import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { UserDataStorageService } from '../../../utils/services';
import { server } from "../../../utils/server";
import { clientDeleteApiService } from "../../../utils/client-api.service";


const WarningPopupModal = (props: any) => {
    // console.log('Modal props==>>>', props);

    const [loggedInUserData, setLoggedInUserData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // console.log('On Modal', props.openModal);
        setShowModal(props.openModal.show);
    
        setLoggedInUserData(UserDataStorageService.getUserData()?.user);
    }, [props.openModal.show]);

    const handleClose = () => {
        setShowModal(false);
        props.onClose();
    };
    const handleSave = (savedData: any) => {
        const data = {
          success: savedData?.success,
          snackbarMsg: savedData?.snackbarMsg
        }
        props.onSave(data);
    };

    const handleDelete = async() => {
        const data: any = {};
        // console.log('handleDelete');
        
        try {
            setLoading(true);
            const res = await clientDeleteApiService(`${server}/user-auth/address/${loggedInUserData?.id}/${props.openModal.data?._id}`, {
              });
      
              setTimeout(() => setLoading(false), 1500);
            //   console.log("API Response==>>>", res);
              if (!res?.success) {
                // console.log("Error While submitting---", res);
                data.success = false;
                data.snackbarMsg = `API call failed !!, Error: ${res}`;
                handleSave(data);
                return {
                  hasError: true,
                  message: `Error for Deleting Address Book Response: ${res}`,
                };
              } else {
                handleClose();
                data.success = true;
                data.snackbarMsg = `Address deleted sucessfully from Address Book.`;
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
                        Confirm the action
                    </Modal.Title>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body className="px-0 mx-0">
                    <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 align-items-center justify-content-between">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0">
                            <div className="d-flex flex-wrap align-items-center justify-content-start">
                                <div className="container-fluid p-0">

                                    <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-center p-1 m-1 py-2 my-1">
                                        <h5 className="font-weight-bold">
                                           <p className="text-align-center">{props.openModal.msg}</p>
                                        </h5>
                                    </div>

                                    <div className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 align-items-center justify-content-around p-0 m-0 py-2 my-1">
                                        <button type="button" className="btn btn-secondary btn-large px-5" onClick={handleClose}>
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                loading
                                                    ? "btn btn-primary btn-large px-5"
                                                    : "btn btn-danger btn-large px-5"
                                            }
                                            disabled={loading}
                                            onClick={handleDelete}
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
                                                "Delete"
                                            )}
                                        </button>
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

export { WarningPopupModal }

