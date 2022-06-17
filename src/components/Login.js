import React from "react";
import { GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import "firebase/app";
import { app } from "../firebase";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";

const auth = getAuth(app);

const Login = () => {
  return (
    <div id="login-page">
      <div id="login-card">
        <h2>Login to SuperChat</h2>
        <div
          className="login-button google"
          onClick={() => signInWithRedirect(auth, new GoogleAuthProvider())}
        >
          <GoogleOutlined /> Sign in with Google
        </div>
        <br /> <br />
        <div
          className="login-button facebook"
          onClick={() => signInWithRedirect(auth, new FacebookAuthProvider())}
        >
          <FacebookOutlined /> Sign in with Facebook
        </div>
      </div>
    </div>
  );
};

export default Login;
