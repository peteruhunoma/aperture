import React, {useState} from 'react';
import axios from "axios";
import moment from "moment";
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function Signup() {
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [fullName, setFullName] = useState("");
const [emailError, setEmailError] = useState("");
const [usernameError, setUsernameError] = useState("");
const [passwordError, setPasswordError] = useState("");
const [fullNameError, setFullNameError] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [confirmPasswordError, setConfirmPasswordError] = useState("");
const [passwordVisibility, setPasswordVisibility] = useState(false);
const [passwordText, setPasswordText] = useState("");
const history = useHistory();

let emailrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const handleValidation = ()=>{
  if (!email.trim()){
    setEmailError("email field is empty");
  }else if(!emailrex.test(email)){
    setEmailError("invaild email format");
  }else{
    setEmailError("");
  }
  if (!password.trim()){
    setPasswordError("password field is empty");
  } else if(password.length < 6 ){
    setPasswordError("password must be more than 8 characters");
  }else{
    setPasswordError("");
  }

  if (!confirmPassword.trim()){
    setConfirmPasswordError("confirm password field is empty");
  } else if(confirmPassword.length < 6 ){
    setConfirmPasswordError("password must be more than 8 characters");
  }else if ( confirmPassword !== password){
    setConfirmPasswordError("passwords must match");
  }else{
    setConfirmPasswordError("");
  }

  if (!fullName.trim()){
    setFullNameError("fullname field is empty");
  }else if(fullName.length > 30){
    setFullNameError("name has exceeded 30 character");
  }
  else{
    setFullNameError("");
  }
  if (!username.trim()){
    setUsernameError("username field is empty");
  }else if(username.length < 4  ){
    setUsernameError("username must be more than 3 character");
  }else{
    setUsernameError("");
  }
  
  

  
}

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

const handleSubmit = async (e)=> {
  e.preventDefault();
  if(!handleValidation()) {
    console.log("validation success");
  }
try{
  const res = await axios.post("http://localhost:3000/api/auth/register", {
    email, username, fullName, password, date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  }, {
  method: "POST",
  header: {"Content-Type":"application/json"},  
  withcredentials: true,
  });
  res;
  if(res.status === 200){
    history.push("/login");
  }
}catch(err){
  console.log(err);
  if(err.response.data === "username already exist"){
    setUsernameError("username already exist");
  }

  if(err.response.data === "email already exist"){
    setEmailError("email already exist");
  }
}
}

  return (
<div className="font-display">
<div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
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
<main className="flex flex-1 justify-center py-10 sm:py-20 px-4">
<div className="flex flex-col max-w-md w-full gap-8">
<div className="flex flex-col gap-3 text-center">
<p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">Create Your Aperture Account</p>
<p className="text-subtext-light dark:text-subtext-dark text-base font-normal leading-normal">Join us to get exclusive offers and a personalized shopping experience.</p>
</div>
<div className="flex flex-col gap-6">
<form onSubmit={handleSubmit} method="post">
<label className="flex flex-col w-full">
<p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Full Name</p>
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-subtext-light dark:placeholder:text-subtext-dark p-[15px] text-base font-normal leading-normal" placeholder="Enter your full name" onChange={e => setFullName(e.target.value)}/>
<br/>
<p className="text-red mt-2 mt-2">{fullNameError}</p>
</label>
<label className="flex flex-col w-full">
<p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Username</p>
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-subtext-light dark:placeholder:text-subtext-dark p-[15px] text-base font-normal leading-normal" placeholder="Enter your username" onChange={e => setUsername(e.target.value)}/>
<br/>
<p className='text-red mt-2 mt-2'>{usernameError}</p>
</label>
<label className="flex flex-col w-full">
<p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Email Address</p>
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-subtext-light dark:placeholder:text-subtext-dark p-[15px] text-base font-normal leading-normal" placeholder="Enter your email address" type="email" onChange={e => setEmail(e.target.value)}/>
<br/>
<p className='text-red mt-2 mt-2'>{emailError}</p>
</label>
<label className="flex flex-col w-full">
<p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">Password</p>
<div className="relative flex w-full flex-1 items-stretch">
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-subtext-light dark:placeholder:text-subtext-dark p-[15px] text-base font-normal leading-normal pr-12" placeholder="Create a password" id="password"  type={passwordText} onChange={e => setPassword(e.target.value)}/>
<button onClick={handleVisibility}  type="button" className="absolute inset-y-0 right-0 flex items-center pr-4 text-subtext-light dark:text-subtext-dark cursor-pointer">
<span className="material-symbols-outlined" data-icon="Eye">visibility</span>
</button>
<br/>
</div>
<p className="text-red mt-2 mt-2">{passwordError}</p>
</label>
<label className="flex flex-col w-full">
<p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">confirm password</p>
<div className="relative flex w-full flex-1 items-stretch">
<input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-blue/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-14 placeholder:text-subtext-light dark:placeholder:text-subtext-dark p-[15px] text-base font-normal leading-normal pr-12" placeholder="Create a password"  type={passwordText} onChange={e => setConfirmPassword(e.target.value)}/>
<button onClick={handleVisibility}  type="button" className="absolute inset-y-0 right-0 flex items-center pr-4 text-subtext-light dark:text-subtext-dark cursor-pointer">
<span className="material-symbols-outlined" data-icon="Eye">visibility</span>
</button>
</div>
<p className='text-red mt-2 mt-2'>{confirmPasswordError}</p>
</label>
<button className="flex min-w-[84px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-4 bg-blue text-white text-base font-bold leading-normal tracking-[0.015em] w-full mt-2" type='submit'>
<span className="truncate">Create Account</span>
</button>
</form>
</div>
 
<div className="flex flex-col gap-4 text-center">
<p className="text-sm text-subtext-light dark:text-subtext-dark">Already have an account? <Link className="font-bold text-blue hover:underline" to="/login">Log In</Link></p>
</div>

</div>
</main>
</div>
</div>
</div>  );
}

export default Signup;