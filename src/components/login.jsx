import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [signUpData, setSignUpData] = useState({
    fullName: '', dob_dd: '', dob_mm: '', dob_yyyy: '', gender: '',
    email: '', password: '', sendNews: false, shareData: false, agreeToTerms: false,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Handle browser back button
    const handlePopState = () => {
      navigate('/', { replace: true });
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // NOTE: The icon variables are no longer needed as the SVGs are now inline.

  const handleSignUpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const nextStep = () => {
    if (!signUpData.fullName || !signUpData.email || !signUpData.password) {
      setMessage('Please fill in all required fields.');
      return;
    }
    setMessage('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setMessage('');
    setStep(step - 1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) { 
        console.error('Login error:', error);
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          setMessage('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          setMessage('Invalid email or password. Please check your credentials and try again.');
        } else {
          setMessage(error.message);
        }
      } else {
        console.log('Login successful:', data);
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setMessage('An unexpected error occurred during login. Please try again.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!signUpData.agreeToTerms) {
      setMessage('You must agree to the Terms & Privacy Policy.');
      return;
    }
    const { dob_yyyy, dob_mm, dob_dd, fullName } = signUpData;
    const dob = `${dob_yyyy}-${dob_mm}-${dob_dd}`;
    const [first_name, ...last_name_parts] = fullName.split(' ');
    const last_name = last_name_parts.join(' ');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            first_name, last_name, full_name: fullName, dob, gender: signUpData.gender,
            send_news: signUpData.sendNews, share_data: signUpData.shareData,
          },
        },
      });
      
      if (error) { 
        console.error('Signup error:', error);
        setMessage(error.message); 
      } else {
        console.log('Signup response:', data);

        // Create profile in profiles table
        if (data.user) {
          await supabase.from('profiles').insert([{
            user_id: data.user.id,
            full_name: fullName,
            email: signUpData.email,
            date_of_birth: dob || null,
            gender: signUpData.gender || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);
        }

        if (data.user && !data.user.email_confirmed_at) {
          setMessage('Signup successful! Please check your email and click the confirmation link to complete registration.');
        } else {
          setMessage('Signup successful! You can now sign in.');
        }
        setIsSignUp(false);
      }
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setMessage('An unexpected error occurred during signup. Please try again.');
    }
  };

  const handleOAuthLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const toggleForm = (isSigningUp) => {
    setIsSignUp(isSigningUp);
    setMessage('');
    setStep(1);
    setEmail('');
    setPassword('');
    setSignUpData({
      fullName: '', dob_dd: '', dob_mm: '', dob_yyyy: '', gender: '', email: '', password: '',
      sendNews: false, shareData: false, agreeToTerms: false,
    });
  };

  const renderSignUpForm = () => {
    // This function remains unchanged from your original code.
    if (step === 1) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
          <p className="step-indicator">Step 1 of 2</p>
          {/* --- CHANGE HERE: Applied the new CSS class --- */}
          <h3 className="hear-title">H.E.A.R</h3>

          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={signUpData.fullName} onChange={handleSignUpChange} />
          </div>
          <div className="input-group">
            <label>Date of Birth</label>
            <div className="dob-group">
              <input type="text" name="dob_dd" placeholder="DD" value={signUpData.dob_dd} onChange={handleSignUpChange} maxLength="2" />
              <input type="text" name="dob_mm" placeholder="MM" value={signUpData.dob_mm} onChange={handleSignUpChange} maxLength="2" />
              <input type="text" name="dob_yyyy" placeholder="YYYY" value={signUpData.dob_yyyy} onChange={handleSignUpChange} maxLength="4" />
            </div>
          </div>
          <div className="input-group">
            <label>Gender</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" value="male" checked={signUpData.gender === 'male'} onChange={handleSignUpChange} /> Male</label>
              <label><input type="radio" name="gender" value="female" checked={signUpData.gender === 'female'} onChange={handleSignUpChange} /> Female</label>

            </div>
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={signUpData.email} onChange={handleSignUpChange} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={signUpData.password} onChange={handleSignUpChange} />
          </div>
          {message && <p className="error-message">{message}</p>}
          <button type="submit" className="btn btn-primary">Next</button>
          <p className="toggle-link" onClick={() => toggleForm(false)}>Already have an account? Log in</p>
        </form>
      );
    } else { // Step 2
      return (
        <form onSubmit={handleSignUpSubmit}>
          <p className="step-indicator">Step 2 of 2</p>
          <h2>Want us to send you personalized content?</h2>
          <div className="checkbox-group">
            <label><input type="checkbox" name="sendNews" checked={signUpData.sendNews} onChange={handleSignUpChange} /> Send me news and offers</label>
            <label><input type="checkbox" name="shareData" checked={signUpData.shareData} onChange={handleSignUpChange} /> Share my registration data</label>
            <label><input type="checkbox" name="agreeToTerms" checked={signUpData.agreeToTerms} onChange={handleSignUpChange} /> I agree to Terms & Privacy Policy</label>
          </div>
          {message && <p className="error-message">{message}</p>}
          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
          <p className="toggle-link" onClick={() => toggleForm(false)}>Already have an account? Log in</p>
        </form>
      );
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      <h2>Welcome Back</h2>

      {/* --- THIS IS THE UPDATED BUTTON CODE --- */}
      <button type="button" className="btn-google" onClick={() => handleOAuthLogin('google')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="oauth-icon">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.68 1.22 9.18 3.61l6.83-6.83C35.45 2.3 29.91 0 24 0 14.6 0 6.61 5.38 2.7 13.22l7.98 6.19C12.24 13.16 17.66 9.5 24 9.5z" />
          <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.21-.43-4.71H24v9.06h12.43c-.54 2.9-2.16 5.36-4.59 7.03l7.1 5.5C43.79 37.43 46.1 31.36 46.1 24.5z" />
          <path fill="#FBBC05" d="M10.68 28.41c-.48-1.41-.75-2.91-.75-4.41s.27-3 .75-4.41l-7.98-6.19C1.24 16.71 0 20.21 0 24s1.24 7.29 3.32 10.6l7.36-6.19z" />
          <path fill="#EA4335" d="M24 48c6.48 0 11.91-2.13 15.88-5.8l-7.1-5.5c-2.01 1.35-4.58 2.13-8.78 2.13-6.34 0-11.76-3.66-13.33-8.72l-7.98 6.19C6.61 42.62 14.6 48 24 48z" />
        </svg>
        Continue with Google
      </button>

      <button type="button" className="btn-microsoft" onClick={() => handleOAuthLogin('azure')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="oauth-icon">
          <rect width="10" height="10" x="1" y="1" fill="#f25022" />
          <rect width="10" height="10" x="12" y="1" fill="#7fba00" />
          <rect width="10" height="10" x="1" y="12" fill="#00a4ef" />
          <rect width="10" height="10" x="12" y="12" fill="#ffb900" />
        </svg>
        Continue with Microsoft
      </button>

      <div className="divider">OR</div>
      <div className="input-group">
        <input id="login-email" type="email" placeholder="Email or username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="input-group">
        <input id="login-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {message && <p className="error-message">{message}</p>}
      <button type="submit" className="btn btn-primary">Log In</button>
      <div className="links-container">
        <p className="toggle-link" onClick={() => toggleForm(true)}>
          Don't have an account? Sign up
        </p>
        <p>
          <button type="button" onClick={handleForgotPassword} className="forgot-password-link">
            Forgot your password?
          </button>
        </p>
      </div>
    </form>
  );

  return (
    // --- CHANGE HERE: Added a wrapper div with a unique class ---
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="animation-container"></div>
        <div className="form-container">
          <div className="form-wrapper">
            {isSignUp ? renderSignUpForm() : renderLoginForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;








