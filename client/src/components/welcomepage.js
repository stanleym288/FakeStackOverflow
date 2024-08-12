import React from "react";
import axios from "axios";

const WelcomePageContent = ({setUsernameDisplay, setUsername, setHomePageVisible, setWelcomePage, setShowContinueAsGuest, setShowLogIn, setShowSignUp }) => {

  const handleSubmit = async (e) => {
    await axios.get('http://localhost:8000/')
                .then(res => {
                    setUsername(res.data.user.email)
                    setHomePageVisible(true)
                    setShowLogIn(false);
                })
                .catch(error => {
                  setUsername("Guest")
                  setUsernameDisplay("Guest")
                    console.error('Error fetching data:', error);
                });
  }
    
  return (
    <div>
      <div>
        <h1 style={{ textAlign: "center" }}>Welcome to FakeStackOverflow</h1>
        <p style={{ textAlign: "center" }}>Please Select an Option</p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => { setShowLogIn(true); setWelcomePage(false); }}>Log In</button>
          <button onClick={() => { handleSubmit(); setShowContinueAsGuest(true); setWelcomePage(false); }}>Continue as Guest</button>
          <button onClick={() => { setShowSignUp(true); setWelcomePage(false); }}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePageContent;