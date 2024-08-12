import React, { useState } from "react";
import axios from "axios";

const LogInContent = ({ setReputation, setUsername, setUsernameDisplay, setHomePageVisible, setShowLogIn, setWelcomePage}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/login", {
                email,
                password,
            });

            await axios.get('http://localhost:8000/')
                .then(res => {
                    setUsername(res.data.user.email)
                    setUsernameDisplay(res.data.user.username)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            await axios.get('http://localhost:8000/reputation', {params: { email }})
                .then(res => {
                    setReputation(res.data.reputation)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            setShowLogIn(false)
            setHomePageVisible(true)
        } catch (error) {
            if (error.response.status === 453) {
                setError("Error: Email not found.");
            } else if (error.response.status === 454) {
                setError("Error: Wrong password.");
            }
        }
    };

    const handleReturnWelcome = () => {
        setShowLogIn(false)
        setWelcomePage(true)
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <button onClick={handleReturnWelcome}>Return to Welcome Page</button>
        </div>
    );
};

export default LogInContent