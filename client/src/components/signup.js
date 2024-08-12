import React, { useState } from "react";
import axios from "axios";

const SignUpContent = ({ setShowSignUp, setShowLogIn, setWelcomePage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value);
  };

  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim the values before submitting the form
    const trimmedEmail = email.trim();
    const trimmedfirst = firstname.trim();
    const trimmedlast = lastname.trim();
    const trimmedUsername = firstname + " " + lastname;

    try {
      if (!trimmedEmail || !trimmedfirst || !trimmedlast || !password || !password2) {
        setError("Error: Fields are missing.");
        return;
      }

      if (password2 !== password) {
        setError("Error: Passwords do not match.");
        return;
      }

      if (password.toLowerCase().includes(trimmedfirst.toLowerCase()) || password.toLowerCase().includes(trimmedlast.toLowerCase())) {
        setError("Error: Password contains first or last name");
        return;
      }

      // Check if the password contains the user's email id
      const emailPrefix = email.split('@')[0]; // Extract email id before '@'
      if (password.toLowerCase().includes(emailPrefix.toLowerCase())) {
        setError("Error: Password contains email id");
        return;
      }

      const response = await axios.post('http://localhost:8000/register', {
        email: trimmedEmail,
        password,
        username: trimmedUsername
      });

      // If the request is successful, you can handle the response
      console.log("Registration successful:", response.data);
      setShowLogIn(true);
      setShowSignUp(false);

    } catch (error) {
      if (error.response.status === 453) {
        setError("Error: Email is already registered, please try again.");
      }
    }
  };

  const handleReturnWelcome = () => {
    setShowSignUp(false)
    setWelcomePage(true)
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h2>Sign Up To FakeStackOverflow!</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input type="text" value={firstname} onChange={handleFirstnameChange} />
          </div>
          <br />
          <div>
            <label>Last Name:</label>
            <input type="text" value={lastname} onChange={handleLastnameChange} />
          </div>
          <br />
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} />
          </div>
          <br />
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} />
          </div>
          <br />
          <div>
            <label>Re-enter Password:</label>
            <input type="password" value={password2} onChange={handlePassword2Change} />
          </div>
          <br />
          <button type="submit">Register As A New User</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div style={{textAlign:"center"}}> 
      <button onClick={handleReturnWelcome}>Return to Welcome Page</button></div>
    </>
  );
};

export default SignUpContent;