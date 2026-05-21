import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './login.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="animation-container"></div>
        <div className="form-container">
          <div className="form-wrapper">
            <h2>Set New Password</h2>
            <p style={{color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem'}}>Enter your new password below.</p>
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="New Password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Confirm New Password"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
              {message && <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>{message}</p>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
