import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './CSS/Loginsignup.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'


const LoginSingup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    //mount with back end
    const [state,setState] = useState("Login");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    //api
    const [formData,setFormData] = useState({
      username:"",
      password:"",
      email:""
    })

    // Handle redirect after successful login/signup
    const handleSuccessfulAuth = () => {
        // Check if there's a redirect path stored (for add to cart flow)
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
        } else {
            // Navigate to main page if accessing login directly
            navigate('/');
        }
    };

    // Check if user came from add to cart flow
    useEffect(() => {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
            setMessage('Please log in to add items to your cart');
            setMessageType('info');
        }
    }, []);

    const changeHandler = (e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            showMessage('Please fill in all required fields', 'error');
            return false;
        }
        if (state === "Sign up" && !formData.username) {
            showMessage('Please enter your name', 'error');
            return false;
        }
        if (state === "Sign up" && !agreeTerms) {
            showMessage('Please agree to the terms and conditions', 'error');
            return false;
        }
        return true;
    };

  const login = async()=>{
    if (!validateForm()) return;
    
    setLoading(true);
    console.log("Login Function Executed",formData);
    let responsData;
    const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-webapp-backend.onrender.com'
        : 'http://localhost:4000';
        
    try {
        const response = await fetch(`${backendUrl}/login`,{
          method:'POST',
          headers:{
            Accept:'application/form-data',
            'Content-Type':'application/json',
          },
          body:JSON.stringify(formData),
        });
        responsData = await response.json();

        if(responsData.success){
          localStorage.setItem('auth-token',responsData.token);
          showMessage('Login successful! Redirecting...', 'success');
          setTimeout(() => {
              handleSuccessfulAuth();
          }, 1500);
        }
        else{
          showMessage(responsData.errors || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
  }
  const signup = async()=>{
    if (!validateForm()) return;
    
    setLoading(true);
    console.log("Signup Function Executed",formData);
    let responsData;
    const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-webapp-backend.onrender.com'
        : 'http://localhost:4000';
        
    try {
        const response = await fetch(`${backendUrl}/signup`,{
          method:'POST',
          headers:{
            Accept:'application/form-data',
            'Content-Type':'application/json',
          },
          body:JSON.stringify(formData),
        });
        responsData = await response.json();

        if(responsData.success){
          localStorage.setItem('auth-token',responsData.token);
          showMessage('Account created successfully! Redirecting...', 'success');
          setTimeout(() => {
              handleSuccessfulAuth();
          }, 1500);
        }
        else{
          showMessage(responsData.errors || 'Signup failed', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
  }

  //forntend

  return (
    <div className='loginsignup'>
      <div className={`loginsignup-container ${state === 'Login' ? 'login-mode' : ''}`}>
        <div className="login-header">
          <h1>{state}</h1>
          <p className="welcome-text">Welcome! Please enter your details</p>
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
        
        <div className="loginsignup-fields">
          {state==="Sign up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <div className="password-field">
            <input 
              name='password' 
              value={formData.password} 
              onChange={changeHandler} 
              type={showPassword ? "text" : "password"} 
              placeholder='Password' 
            />
            <span 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </div>
        </div>

        <div className="login-actions">
          {state==="Sign up" && (
            <div className="loginsignup-agree">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                id='agree-terms' 
              />
              <label htmlFor='agree-terms'>I agree to the terms of use & privacy policy.</label>
            </div>
          )}
          <button 
            onClick={()=>{state==='Login'?login():signup()}}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>
          
          {state==="Sign up"?
            <p className='loginsignup-login'>Already have an account?
              <span onClick={()=>{setState("Login")}}> Login here</span>
            </p>
          :
            <p className='loginsignup-login'>Create an account?
              <span onClick={()=>{setState("Sign up")}}> Click here</span>
            </p>
          }
        </div>

        
      </div>
    </div>
  )
}

export default LoginSingup