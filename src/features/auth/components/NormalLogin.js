import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NormalLogin.css';

const NormalAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  // Login/Signup fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Loading state for button
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true); // Show loading spinner

    if (!email || !password || (!isLogin && !confirmPassword)) {
      setErrorMessage('Please fill in all fields.');
      setLoading(false); // Hide loading spinner
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false); // Hide loading spinner
      return;
    }

    try {
      let response;

      if (!isLogin) {
        // Sign Up
        response = await fetch('http://localhost:8080/api/users/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'User', email, password }),
        });

        if (!response.ok) {
          setErrorMessage('Signup failed.');
          setLoading(false); // Hide loading spinner
          return;
        }

        // Simulate a delay before success message
        setTimeout(() => {
          setSuccessMessage('Signup successful!');
          setTimeout(() => {
            window.location.reload();
          }, 3000); // 3 seconds delay before page reload
        }, 1000); // 1 second delay before showing success message
      } else {
        // Login
        response = await fetch('http://localhost:8080/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          setErrorMessage('Invalid Email or Password');
          setLoading(false); // Hide loading spinner
          return;
        }

        const data = await response.json();
        // Save user info to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(data));

        // Simulate a delay before navigating
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // 1 second delay before navigating
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      setLoading(false); // Hide loading spinner
      console.error(error);
    }
  };

  const handleBack = () => navigate('/login');

  const toggleMode = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setAnimateOut(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      setSuccessMessage('');
    }, 300);
  };

  return (
    <div className="auth-container">
      <div className="lock-icon">🔒</div>

      <h2 className={`auth-title ${animateOut ? 'fade-out' : 'fade-in'}`}>
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <p className={`auth-subtitle ${animateOut ? 'fade-out' : 'fade-in'}`}>
        {isLogin
          ? 'Enter your credentials to access your account.'
          : 'Create a new account to get started.'}
      </p>

      <form
        className={`auth-form ${animateOut ? 'fade-out' : 'fade-in'}`}
        onSubmit={handleSubmit}
      >
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder=" "
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" "
          />
          <label>Password</label>
        </div>

        {!isLogin && (
          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Confirm Password</label>
          </div>
        )}

        <button type="submit" className="primary-button" disabled={loading}>
  {loading ? (
    <span className="spinner"></span> // This is the spinner
  ) : (
    isLogin ? 'Login' : 'Sign Up'
  )}
</button>

      </form>

      {/* Messages below form */}
      {errorMessage && <div className="auth-error">{errorMessage}</div>}
      {successMessage && <div className="auth-success">{successMessage}</div>}

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <span onClick={toggleMode}>{isLogin ? ' Sign Up' : ' Login'}</span>
      </p>

      <button onClick={handleBack} className="back-button">
        Back to OpenID Login
      </button>
    </div>
  );
};

export default NormalAuth;
