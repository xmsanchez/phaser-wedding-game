import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import styles from '../App.css';

const GoogleAuth = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  const onSuccess = (response) => {
    console.log('Google login successful:', response);
    const { profileObj, accessToken } = response;

    // List of approved email addresses
    const approvedEmails = ["xmfreak@gmail.com", "garciasalamiriam@gmail.com"];
    const userEmail = profileObj.email;
    if (approvedEmails.includes(userEmail)) {
      // User is authorized, use the profileObj and accessToken to authorize the user
      // For example, you can make a request to your server with the access token and store the user's information in your database
    } else {
      // User is not authorized, display an error message or redirect to a restricted access page
    }
  };

  const onFailure = (response) => {
    console.log('Google login failed:', response);
    setLoginError('Google login failed. Please try again.');
  };

  return (
    <div className={styles.googleLoginContainer}>
      <GoogleLogin
        clientId={process.env.OPENAI_CLIENTID || '325304156054-423o3l1he41932n07c4bl6dk4sadipph.apps.googleusercontent.com'}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        responseType="code"
        prompt="consent"
      />
      {loginError && <p>{loginError}</p>}
      {name && <p>Welcome, {name}!</p>}
      {email && <p>Your email is {email}.</p>}
    </div>
  );
};

export default GoogleAuth;
