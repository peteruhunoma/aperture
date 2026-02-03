import React, {useState, useEffect, useContext} from 'react';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from "axios";
import { AuthContext } from './auth';


function Buyer_Login() {
  const history = useHistory();
  const {login, currentuser} = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailOrUsernameError, setEmailOrUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordText, setPasswordText] = useState("");
  const [navigation, setNavigation] = useState(localStorage.getItem("navigation") || null);
  const [checkoutAuth, setCheckoutAuth] = useState(localStorage.getItem("checkoutAuth") || null)

  useEffect(() => {
     setPasswordText("password")
  }, [])
  
  const handleVisibility = ()=>{
  
    
    console.log(passwordVisibility === false)
      if (passwordVisibility === false){
          setPasswordText("text");
          setPasswordVisibility(true);
      }else if (passwordVisibility === true){
          setPasswordText("password");
          setPasswordVisibility(false);
      }
  }
 
const handleSubmit = async(e) =>{
  e.preventDefault();
   
try{

  const res = await login({emailOrUsername, password});
  res;
  if(res.status == 200){
    if(checkoutAuth === 'login'){
      localStorage.removeItem('checkoutAuth');
      history.push("/checkout");
      
    } else if (navigation === 'payment'){
      localStorage.removeItem('navigation');
      history.push("/payment");

    }else{
        history.push("/");
    }
    

  }
  
  
}catch(err){
console.log(err);
  if (err?.response?.data == "All fields are required") {
    setEmailOrUsernameError("email or username field is empty");
    setPasswordError("password field is empty");
  } else if (err?.response?.data == "Email or username is required") {
    setEmailOrUsernameError("email or username field is empty");
    setPasswordError(""); 
  } else if (err?.response?.data == "Password is required") {
    setPasswordError("password field is empty");
    setEmailOrUsernameError(""); 
  } else if (err?.response?.data == "invalid login information") {
    setEmailOrUsernameError("email or username invalid");
    setPasswordError(""); 
  } else if (err?.response?.data == "password is wrong") {
    setPasswordError("password is wrong");
    setEmailOrUsernameError(""); 
  } else {
    setEmailOrUsernameError("");
    setPasswordError("");
  }

  
}
  
}
  return (
<div className="fontmsu bg-background- dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
<div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
<header className="absolute top-0 flex w-full max-w-6xl items-center justify-center p-6 sm:justify-start">
<span className="flex items-center gap-3 text-[#0d121b] dark:text-white" >
<div className="size-6 text-blue">
<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
</svg>
</div>
<h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Aperture</h2>
</span>
</header>
<main className="flex w-full max-w-md flex-col items-center">
<div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-background-dark/50 sm:p-8">
<div className="mb-6 text-center">
<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Log in to your Aperture account to continue.</p>
</div>
<form className="flex flex-col gap-4" onSubmit={handleSubmit} method='post'>
<div className="flex flex-col">
<label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email or Username</label>
<input className="form-input h-11 w-full rounded-lg border border-gray-300 bg-background-light px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-2 focus:ring-blue/20 dark:border-gray-600 dark:bg-background-dark dark:text-white dark:placeholder:text-gray-500" id="email" placeholder="Enter your email or username" type="text" onChange={e => setEmailOrUsername(e.target.value)}/>
<p className='text-red mt-2 mb-2'>{emailOrUsernameError}</p>
</div>
<div className="flex flex-col">
<div className="flex items-center justify-between">
<label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
<a className="mb-2 text-xs font-medium text-blue hover:underline" href="#">Forgot Password?</a>
</div>
<div className="relative flex w-full items-center">
<input className="form-input h-11 w-full rounded-lg border border-gray-300 bg-background-light px-4 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue focus:ring-2 focus:ring-blue/20 dark:border-gray-600 dark:bg-background-dark dark:text-white dark:placeholder:text-gray-500" id="password" placeholder="Enter your password" type={passwordText} onChange={e => setPassword(e.target.value)}/>
<button className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" onClick={handleVisibility} type="button">
<span className="material-symbols-outlined" >visibility</span>
</button>
</div>
{passwordError && <p className='text-red mt-2 mb-2'>{passwordError}</p>}
</div>
<div className="flex items-center justify-between">
<div className="flex items-center">
<input className="h-4 w-4 rounded border-gray-300 bg-background-light text-blue focus:ring-blue dark:border-gray-600 dark:bg-background-dark dark:ring-offset-background-dark" id="remember-me" name="remember-me" type="checkbox"/>
<label className="ml-2 block text-sm text-gray-700 dark:text-gray-300" htmlFor="remember-me">Remember me</label>
</div>
</div>
<button className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-blue px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue/90" type="submit">
                        Log In
                    </button>
</form>
<div className="relative my-6 flex items-center">
<div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
<span className="mx-4 flex-shrink text-xs uppercase text-gray-500 dark:text-gray-400">Or continue with</span>
<div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
</div>
<div className="flex flex-col gap-3 sm:flex-row">
<button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-background-dark dark:text-white dark:hover:bg-background-dark/80">
<svg className="h-5 w-5 fontmsu"  viewBox="0 0 48 48">
<path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"></path><path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path><path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path><path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
</svg>
                    Google
                    </button>
<button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-background-dark dark:text-white dark:hover:bg-background-dark/80">
<svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89H8.078v-2.89h2.36V9.61c0-2.322 1.385-3.593 3.49-3.593.998 0 1.86.074 2.112.108v2.585h-1.52c-1.13 0-1.35.536-1.35 1.325v1.745h2.86l-.373 2.89h-2.487v7.008C18.343 21.128 22 16.991 22 12z"></path>
</svg>
                        Facebook
                    </button>
</div>
</div>
<p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                New to Aperture? <Link className="font-medium text-blue hover:underline" to="/signup">Create an account</Link>
</p>
</main>
</div>
</div>
  );
}

export default Buyer_Login;