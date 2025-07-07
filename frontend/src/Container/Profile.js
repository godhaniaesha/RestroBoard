import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaAddressCard, FaBriefcase, FaUsers, FaCalendarAlt
} from 'react-icons/fa';
import { MdCameraAlt } from 'react-icons/md';
import '../Style/profile.css';
import { getRegisterById, updateProfileUser } from '../redux/slice/user.slice';

export default function Profile() {
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const { userData, loading } = useSelector((state) => state.user);

    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        address: '',
        leave_balance: '',
        joindate: '',
        image: '',
    });

    useEffect(() => {
        if (userId) {
            dispatch(getRegisterById(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (userData && userData._id) {
            const formatted = {
                name: `${userData.firstName || ''} ${userData.lastName || ''}`,
                role: userData.role || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                leave_balance: userData.leave_balance || '',
                joindate: userData.joining_Date || '',
                image: userData.image || '',
            };
            setFormData(formatted);
            setProfileImage(null);
        }
    }, [userData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const toggleEditMode = () => setEditMode(true);

    const cancelEdit = () => {
        setEditMode(false);
        if (userData) {
            const formatted = {
                name: `${userData.firstName || ''} ${userData.lastName || ''}`,
                role: userData.role || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                leave_balance: userData.leave_balance || '',
                joindate: userData.joining_Date || '',
                image: userData.image || '',
            };
            setFormData(formatted);
            setProfileImage(null);
        }
    };

    const saveProfile = () => {
        // Name validation: only letters and spaces
        if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
            alert('Name can only contain letters and spaces.');
            return;
        }
        // Email validation: stricter regex
        if (!/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9\-.]+)\.([a-zA-Z]{2,})$/.test(formData.email.trim())) {
            alert('Please enter a valid email address.');
            return;
        }
        // Phone validation: 10 digits
        if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }
        // Address validation: allow letters, numbers, spaces, and basic punctuation
        if (!/^[A-Za-z0-9 ,.()!"'\-]+$/.test(formData.address.trim())) {
            alert('Address contains invalid characters.');
            return;
        }
        if (!formData.address.trim()) {
            alert('Address is required.');
            return;
        }
        const [firstName, ...rest] = formData.name.trim().split(' ');
        const lastName = rest.join(' ');

        const updatedForm = new FormData();
        updatedForm.append('firstName', firstName);
        updatedForm.append('lastName', lastName);
        updatedForm.append('role', formData.role);
        updatedForm.append('email', formData.email);
        updatedForm.append('phone', formData.phone);
        updatedForm.append('address', formData.address);
        updatedForm.append('joining_Date', formData.joindate);
        updatedForm.append('leave_balance', formData.leave_balance);

        if (profileImage instanceof File) {
            updatedForm.append('image', profileImage);
        }

        dispatch(updateProfileUser({ id: userId, formData: updatedForm }));
        setEditMode(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = document.getElementById('previewImage');
                if (img) img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading || !userData) return <div className="text-center mt-5">Loading Profile...</div>;

    return (
        <div className="profile-container">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                    <div className="profile-card">
                        <div className="profile-header mb-4 text-center position-relative">
                            <div className="d-flex justify-content-center">
                                <div className="profile-avatar">
                                    <img
                                        id="previewImage"
                                        src={
                                            profileImage
                                                ? URL.createObjectURL(profileImage)
                                                : `http://localhost:3000${formData.image}`
                                        }
                                        alt="Profile"
                                        className="w-100 h-100 rounded-circle object-fit-cover"
                                    />
                                    {editMode && (
                                        <>
                                            <div
                                                className="edit-overlay"
                                                onClick={() => document.getElementById('profileImageInput').click()}
                                            >
                                                <MdCameraAlt size={28} color="#fff" />
                                            </div>
                                            <input
                                                type="file"
                                                id="profileImageInput"
                                                className="d-none"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {!editMode ? (
                                <div id="profile-info">
                                    <h1 className="profile-name">{formData.name}</h1>
                                    <p className="profile-role">{formData.role}</p>
                                </div>
                            ) : (
                                <div id="profile-edit-form">
                                    <div className="row justify-content-center">
                                        <div className="col-md-8">
                                            <input type="text" id="name" className="form-control form-control-lg text-center mb-3" value={formData.name} onChange={handleInputChange} placeholder="Full Name" maxLength={50} />
                                            <input type="text" id="role" className="form-control text-center mb-3" value={formData.role} onChange={handleInputChange} placeholder="Job Title" maxLength={30} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="position-absolute top-0 end-0 p-3">
                                {!editMode ? (
                                    <button className="btn btn-gradient btn-sm" onClick={toggleEditMode}>
                                        <FaEdit className="me-2" /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="d-flex flex-wrap justify-content-end gap-2">
                                        <button className="btn btn-success-gradient btn-sm" onClick={saveProfile}>
                                            <FaSave className="me-2" /> Save
                                        </button>
                                        <button className="btn btn-danger-gradient btn-sm" onClick={cancelEdit}>
                                            <FaTimes className="me-2" /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-md-4 p-0">
                            <div className="row">
                                {/* Contact Information */}
                                <div className="col-lg-6 mb-md-4 mb-2">
                                    <div className="info-card">
                                        <h5><FaAddressCard className="me-2" /> Contact Information</h5>
                                        {!editMode ? (
                                            <div id="contact-info">
                                                <div className="info-item"><FaEnvelope className='me-2' /><span>{formData.email}</span></div>
                                                <div className="info-item"><FaPhone className='me-2' /><span>{formData.phone}</span></div>
                                                <div className="info-item"><FaMapMarkerAlt className='me-2' /><span>{formData.address}</span></div>
                                            </div>
                                        ) : (
                                            <div id="contact-edit-form">
                                                <input type="email" id="email" className="form-control mb-3" value={formData.email} onChange={handleInputChange} placeholder="Email" maxLength={100} />
                                                <input type="tel" id="phone" className="form-control mb-3" value={formData.phone} onChange={handleInputChange} placeholder="Phone" maxLength={10} />
                                                <input type="text" id="address" className="form-control mb-3" value={formData.address} onChange={handleInputChange} placeholder="Address" maxLength={200} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Professional Details */}
                                <div className="col-lg-6 mb-md-4 mb-2">
                                    <div className="info-card">
                                        <h5><FaBriefcase className="me-2" /> Professional Details</h5>
                                        {!editMode ? (
                                            <div id="professional-info">
                                                <div className="info-item"><FaUsers className='me-2' /><span>Leave Balance: {formData.leave_balance}</span></div>
                                                <div className="info-item"><FaCalendarAlt className='me-2' /><span>Joined: {new Date(formData.joindate).toLocaleDateString('en-GB')}</span></div>
                                            </div>
                                        ) : (
                                            <div id="professional-edit-form">
                                                <input type="text" id="leave_balance" className="form-control mb-3" value={formData.leave_balance} readOnly disabled />
                                                <input type="date" id="joindate" className="form-control mb-3" value={formData.joindate.slice(0, 10)} readOnly disabled />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
