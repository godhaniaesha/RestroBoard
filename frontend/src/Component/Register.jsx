import React, { useState } from 'react';
import '../Style/z_Style.css';

function Register() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let errs = {};
        if (!form.email) errs.email = 'Email is required';
        if (!form.password) errs.password = 'Password is required';
        if (!isLogin && form.password !== form.confirmPassword) {
            errs.confirmPassword = 'Passwords do not match';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Handle login/register logic here
            alert(isLogin ? 'Login Success' : 'Register Success');
        }
    };

    if (!showModal) return null;

    return (
        <div className="Z_modalOverlay">
            <div className="Z_modalContainer">
                <button className="Z_closeBtn" onClick={() => setShowModal(false)}>&times;</button>
                <h2 className="Z_modalTitle">{isLogin ? 'Login' : 'Register'}</h2>
                <form className="Z_form" onSubmit={handleSubmit}>
                    <div className="Z_formGroup">
                        <label className="Z_label" htmlFor="email">Email</label>
                        <input
                            className="Z_input"
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="Z_error">{errors.email}</span>}
                    </div>
                    <div className="Z_formGroup">
                        <label className="Z_label" htmlFor="password">Password</label>
                        <input
                            className="Z_input"
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <span className="Z_error">{errors.password}</span>}
                    </div>
                    {!isLogin && (
                        <div className="Z_formGroup">
                            <label className="Z_label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className="Z_input"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && <span className="Z_error">{errors.confirmPassword}</span>}
                        </div>
                    )}
                    <button className="Z_submitBtn" type="submit">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                <div className="Z_toggleText">
                    {isLogin ? (
                        <>
                            Don't have an account?{' '}
                            <button className="Z_toggleBtn" onClick={() => setIsLogin(false)}>Register</button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button className="Z_toggleBtn" onClick={() => setIsLogin(true)}>Login</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;