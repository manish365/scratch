import React, { useState } from 'react';
import { Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from "../../layouts/Dashboard";
import { server } from '../../utils/server';
import { clientPatchApiService } from '../../utils/client-api.service';
import SnackBarAlert from 'components/snackbar-alert';

type ForgotPasswordPayLoad = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePassword = ({ snackbarRef }: { snackbarRef: React.RefObject<SnackBarAlert | null> }) => {
    const [loading, setLoading] = useState(false);
    const [togglePassword1, setTogglePassword1] = useState(false);
    const [togglePassword2, setTogglePassword2] = useState(false);
    const [togglePassword3, setTogglePassword3] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<any>({ mode: 'onTouched' });

    const onSubmit = async (data: ForgotPasswordPayLoad) => {
        console.log('Request Data PayLoad===>>>', data);
        try {
            setLoading(true);
            const res = await clientPatchApiService(`${server}/user-auth/update-password`, {
                oldPass: data.oldPassword,
                newPass: data.confirmPassword,
            });

            setTimeout(() => setLoading(false), 1500);
            console.log('API Response==>>>', res);
            if (!res?.success) {
                console.log('Error in While submitting---', res);
                snackbarRef.current?.showSnackBar(`API call failed !!, Error: ${res}`);
                return {
                    hasError: true,
                    message: `Error for Change Password Response: ${res}`,
                };
            } else {
                reset();
                snackbarRef.current?.showSnackBar('Password Updated Successfully.');
            }
            return { hasError: true, message: 'Error In Try Block !!' }
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
        <Layout>
            <section className="d-flex flex-wrap col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 align-items-center justify-content-center">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 align-items-center justify-content-center py-2 mt-3">
                    <Card className="w-auto">
                        <Card.Body className="py-1">
                            <h3>Change Password</h3>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 align-items-center justify-content-center py-2 mt-3">
                    <Card className="w-auto">
                        <Card.Body className="py-1">
                            <div className="form-block">
                                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form__input-row">
                                        <input
                                            className="form__input"
                                            type={togglePassword1 ? "text" : "password"}
                                            placeholder="Old Password"
                                            {...register("oldPassword", { required: true })}
                                        />
                                        <div className="d-flex flex-wrap align-items-center justify-content-start">
                                            <i id={togglePassword1 ? "passlock" : "showpass"} onClick={() => { setTogglePassword1(!togglePassword1) }}>
                                                {togglePassword1 ? <FaEye /> : <FaEyeSlash />}
                                            </i>
                                        </div>
                                        {errors.oldPassword && errors.oldPassword.type === 'required' &&
                                            <p className="message message--error">Old Password is required.</p>
                                        }
                                    </div>

                                    <div className="form__input-row">
                                        <input
                                            className="form__input"
                                            type={togglePassword2 ? "text" : "password"}
                                            placeholder="New Password"
                                            {...register("newPassword", { required: true })}
                                        />
                                        <div className="d-flex flex-wrap align-items-center justify-content-start">
                                            <i id={togglePassword2 ? "passlock" : "showpass"} onClick={() => { setTogglePassword2(!togglePassword2) }}>
                                                {togglePassword2 ? <FaEye /> : <FaEyeSlash />}
                                            </i>
                                        </div>
                                        {errors.newPassword && errors.newPassword.type === 'required' &&
                                            <p className="message message--error">New Password is required.</p>
                                        }
                                    </div>

                                    <div className="form__input-row">
                                        <input
                                            className="form__input"
                                            type={togglePassword3 ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            {...register("confirmPassword", {
                                                required: true,
                                                validate: (val: string) => {
                                                    if (watch('newPassword') != val) {
                                                        return "Your passwords do no match";
                                                    }
                                                },
                                            })}
                                        />
                                        <div className="d-flex flex-wrap align-items-center justify-content-start">
                                            <i id={togglePassword3 ? "passlock" : "showpass"} onClick={() => { setTogglePassword3(!togglePassword3) }}>
                                                {togglePassword3 ? <FaEye /> : <FaEyeSlash />}
                                            </i>
                                        </div>
                                        {errors.confirmPassword && errors.confirmPassword.type === 'required' &&
                                            <p className="message message--error">Confirm New Password is required.</p>
                                        }
                                        {errors.confirmPassword && errors.confirmPassword.message && (
                                            <p className="message message--error">{String(errors.confirmPassword.message)}</p>
                                        )}
                                    </div>

                                    <button type="submit" className={(loading) ? "btn btn--rounded btn--blue btn-submit" : "btn btn--rounded btn--yellow btn-submit"} disabled={loading}>
                                        {loading ? (
                                            <div className="spinner-border text-light font-weight-bolder" role="status">
                                                <span className="sr-only font-weight-bolder">Loading...</span>
                                            </div>
                                        ) : 'Submit'}
                                    </button>
                                </form>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </section>
        </Layout>
    )
}

ChangePassword.auth = true;
export default ChangePassword