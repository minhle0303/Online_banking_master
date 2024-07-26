import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from '../images/Online-Banking (1)-fotor-2024072118758.png';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


function LoginForm() {
    const [userLogin, setUserLogin] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const [errors, setError] = useState("");
    const [remainingAttempts, setRemainingAttempts] = useState(null);



    function handleChangeInput(e) {
        let { name, value } = e.target;
        setUserLogin({ ...userLogin, [name]: value });
    }
    function handleSubmit(e) {
        e.preventDefault();
        axios.post("http://localhost:5244/api/User/login", userLogin)
            .then(res => {
                localStorage.setItem("tokenData", JSON.stringify(res.data))
                const tokenDecoded = jwtDecode(res.data.token);
                if (tokenDecoded?.role) {
                    switch (tokenDecoded.role) {
                        case 'Admin':
                            navigate("/admin");
                            break;
                        case 'User':
                            navigate("/user/home");
                            break;
                        default:
                            setError("you have not been granted permission");
                    }
                }
                console.log("tokenDecoded", tokenDecoded);
                console.log("data",res.data.data);
            })
            .catch(
                err => {
                   
                if (err.response?.data === "User not found.") {
                        setError("Invalid username or password");
                    }
                if (err.response?.data === "Account is locked.") {
                    setError("Your account is locked. Pls contact to admin");
                }
                if (err.response?.data.message === "Invalid password.") {
                    setRemainingAttempts(err.response?.data?.remainingAttempts);
                    setError(`Invalid username or password. Remaining attempts: ${err.response?.data?.remainingAttempts}`);             
                }                
                    console.log(err)
                })
    }

    return (
        <div className='form-login'>
            <div className="form-container">
                <div className="logo">
                    <img src={logo} alt="OnlineBanking" /> {/* Update the path as needed */}
                </div>
                <p className="welcome-message">Welcome to Online Banking.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username or card number"
                        name="username"
                        value={userLogin.username}
                        onChange={handleChangeInput}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChangeInput} value={userLogin.password}
                        required
                    />
                    {errors && <div className="error">{errors}</div>}

                    <button type="submit">Sign in</button>
                </form>
                <div className="links">
                    <p>Dont have account?<Link to="/register"> Signing up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;