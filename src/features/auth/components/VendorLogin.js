import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VendorLogin.css';

const VendorLogin = () => {
    const navigate = useNavigate();
    const [issuer, setIssuer] = useState('https://example-issuer.com');
    const [clientId, setClientId] = useState('moyo-vendor-ui');
    const [redirectUri, setRedirectUri] = useState('');
    const [scopes, setScopes] = useState('openid profile email');

    const handleOpenIDLogin = () => {
        alert('Logging in with OpenID (Demo)');
    };

    const handleDemoLogin = () => {
        navigate("/dashboard");
    };

  return (
    <div className="vendor-login-container">
      <div className="lock-icon">🔒</div>
      <h2 className="vendor-login-title">Vendor Login</h2>
      <p className="vendor-login-subtitle">
        Authenticate with your OpenID Provider to access the MOYO Order Management Portal.
      </p>

      <div className="vendor-login-form">
        <label>Issuer (OpenID Provider):</label>
        <input value={issuer} onChange={e => setIssuer(e.target.value)} />

        <label>Client ID:</label>
        <input value={clientId} onChange={e => setClientId(e.target.value)} />

        <label>Redirect URI:</label>
        <input value={redirectUri} onChange={e => setRedirectUri(e.target.value)} />

        <label>Scopes:</label>
        <input value={scopes} onChange={e => setScopes(e.target.value)} />
      </div>

      <button
        onClick={handleOpenIDLogin} className="login-button">
        Login with OpenID (Demo)
      </button>
      <button onClick={handleDemoLogin} className="demo-button">
        Continue as Demo Vendor
      </button>
    </div>
  );
};

export default VendorLogin;