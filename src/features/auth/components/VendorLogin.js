import React from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../../../services/keycloak";
import "../styles/VendorLogin.css";

const VendorLogin = () => {
  const navigate = useNavigate();

  const handleOpenIDLogin = () => {
    keycloak.login({
      redirectUri: window.location.origin + "/dashboard",
    });
  };

  const handleNormalLogin = () => {
    navigate("/classic-login");
  };

  return (
    <div className="vendor-login-container">
      <div className="lock-icon">🔒</div>
      <h2 className="vendor-login-title">Vendor Login</h2>
      <p className="vendor-login-subtitle">
        Authenticate with your OpenID Provider to access the MOYO Order
        Management Portal.
      </p>
      {/* You can remove the issuer/clientId/redirectUri/scopes fields if not needed */}
      <button onClick={handleOpenIDLogin} className="login-button">
        Login with OpenID
      </button>
      {/* <button onClick={handleNormalLogin} className="demo-button">
        Traditional Sign In
      </button> */}
    </div>
  );
};

export default VendorLogin;
