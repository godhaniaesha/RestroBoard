import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loogin_bg from "../Image/Loogin_bg.png";
import "../Style/z_Style.css";
import { useFormik } from "formik";
import * as Yup from "yup";

function Register(props) {
  const [mode, setMode] = useState("signin"); // 'signin' or 'forgot'
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otpMode, setOtpMode] = useState(false); // true after SEND OTP
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resetMode, setResetMode] = useState(false); // true after OTP is verified
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation Schemas
  const signinSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });
  const forgotSchema = Yup.object({
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
  });
  const otpSchema = Yup.object({
    otp0: Yup.string().matches(/^\d$/, "").required("Required"),
    otp1: Yup.string().matches(/^\d$/, "").required("Required"),
    otp2: Yup.string().matches(/^\d$/, "").required("Required"),
    otp3: Yup.string().matches(/^\d$/, "").required("Required"),
  });
  const resetSchema = Yup.object({
    newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Required"),
  });

  // Formik instances for each mode
  const formikSignin = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signinSchema,
    onSubmit: (values) => {
      // handle sign in
    },
    enableReinitialize: true,
  });
  const formikForgot = useFormik({
    initialValues: { phone: "" },
    validationSchema: forgotSchema,
    onSubmit: (values) => {
      setOtpMode(true);
    },
    enableReinitialize: true,
  });
  const formikOtp = useFormik({
    initialValues: { otp0: "", otp1: "", otp2: "", otp3: "" },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      setResetMode(true);
    },
    enableReinitialize: true,
  });
  const formikReset = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: resetSchema,
    onSubmit: (values) => {
      setMode("signin");
      setOtpMode(false);
      setResetMode(false);
      formikSignin.resetForm();
      formikForgot.resetForm();
      formikOtp.resetForm();
      formikReset.resetForm();
    },
    enableReinitialize: true,
  });

  // Handlers for switching modes
  const handleForgotClick = (e) => {
    e.preventDefault();
    setMode("forgot");
    setOtpMode(false);
    setResetMode(false);
    formikSignin.resetForm();
    formikForgot.resetForm();
    formikOtp.resetForm();
    formikReset.resetForm();
  };
  const handleSignInClick = (e) => {
    e.preventDefault();
    setMode("signin");
    setOtpMode(false);
    setResetMode(false);
    formikSignin.resetForm();
    formikForgot.resetForm();
    formikOtp.resetForm();
    formikReset.resetForm();
  };

  // OTP input focus logic
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const field = `otp${index}`;
      formikOtp.setFieldValue(field, value);
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <section>
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
            {/* Formik forms for each mode */}
            {mode === "signin" && (
              <form onSubmit={formikSignin.handleSubmit}>
                <p style={{ color: "var(--primary-bg-color)", textAlign: "center", marginBottom: 20 }}>
                  Please sign in with your email and password.
                </p>
                <input
                  className="Z_custom_input"
                  type="email"
                  placeholder="brad.dawson@me.com"
                  name="email"
                  value={formikSignin.values.email}
                  onChange={formikSignin.handleChange}
                  onBlur={formikSignin.handleBlur}
                />
                {formikSignin.touched.email && formikSignin.errors.email && (
                  <div style={{ color: "#e57373", marginBottom: 10 }}>{formikSignin.errors.email}</div>
                )}
                <div style={{ position: "relative" }}>
                  <input
                    className="Z_custom_input"
                    type={showPassword ? "text" : "password"}
                    placeholder="************k"
                    name="password"
                    value={formikSignin.values.password}
                    onChange={formikSignin.handleChange}
                    onBlur={formikSignin.handleBlur}
                    style={{ position: "relative" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 30,
                      top: "37%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {formikSignin.touched.password && formikSignin.errors.password && (
                  <div style={{ color: "#e57373", marginBottom: 10 }}>{formikSignin.errors.password}</div>
                )}
                <div className="Z_Sign_In_Link" style={{ textAlign: "right", marginBottom: "25px" }}>
                  <a
                    href="#"
                    style={{ color: "var(--primary-bg-color)", textDecoration: "none", fontSize: "0.9rem" }}
                    onClick={handleForgotClick}
                  >
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
                <p style={{ color: "var(--primary-bg-color)", textAlign: "center", marginBottom: 20 }}>
                  Enter your phone number to receive an OTP for password reset.
                </p>
                <input
                  className="Z_custom_input"
                  type="tel"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={formikForgot.values.phone}
                  onChange={formikForgot.handleChange}
                  onBlur={formikForgot.handleBlur}
                />
                {formikForgot.touched.phone && formikForgot.errors.phone && (
                  <div style={{ color: "#e57373", marginBottom: 10 }}>{formikForgot.errors.phone}</div>
                )}
                <div className="Z_submit_register">
                  <button type="submit" style={{ marginTop: "15px" }}>
                    SEND OTP
                  </button>
                </div>
                {/* <div className="Z_Sign_In_Link" style={{ textAlign: "right", marginBottom: "25px" }}>
                  <a
                    href="#"
                    style={{ color: "var(--primary-bg-color)", textDecoration: "none", fontSize: "0.9rem" }}
                    onClick={handleSignInClick}
                  >
                    Back to Sign In
                  </a>
                </div> */}
              </form>
            )}
            {mode === "forgot" && otpMode && !resetMode && (
              <form onSubmit={formikOtp.handleSubmit}>
                <p style={{ color: "var(--primary-bg-color)", textAlign: "center", marginBottom: 20 }}>
                  Enter the 4-digit OTP sent to your phone.
                </p>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        name={`otp${idx}`}
                        value={formikOtp.values[`otp${idx}`]}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onBlur={formikOtp.handleBlur}
                        style={{
                          width: "40px",
                          height: "40px",
                          textAlign: "center",
                          fontSize: "1.5rem",
                          border: "1px solid var(--primary-bg-color)",
                          borderRadius: "5px",
                          background: "transparent",
                          color: "#fff",
                        }}
                      />
                    ))}
                  </div>
                  {([0, 1, 2, 3].some(idx => formikOtp.touched[`otp${idx}`] && formikOtp.errors[`otp${idx}`])) && (
                    <div style={{ color: "#e57373", marginBottom: 10 }}>
                      {Object.values(formikOtp.errors).find(Boolean)}
                    </div>
                  )}
                  <div className="Z_submit_register">
                    <button type="submit">VERIFY OTP</button>
                  </div>
                  {/* <div className="Z_Sign_In_Link" style={{ textAlign: "right", marginBottom: "25px" }}>
                    <a
                      href="#"
                      style={{ color: "var(--primary-bg-color)", textDecoration: "none", fontSize: "0.9rem" }}
                      onClick={handleSignInClick}
                    >
                      Back to Sign In
                    </a>
                  </div> */}
                </div>
              </form>
            )}
            {mode === "forgot" && resetMode && (
              <form onSubmit={formikReset.handleSubmit}>
                <p style={{ color: "var(--primary-bg-color)", textAlign: "center", marginBottom: 20 }}>
                  Create a new password for your account.
                </p>
                <div style={{ position: "relative" }}>
                  <input
                    className="Z_custom_input"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Create password"
                    name="newPassword"
                    value={formikReset.values.newPassword}
                    onChange={formikReset.handleChange}
                    onBlur={formikReset.handleBlur}
                    style={{ marginBottom: "20px" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 30,
                      top: "36%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {formikReset.touched.newPassword && formikReset.errors.newPassword && (
                  <div style={{ color: "#e57373", marginBottom: 10 }}>{formikReset.errors.newPassword}</div>
                )}
                <div style={{ position: "relative" }}>
                  <input
                    className="Z_custom_input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formikReset.values.confirmPassword}
                    onChange={formikReset.handleChange}
                    onBlur={formikReset.handleBlur}
                    style={{ marginBottom: "20px" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 30,
                      top: "36%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {formikReset.touched.confirmPassword && formikReset.errors.confirmPassword && (
                  <div style={{ color: "#e57373", marginBottom: 10 }}>{formikReset.errors.confirmPassword}</div>
                )}
                <div className="Z_submit_register z_reset_resp">
                  <button type="submit">RESET PASSWORD</button>
                </div>
                {/* <div className="Z_Sign_In_Link" style={{ textAlign: "right", marginBottom: "25px" }}>
                  <a
                    href="#"
                    style={{ color: "var(--primary-bg-color)", textDecoration: "none", fontSize: "0.9rem" }}
                    onClick={handleSignInClick}
                  >
                    Back to Sign In
                  </a>
                </div> */}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
