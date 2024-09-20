import React from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import Logo from "../Assets/logo.png";
import "./Login.css";

function Login() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logged In!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="LoginContainer">
      <div className="LoginCard">
        <div className="LoginCardLeft">
          <h1 style={{ fontSize: "50px", fontWeight: "100" }}>Welcome To</h1>
          <img style={{ width: "450px" }} src={Logo} alt="Reamovo Logo" />
        </div>
        <div className="LoginCardRight">
          <h1
            style={{
              fontSize: "50px",
              fontWeight: "100",
              marginBottom: "10px",
            }}
          >
            Sign In
          </h1>
          <button
            onClick={() => {
              handleGoogleLogin();
            }}
            style={{ marginBottom: "30px" }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 488 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>{" "}
            Sign In With Google
          </button>
          <div className="loginOverlay">
            <h1>Coming Soon</h1>
            <button style={{ marginBottom: "10px" }}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"></path>
              </svg>
              Sign In With Microsoft
            </button>
            <h3>Or</h3>
            <input placeholder="Email" type="text" />
            <input placeholder="Password" type="text" />
            <button
              style={{
                width: "180px",
                marginTop: "20px",
                borderRadius: "10px",
                color: "rgb(187, 187, 187)",
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
