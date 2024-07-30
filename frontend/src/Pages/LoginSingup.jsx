import React, { useState } from 'react'
import './CSS/Loginsignup.css'


const LoginSingup = () => {

  //mount with back end
    const [state,setState] = useState("Login");
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
    await fetch('http://localhost:4000/login',{
      method:'POST',
      header:{
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
    await fetch('http://localhost:4000/signup',{
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
      <div className="loginsignup-container">
        {/* <h1>Sign up</h1> backend mount*/}
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        {/* backent apit */}
        <button onClick={()=>{state==='Login'?login():signup()}}>Continue</button>
        {state==="Sign up"?
          <p className='loginsignup-login'>Already have an account?
            <span onClick={()=>{setState("Login")}}> Login here</span>
          </p>
        :
          <p className='loginsignup-login'>Create an account
            <span onClick={()=>{setState("Sign up")}}> Click here</span>
          </p>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing,I agree to the terms of us & peivacy policy.</p>
        </div>
      </div>
        
    </div>
  )
}

export default LoginSingup