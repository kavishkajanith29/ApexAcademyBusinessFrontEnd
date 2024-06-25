import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "./password.scss"

const PasswordChange = () => {
    const teacherId = localStorage.getItem('teacherId');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const handleLoginCheck = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8085/api/v1/teacher/login', {
                userId: teacherId,
                password: currentPassword
            });

            if (response.status === 200 && response.data.message === "Login Success") {
                setIsPasswordConfirmed(true);
                setMessage('Current password verified. Enter new password.');
            } else {
                setMessage('Incorrect  password.');
            }
        } catch (error) {
            setMessage('Error verifying current password: ' + error.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setMessage('New passwords do not match.');
            return;
        }
        if (!validatePassword(newPassword)) {
            setMessage('New password does not meet security requirements.');
            return;
        }
        try {
            await axios.post('http://localhost:8085/api/v1/teacher/changePassword', null, {
                params: {
                    teacherId: teacherId,
                    newPassword: newPassword
                }
            });
            setMessage('');
            setIsPasswordConfirmed(false);
            setCurrentPassword('');
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmNewPassword(false);
            setNewPassword('');
            setConfirmNewPassword('');

            Swal.fire({
                icon: 'success',
                title: 'Password Changed Successfully',
                showConfirmButton: true,
                timer: 1500
            });
        } catch (error) {
            setMessage('Error changing password: ' + error.message);
        }
    };

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleShowConfirmNewPassword = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    return (
        <div className="profile-container">
            <h2>Change Password</h2>
            {!isPasswordConfirmed ? (
                <form onSubmit={handleLoginCheck}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <div className="password-input">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showCurrentPassword ? faEyeSlash : faEye}
                                onClick={toggleShowCurrentPassword}
                                className="password-icon"
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Verify Password</button>
                </form>
            ) : (
                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <div className="password-input">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showNewPassword ? faEyeSlash : faEye}
                                onClick={toggleShowNewPassword}
                                className="password-icon"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                        <div className="password-input">
                            <input
                                type={showConfirmNewPassword ? "text" : "password"}
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showConfirmNewPassword ? faEyeSlash : faEye}
                                onClick={toggleShowConfirmNewPassword}
                                className="password-icon"
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Change Password</button>
                </form>
            )}
            {message && <p className={`message ${(message.includes('Error')||message.includes('Incorrect')||message.includes('not')) ? 'error' : 'success'}`}>{message}</p>}
        </div>
    );
};

export default PasswordChange;
