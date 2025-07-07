import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  loginUser,
  forgotPassword,
  verifyPhone,
  resetPassword,
} from "../redux/slice/auth.slice";

import Loogin_bg from "../Image/Loogin_bg.png";
import "../Style/z_Style.css";
import Spinner from "../Spinner";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [mode, setMode] = useState("signin");
  const [otpMode, setOtpMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signinSchema = Yup.object({
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "")
      .required(""),
    password: Yup.string()
      .matches(/^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/|\\`~]*$/, "")
      .min(6, "")
      .required(""),
  });

  const forgotSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "")
      .required(""),
  });

  const otpSchema = Yup.object({
    otp0: Yup.string()
      .matches(/^[0-9]$/, "")
      .required(""),
    otp1: Yup.string()
      .matches(/^[0-9]$/, "")
      .required(""),
    otp2: Yup.string()
      .matches(/^[0-9]$/, "")
      .required(""),
    otp3: Yup.string()
      .matches(/^[0-9]$/, "")
      .required(""),
  });

  const resetSchema = Yup.object({
    newPassword: Yup.string()
      .matches(/^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/|\\`~]*$/, "")
      .min(6, "")
      .required(""),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "")
      .required(""),
  });

  const formikSignin = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signinSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
    },
  });

  const formikForgot = useFormik({
    initialValues: { phone: "" },
    validationSchema: forgotSchema,
    onSubmit: async (values) => {
      const result = await dispatch(forgotPassword(values));
      if (forgotPassword.fulfilled.match(result)) {
        setOtpMode(true);
        toast.success("OTP sent!");
      }
    },
  });

  const formikOtp = useFormik({
    initialValues: { otp0: "", otp1: "", otp2: "", otp3: "" },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      const otp = Object.values(values).join("");
      const result = await dispatch(
        verifyPhone({ phone: formikForgot.values.phone, otp })
      );
      if (verifyPhone.fulfilled.match(result)) {
        setResetMode(true);
        toast.success("Phone verified!");
      }
    },
  });

  const formikReset = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      const result = await dispatch(
        resetPassword({
          phone: formikForgot.values.phone,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        })
      );
      if (resetPassword.fulfilled.match(result)) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          setMode("signin");
          setOtpMode(false);
          setResetMode(false);
          formikSignin.resetForm();
          formikForgot.resetForm();
          formikOtp.resetForm();
          formikReset.resetForm();
        }, 2000);
      }
    },
  });

  const handleForgotClick = (e) => {
    e.preventDefault();
    setMode("forgot");
    setOtpMode(false);
    setResetMode(false);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    setMode("signin");
    setOtpMode(false);
    setResetMode(false);
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      formikOtp.setFieldValue(`otp${index}`, value);
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1500);
    }

    if (error) {
      toast.error(error);
    }
  }, [isAuthenticated, error]);

  return (
    <section>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className="Z_Register_Page"
        style={{
          backgroundImage: `url(${Loogin_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="Z_Register_Right">
          <div className="Z_Right_Form_Container">
            <div className="Z_content_cent d-flex justify-content-center">
              <div className="Z_Logo_Container">
                <h2>ROSEMARY'S</h2>
                <p>Backstage Access</p>
              </div>
            </div>
            <p className="Z_Promo_Text text-center">
              Become a Rosemary's member today & enjoy $25 off of your next
              meal.
            </p>

            {loading && (
            <Spinner></Spinner>
            )}

            {mode === "signin" && (
              <form onSubmit={formikSignin.handleSubmit}>
                <input
                  className="Z_custom_input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  {...formikSignin.getFieldProps("email")}
                />
                <div style={{ position: "relative" }}>
                  <input
                    className="Z_custom_input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    {...formikSignin.getFieldProps("password")}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 30,
                      top: "17%",
                      cursor: "pointer",
                      color: "#1f2e3d",
                    }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                <div
                  className="Z_Sign_In_Link mb-3"
                  style={{ textAlign: "right" }}
                >
                  <a href="#" onClick={handleForgotClick}>
                    Forgot password?
                  </a>
                </div>
                <div className="Z_submit_register">
                  <button type="submit">SIGN IN</button>
                </div>
              </form>
            )}

            {mode === "forgot" && !otpMode && !resetMode && (
              <form onSubmit={formikForgot.handleSubmit}>
                <input
                  className="Z_custom_input"
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  {...formikForgot.getFieldProps("phone")}
                />
                <div className="Z_submit_register">
                  <button type="submit">SEND OTP</button>
                </div>
              </form>
            )}

            {mode === "forgot" && otpMode && !resetMode && (
              <form onSubmit={formikOtp.handleSubmit}>
                <p className="text-center">
                  Enter the 4-digit OTP sent to your phone.
                </p>
                <div
                  className="mb-2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`otp-input-${i}`}
                      maxLength={1}
                      type="text"
                      className="otp-box"
                      value={formikOtp.values[`otp${i}`]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !formikOtp.values[`otp${i}`] &&
                          i > 0
                        ) {
                          const prevInput = document.getElementById(
                            `otp-input-${i - 1}`
                          );
                          if (prevInput) {
                            formikOtp.setFieldValue(`otp${i - 1}`, "");
                            prevInput.focus();
                          }
                        }
                      }}
                      onBlur={formikOtp.handleBlur}
                      style={{
                        width: "40px",
                        height: "40px",
                        textAlign: "center",
                      }}
                    />
                  ))}
                </div>
                <div className="Z_submit_register">
                  <button type="submit">VERIFY OTP</button>
                </div>
              </form>
            )}

            {mode === "forgot" && resetMode && (
              <form onSubmit={formikReset.handleSubmit}>
                <div style={{ position: "relative" }}>
                  <input
                    className="Z_custom_input"
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    {...formikReset.getFieldProps("newPassword")}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 30,
                      top: "17%",
                      cursor: "pointer",
                      color: "#1f2e3d",
                    }}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    className="Z_custom_input"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    {...formikReset.getFieldProps("confirmPassword")}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 30,
                      top: "17%",
                      cursor: "pointer",
                      color: "#1f2e3d",
                    }}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div className="Z_Sign_In_Link" style={{ textAlign: "right" }}>
                  <a href="#" onClick={handleSignInClick}>
                    Back to Sign In
                  </a>
                </div>
                <div className="Z_submit_register">
                  <button type="submit">RESET PASSWORD</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
