import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Online-Banking (1)-fotor-2024072118758.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


function Register() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        hasNumbers: false,
        hasUpper: false,
        hasLower: false,
        hasSpecial: false
    });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        phone: '',
        pin: '',
        role: 'User',
        failedLoginAttempts: 0,
        accountLocked: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = event => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors on input change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const handleBack = () => {
        // Check current step and clear relevant data when moving back
        if (step === 2) {
            // Reset fields when moving back from step 2 to step 1
            setFormData(prev => ({
                ...prev,
                username: '',
                email: '',
                password: ''
            }));
            setStep(1);
        } else if (step === 3) {
            // Reset fields when moving back from step 3 to step 2
            setFormData(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                dob: '',
                address: '',
                phone: ''
            }));
            setStep(2);
        }
    };
    const handlePasswordChange = event => {
        const { value } = event.target;
        setFormData(prev => ({ ...prev, password: value }));

        setPasswordRequirements({
            length: value.length >= 8,
            hasNumbers: /\d/.test(value),
            hasUpper: /[A-Z]/.test(value),
            hasLower: /[a-z]/.test(value),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
        });

        handleChange(event);
    };
    const togglePasswordVisibility = () => {
        setShowPassword(showPassword => !showPassword);
    };

    const handleSubmitStep1 = async (event) => {
        event.preventDefault();
        // API request to check username and email availability
        const { length, hasNumbers, hasUpper, hasLower, hasSpecial } = passwordRequirements;
        if (!length || !hasNumbers || !hasUpper || !hasLower || !hasSpecial) {
            setErrors(prev => ({
                ...prev,
                password: "Password must meet all requirements"
            }));
            return; // Stop submission if password does not meet requirements
        }
        axios.get("http://localhost:5244/api/User/", {
            params: {
                username: formData.username,
                email: formData.email
            }
        })
            .then(response => {
                const isUsernameTaken = response.data.some(user => user.username === formData.username);
                const isEmailTaken = response.data.some(user => user.email === formData.email);
                console.log(response);

                let newErrors = {};
                if (isUsernameTaken) {
                    newErrors.username = 'Username already exists!';
                }
                if (isEmailTaken) {
                    newErrors.email = 'Email already exists!';
                }

                if (Object.keys(newErrors).length === 0) {
                    setStep(2);

                } else {
                    setErrors(newErrors);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setErrors({ form: 'Failed to check username and email availability.' });
            });
    };
    const handleStepTwoSubmission = async (event) => {
        event.preventDefault();

        // Calculate age
        const birthDate = new Date(formData.dob);
        const ageDiffMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiffMs); // miliseconds from epoch
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 16) {
            setErrors({ dob: 'You must be at least 16 years old.' });
            return; // Stop the form submission
        }
        if (formData.phone.length < 10 || formData.phone.length > 11) {
            setErrors({ phone: 'Phone number must be between 10 and 11 digits.' });
            return; // Stop the form submission
        }

        // API request to check phone number availability
        axios.get("http://localhost:5244/api/User/", {
            params: { phone: formData.phone }
        })
            .then(response => {
                const isPhoneTaken = response.data.some(user => user.phone === formData.phone); 

                if (isPhoneTaken) {
                    setErrors({ phone: 'Phone number already in use!' });
                } else {
                    setStep(3); // Move to next step if everything is okay
                }
            })
            .catch(error => {
                console.error('Error checking phone number:', error);
                setErrors({ form: 'Failed to check phone number availability.' });
            });
    };

    const handleSubmitFinal = async event => {
        event.preventDefault();

        if (formData.pin.length !== 4 || isNaN(formData.pin)) {
            setErrors({ pin: 'PIN must be exactly 4 digits!' })
            return;
        }

        axios.post('http://localhost:5244/api/User', formData)
            .then(response => {
                console.log('Registration successful:', response.data);
                alert('User Registered Successfully!');
                navigate("/login");
            })
            .catch(error => {
                console.error('Registration failed:', error);
                alert('Registration failed.');
            });
    };

    return (
        <div className='form-login'>
            <div className="form-container">
                <div className="logo">
                    <img src={logo} alt="OnlineBanking" /> {/* Update the path as needed */}
                </div>
                <p className="welcome-message">Register to Online Banking.</p>
                {step === 1 && (
                    <form onSubmit={handleSubmitStep1}>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                        {errors.username && <p className="error">{errors.username}</p>}
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                        {errors.email && <p className="error">{errors.email}</p>}


                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handlePasswordChange}
                                placeholder="Password"
                                required
                            />
                            <button onClick={togglePasswordVisibility} type="button" className="password-toggle">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                           
                        </div>
                        {errors.password && <p className="error">{errors.password}</p>}

                        <div className="password-requirements">
                                <p className={passwordRequirements.length ? 'met' : ''}>At least 8 characters</p>
                                <p className={passwordRequirements.hasNumbers ? 'met' : ''}>Includes a number</p>
                                <p className={passwordRequirements.hasUpper ? 'met' : ''}>Includes an uppercase letter</p>
                                <p className={passwordRequirements.hasLower ? 'met' : ''}>Includes a lowercase letter</p>
                                <p className={passwordRequirements.hasSpecial ? 'met' : ''}>Includes a special character [!@#$%^&*,.?]</p>
                            </div>
                        <button type="submit">Next</button>
                        <button type="button" onClick={() => navigate("/login")}>Back to Login</button>

                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleStepTwoSubmission}>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        {errors.dob && <p className="error">{errors.dob}</p>}
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                        {errors.phone && <p className="error">{errors.phone}</p>}
                        <button type="submit">Next</button>
                        <button type="button" onClick={handleBack}>Back</button>

                    </form>
                )} {step === 3 && (
                    <form onSubmit={handleSubmitFinal}>
                        <input type="password" name="pin" value={formData.pin} onChange={handleChange} placeholder="PIN" maxLength="4" required />
                        {errors.pin && <p className="error">{errors.pin}</p>}

                        <button type="submit">Finish</button>
                        <button type="button" onClick={handleBack}>Back</button>

                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;
