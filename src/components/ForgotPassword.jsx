import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './login.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSendReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for a password reset link.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="animation-container"></div>
        <div className="form-container">
          <div className="form-wrapper">
            <h2>Reset Password</h2>
            <p style={{color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem'}}>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSendReset}>
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              {message && <p className={message.includes('Check your email') ? 'success-message' : 'error-message'}>{message}</p>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="toggle-link" onClick={() => navigate('/login')}>
                Back to Login
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
