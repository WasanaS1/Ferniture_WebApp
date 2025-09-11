import React, { useState } from 'react'
import './CSS/Loginsignup.css'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'


const LoginSingup = () => {

  //mount with back end
    const [state,setState] = useState("Login");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
  //api
    const [formData,setFormData] = useState({
      username:"",
      password:"",
      email:""
    })
    const changeHandler = (e)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

  const login = async()=>{
    console.log("Login Function Executed",formData);
    let responsData;
    const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-webapp-backend.onrender.com'
        : 'http://localhost:4000';
        
    await fetch(`${backendUrl}/login`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responsData=data);

    if(responsData.success){
      localStorage.setItem('auth-token',responsData.token);
      window.location.replace("/");
    }
    else{
      alert(responsData.errors)
    }
  }
  const signup = async()=>{
    console.log("Signup Function Executed",formData);
    let responsData;
    const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ferniture-webapp-backend.onrender.com'
        : 'http://localhost:4000';
        
    await fetch(`${backendUrl}/signup`,{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responsData=data)

    if(responsData.success){
      localStorage.setItem('auth-token',responsData.token);
      window.location.replace("/");
    }
    else{
      alert(responsData.errors)
    }

  }

  //forntend

  return (
    <div className='loginsignup'>
      <div className={`loginsignup-container ${state === 'Login' ? 'login-mode' : ''}`}>
        <div className="login-header">
          <h1>{state}</h1>
          <p className="welcome-text">Welcome! Please enter your details</p>
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
          <button onClick={()=>{state==='Login'?login():signup()}}>Continue</button>
          
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