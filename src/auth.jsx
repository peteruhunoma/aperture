 import {createContext, useState, useEffect} from "react";
 import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
 import axios from "axios";

 export const AuthContext = createContext();

 export const AuthContextProvider = ({children}) => { 
    const [currentuser, setCurrentuser] = useState(JSON.parse(localStorage.getItem("user") || null));
    const [oldShippingAddress, setOldShippingAddress] = useState([]);
    const history = useHistory();
    const handleShippingAddress = async () => {
        try{
         
            const res = await axios.get("http://localhost:3000/posts/getshippinginfo",{
              withCredentials: true
            });
            const address = res.data.oldaddress;
            localStorage.setItem('oldShippingAddress', JSON.stringify(address));        
            setOldShippingAddress(address);
            return address;  
  
          }catch(err){
            console.log(err);
            if(err?.response?.status === 401){
            localStorage.setItem('checkoutAuth', 'login');           
              history.push("/login")
            }
             
          }
        
    }
    const removeShippingAddress = () => {
      setOldShippingAddress(null);
      localStorage.removeItem('oldShippingAddress');
    }
    const login = async (input) => {
        if (currentuser && currentuser.length) {
            setCurrentuser(null)
        };
      
        const res = await axios.post(
          'http://localhost:3000/api/auth/login',
          input,                       
          { withCredentials: true } 
        );
        setCurrentuser(res.data);
        return res;
      };
    const sellerLogin = async (input)=> {
        if (currentuser.length > 0){
            setCurrentuser(null);
        }
        const res = await axios.post("http://localhost:3000/api/sellerAuth/sellerLogin", input,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({input}),
            withCredentials: true,
        });
        
        setCurrentuser(res.data);

    }
    const logout = async () => {
      const res = await axios.post(
          "http://localhost:3000/api/auth/logout",
          {}, 
          {
              withCredentials: true 
          }
      );
      console.log(res);
      setCurrentuser(null);
  }
    useEffect (()=>{
        localStorage.setItem("user", JSON.stringify(currentuser));
    }, [currentuser])
    return(
         <AuthContext.Provider value={{currentuser, oldShippingAddress, removeShippingAddress, handleShippingAddress, login, sellerLogin, logout}} >
            {children}
        </AuthContext.Provider>
    );
    


 }
