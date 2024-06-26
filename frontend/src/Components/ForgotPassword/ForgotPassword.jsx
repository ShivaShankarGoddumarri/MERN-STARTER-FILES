import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom/dist";
import "../Login/Login.css";
const ResetPassword = () => {
  const [inputs, setInputs] = useState({
    email: null,
    otp: null,
    newPassword: null,
    confirmPassword: null,
    isEmailValid: null,
    isPasswordValid: null,
  });

  const {
    email,
    newPassword,
    confirmPassword,
    otp,
    isEmailValid,
    isPasswordValid,
  } = inputs;
  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(
          e.target.value
        ),
      }));
    }
    if (e.target.name === "newPassword") {
      setInputs((prev) => ({
        ...prev,
        isPasswordValid:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(
            e.target.value
          ),
      }));
    }
  };

  const [loginType, setLoginType] = useState("email");
  const [otpVisible, setOtpVisible] = useState(false);
  const [emailVerified, setemailVerified] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    e.target.disabled = true;
    const obj = {
      email: email,
      type: loginType,
      password: newPassword,
    };
    await ApiServices.resetPassword(obj)
      .then(async (res) => {
        dispatch(
          setToast({
            message: "Password changed Successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        navigate("/login");
        setLoading(false);
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Error occured !",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  const handleGetOtp = async (e) => {
    e.target.disabled = true;
    setSendEmailOtpLoading(true);
    if (loginType === "email") {
      await ApiServices.sendOtp({
        to: email,
        type: "Forgot Password",
        subject: "Email Verification",
      })
        .then((res) => {
          dispatch(
            setToast({
              message: "OTP sent successfully !",
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
          setOtpVisible(true);
          setSendEmailOtpLoading(false);
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "OTP sent successfully !",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
      setTimeout(() => {
        dispatch(
          setToast({
            message: "",
            bgColor: "",
            visible: "no",
          })
        );
      }, 4000);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setVerifyEmailOtpLoading(true);
    await ApiServices.verifyOtp({
      email: email,
      otp: otp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: `${
              loginType.split("")[0].toUpperCase() + loginType.slice(1)
            } verified successfully !`,
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );

        if (loginType == "email") {
          document.getElementById("emailVerify").style.display = "none";
          setemailVerified(true);
        }
        setVerifyEmailOtpLoading(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setToast({
            message: "OTP Entered Wrong",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };

  const [loading, setLoading] = useState(false);
  const [sendEmailOtpLoading, setSendEmailOtpLoading] = useState(false);
  const [verifyEmailOtpLoading, setVerifyEmailOtpLoading] = useState(false);

  return (
    <main className="login-main-container">
      <div className="login-hero">
        <div className="login-form-section">
          <div class="login-page">
            <div class="login-header">
              <p>Reset Password</p>
            </div>
            <div class="login-container">
              <div class="tab-wrap"></div>
              <form action="">
                <>
                  <input
                    type="text"
                    name="email"
                    className={
                      isEmailValid !== null &&
                      (isEmailValid ? "valid" : "invalid")
                    }
                    value={email}
                    placeholder="Email Address"
                    disabled={emailVerified}
                    onChange={handleChanges}
                  />
                  {isEmailValid && !otpVisible && (
                    <button
                      style={{ background: "var(--primary)" }}
                      type="button"
                      className="full-width-button"
                      onClick={handleGetOtp}
                    >
                      {sendEmailOtpLoading ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <div className="button-loader"></div>
                          <div>
                            <span style={{ marginLeft: "10px" }}>
                              Sending OTP...
                            </span>
                          </div>
                        </div>
                      ) : (
                        "Request OTP"
                      )}
                    </button>
                  )}
                  {otpVisible && emailVerified !== true && (
                    <>
                      <input
                        type="text"
                        name="otp"
                        value={otp}
                        placeholder="Enter OTP"
                        onChange={handleChanges}
                      />
                      {otp !== null && otp?.length === 6 && (
                        <button
                          style={{ background: "var(--primary)" }}
                          type="button"
                          className="full-width-button"
                          id="emailVerify"
                          onClick={verifyOtp}
                        >
                          {verifyEmailOtpLoading ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              <div className="button-loader"></div>
                              <span style={{ marginLeft: "10px" }}>
                                Verifying OTP...
                              </span>
                            </div>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                      )}
                    </>
                  )}
                </>

                {emailVerified && (
                  <>
                    <input
                      name="newPassword"
                      type="password"
                      className={
                        isPasswordValid !== null &&
                        (isPasswordValid ? "valid" : "invalid")
                      }
                      value={newPassword}
                      placeholder="New Password"
                      onChange={handleChanges}
                    />
                    {/* {isPasswordValid && ( */}
                    <input
                      name="confirmPassword"
                      type="password"
                      className={
                        confirmPassword &&
                        (confirmPassword === newPassword ? "valid" : "invalid")
                      }
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onChange={handleChanges}
                    />
                    {/* )} */}
                    <div className="passwordHint">
                      <ul>
                        <li
                          className={
                            newPassword?.length >= 8 ? "success" : "failure"
                          }
                        >
                          Password should be atleast 8 character length
                        </li>
                        <li
                          className={
                            /.*[A-Z].*/.test(newPassword)
                              ? "success"
                              : "failure"
                          }
                        >
                          Atleast one capital letter
                        </li>
                        <li
                          className={
                            /.*[a-z].*/.test(newPassword) && newPassword
                              ? "success"
                              : "failure"
                          }
                        >
                          Atleast one small letter
                        </li>
                        <li
                          className={
                            /.*[!@#$%^&*()_+].*/.test(newPassword)
                              ? "success"
                              : "failure"
                          }
                        >
                          Atleast one special character (!@#$%^&*()_+)
                        </li>
                        <li
                          className={
                            /.*[0-9].*/.test(newPassword)
                              ? "success"
                              : "failure"
                          }
                        >
                          Atleast one Number
                        </li>
                      </ul>
                    </div>
                  </>
                )}

                <button
                  style={{ background: "var(--primary)" }}
                  className="full-width-button"
                  type="submit"
                  disabled={
                    newPassword === "" ||
                    newPassword == null ||
                    confirmPassword == null ||
                    newPassword !== confirmPassword ||
                    !isPasswordValid
                  }
                  onClick={handleResetPassword}
                >
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        alignItems: 'center',
                        gap: "3px",
                      }}
                    >
                      <div className="button-loader"></div>
                      <div>
                        <span style={{ marginLeft: "10px" }}>
                          Resetting Password...
                        </span>
                      </div>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
            <div class="login-header">
              <div>
                <hr />
                <p>OR</p>
                <hr />
              </div>
            </div>
            <p className="login-option-text">
              All Set? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
      <div className="signup-left-container">
        <div className="signup-image-container">
          <img src="ForgetPassword.svg" alt="error" />
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
