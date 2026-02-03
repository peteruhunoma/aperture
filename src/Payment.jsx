import React, {useState, useEffect, useContext } from 'react';
import { customAlphabet, nanoid } from 'nanoid';
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Header from "./Header";
import { AuthContext } from './auth';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Payment() {
  const [shippingInfo, setShippingInfo] = useState([]);
  const [shippingPrice, setShippingPrice] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [carts, setCarts] = useState([]);
  const [subtotal, setSubtotal] = useState([]);
  const history = useHistory();
  const [tax, setTax] = useState(10);
  const [total, setTotal] = useState(0)
  const {currentuser, oldShippingAddress, removeShippingAddress} = useContext(AuthContext);
  const [navigation, setNavigation] = useState(() => localStorage.getItem('checkout'));
  const [purchased, setPurchased] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
const generateUniqueId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000); 
  
  const combined = timestamp.toString() + random.toString();
  const safeId = Number(combined.slice(-9)); 
  
  return safeId; 
};

setOrderId(generateUniqueId());
  if(navigation !== "shippingAddress"){
    history.push("/");
  }



   ShippingInfo();
   ShoppingCart();
   ShippingPrice();
   setLoading(false)

  
  }, [navigation, history]); 
   

  const handleCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted)
  };

  const handleExp = e => {
    const digits = e.target.value.replace(/\D/g, '');
    const formatted = digits.length >= 2
                      ? digits.slice(0,2)+'/'+digits.slice(2,4)
                      : digits;
    setExpiration(formatted);
  };
  
  const ShoppingCart = async () => {
    try {
      
      const res = await axios.get("http://localhost:3000/posts/carts", {
        withCredentials: true
      });
      
      setCarts(res.data.items);
      setSubtotal(res.data.subtotal);
    } catch (err) {
      console.log(err);
      
    } 
  };

  const ShippingPrice = async () => {
    try {
      
      const res = await axios.get("http://localhost:3000/posts/shippingprice", {
        withCredentials: true
      });
      setShippingPrice(res.data[0].shipping_price);
      setTotal(res.data[0].price);
    } catch (err) {
      console.log(err);
    } 
  };

  const ShippingInfo = async () => {
  
   try{
    const res = await axios.get("http://localhost:3000/posts/getshippinginfo",{
      withCredentials: true
    });
    
    if(oldShippingAddress?.length > 0){
      setShippingInfo(oldShippingAddress[0]);

    }else{   
      setShippingInfo(res.data.newaddress);
    }
    
  }catch(err){
    console.log(err);
    if(err?.response?.status === 401){
      localStorage.setItem('navigation', 'payment');             

      history.push("/login");
    }
    
    
    
  }
  }


  const purchaseStatus = async () => {
    try{
      const response = await axios.put("http://localhost:3000/posts/productstatus", {purchased, orderId},{
          withCredentials:true
        });
        if(response?.status === 200){
            localStorage.removeItem('checkout');
            localStorage.setItem('confirmed', 'paided');
            history.push("/orderconfirmed");
        }
    }catch(err){
      console.log(err);
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      
      const res = await axios.put("http://localhost:3000/posts/addpayment", {cardNumber, expiration, cvc, cardholderName, orderId }, {
        withCredentials: true,
      });
      res;
      
      if(res?.status === 200){
        purchaseStatus();
      }
      
      
      console.log(res)
    } catch (err) {
      console.log(err);
      if(err?.response?.status === 401){
         localStorage.setItem('navigation', 'payment');             
        history.push("/login")
      }
    } 
  };
 
  return (<>
  {loading ? "loading" :
<div className="bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark antialiased min-h-screen flex flex-col transition-colors duration-200">
 <Header/>
<main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
<nav aria-label="Breadcrumb" className="flex mb-8">
<ol className="flex items-center space-x-2">
<li>
<Link className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium" to="/">Home</Link>
</li>
<li>
<span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
</li>
<li>
<Link className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium" to="/shoppingcart">Cart</Link>
</li>
<li>
<span className="text-gray-400 dark:text-gray-500 mx-2">/</span>
</li>
<li>
<span aria-current="page" className="text-gray-900 dark:text-white text-sm font-semibold">Checkout</span>
</li>
</ol>
</nav>
<div className="flex flex-col lg:flex-row gap-8 items-start">
<div className="w-full lg:w-2/3 space-y-6">
<div className="flex justify-between items-center mb-2">
<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
<div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-green-800">
<span className="material-icons-outlined text-sm mr-1.5">lock</span>
                        Secure SSL Encryption
                    </div>
</div>
<div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
<div className="flex justify-between items-center mb-4">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Information</h2>
<button className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-blue-400">Edit</button>
</div>
<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-border-light dark:border-border-dark flex items-start gap-4">
<div className="bg-white dark:bg-gray-700 p-2.5 rounded-full flex-shrink-0 shadow-sm">
<span className="material-icons-outlined text-gray-500 dark:text-gray-300">location_on</span>
</div>
<div>
<h3 className="text-base font-semibold text-gray-900 dark:text-white">{shippingInfo.firstName}</h3>
<p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{shippingInfo.address}</p>
<p className="text-sm text-gray-600 dark:text-gray-300">{shippingInfo.city}, {shippingInfo.postalCode}</p>
<p className="text-sm text-gray-600 dark:text-gray-300 mt-2">+1 (555) 123-4567</p>
</div>
</div>
</div>
<div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Method</h2>
<div className="space-y-5">
<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Card Number</label>
<div className="relative">
<input className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm" autoComplete="cc-number" inputMode="numeric" value={cardNumber} maxLength={19} placeholder="0000 0000 0000 0000" type="text" onChange={handleCardNumber}/>
<div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2 pointer-events-none">
<div className="h-5 w-8 bg-gray-300 dark:bg-gray-600 rounded-sm overflow-hidden flex items-center justify-center">
<div className="w-2 h-2 rounded-full bg-gray-500/50 mr-[-2px]"></div>
<div className="w-2 h-2 rounded-full bg-gray-500/50"></div>
</div>
<div className="h-5 w-8 bg-gray-200 dark:bg-gray-500 rounded-sm"></div>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-5">
<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expiration</label>
<input className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm" placeholder="MM / YY" type="text" inputMode="numeric" maxLength={5} value={expiration}  autoComplete="cc-exp" onChange={handleExp}/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CVC</label>
<div className="relative">
<input className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm" placeholder="123" type="text" maxLength={3} onChange={(e) => setCvc(e.target.value)}/>
<div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
<span className="material-icons-outlined text-gray-400 text-lg">help_outline</span>
</div>
</div>
</div>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cardholder Name</label>
<input className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm" placeholder="Full Name on Card" type="text"  onChange={(e) => setCardholderName(e.target.value)}/>
</div>
</div>
</div>
</div>
<div className="w-full lg:w-1/3">
<div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 sticky top-24">
<h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>
<div className="order-summary-scroll max-h-[300px] overflow-y-auto pr-2 space-y-6 mb-6">

{carts.map(items=> (  
<div className="flex gap-4" key={items.product_id}>
<div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 border border-border-light dark:border-border-dark p-2">
<img alt="Black leather boot" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" src={`../public/${items.username}/${items.ProductName}/${items.media}`}/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="text-sm font-semibold text-gray-900 dark:text-white">{items.ProductName}</h3>
<span className="text-sm font-bold text-gray-900 dark:text-white">${items.Price}</span>
</div>
<div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300">Quantity: {items.quantity}</div>
</div>
</div>
))}
</div>
<div className="flex gap-2 mb-6">
<input className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:ring-primary focus:border-primary" placeholder="Discount code" type="text"/>
<button className="bg-gray-900 dark:bg-gray-700 text-white dark:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors">
                            Apply
                        </button>
</div>
<div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
<span>Subtotal</span>
<span className="font-medium text-gray-900 dark:text-gray-200">${subtotal}</span>
</div>
<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
<span>Shipping</span>
<span className="font-medium text-gray-900 dark:text-gray-200">${shippingPrice}</span>
</div>
<div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
<span>Tax</span>
<span className="font-medium text-gray-900 dark:text-gray-200">${tax}</span>
</div>
</div>
<div className="flex justify-between items-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
<div>
<span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
</div>
<span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">${total}</span>
</div>
<button className="w-full mt-6 bg-primary hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition duration-200 flex justify-between items-center group" onClick={handlePayment}>
<span className="text-lg">Complete Purchase</span>
<div className="bg-white/20 p-1 rounded-md group-hover:translate-x-1 transition-transform">
<span className="material-icons-outlined text-sm">arrow_forward</span>
</div>
</button>
</div>
</div>
</div>
</main>
<footer className="mt-auto py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-border-light dark:border-border-dark bg-white dark:bg-gray-900">
<p>© 2024 ShoeStore. All rights reserved.</p>
</footer>

</div>}
</>
  );
}

export default Payment;