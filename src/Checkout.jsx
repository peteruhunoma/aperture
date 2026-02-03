import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from './auth';

function Checkout() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [estimatedTax, setEstimatedTax] = useState(10.00);
  const [country, setCountry] = useState("");
  const [carts, setCarts] = useState([]); 
  const [shippingPrice, setShippingPrice] = useState(5.00); 
  const {handleShippingAddress} = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const [oldShippingAddress, setOldShippingAddress] = useState([]);
  const {removeShippingAddress} = useContext(AuthContext);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutIsLoading, setCheckoutIsLoading] = useState(false);
  

  useEffect(() => { 
    if(checked === false){
      setOldShippingAddress([]);
      localStorage.removeItem('oldShippingAddress');
      removeShippingAddress();
    }
  }, [checked, removeShippingAddress])
  
  function save() {
    return Promise.resolve({ status: 200 });
  }

  const handleChange = async (e) => {
    const isNowChecked = e.target.checked;   
    setChecked(isNowChecked);
    setStatus(isNowChecked);
    console.log(status);
    const address = await handleShippingAddress();
    setOldShippingAddress(address);   
    if(isNowChecked === false){
      setOldShippingAddress([]);
    }
    setLoading(false);
  };

  const history = useHistory();
  useEffect(() => {
    console.log(subtotal);
    setGrandTotal(parseFloat(Number(subtotal) + Number(estimatedTax) + Number(shippingPrice)));
    ShoppingCart();
  }, [subtotal, estimatedTax, shippingPrice]);


  const addPrice = async () => {
    try {
      
      const res = await axios.post("http://localhost:3000/posts/addprice",{grandTotal, shippingPrice}, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        withCredentials: true,
      });
      res;
      localStorage.setItem('checkout', 'shippingAddress');           
      setCheckoutIsLoading(false);
      
    } catch (err) {
      console.log(err);
    } 
  };

  const handleShippingInfo = async (e) => {
    e.preventDefault();
    setCheckoutIsLoading(true);
    if(oldShippingAddress?.length > 0){
      if(oldShippingAddress?.length > 0){
      addPrice();
      await new Promise(r => setTimeout(r, 2000));
      setCheckoutIsLoading(false);
      history.push("/payment");


    }else{
      return
    }
  }else{
    try{
      const res = await axios.post("http://localhost:3000/posts/shippinginfo", { firstName, lastName, address, city, postalCode, country }, {
      method:"POST",
      headers:{"Content-Type" : "application/json"},
      withCredentials: true
      });
      

      if(res.data.message ===  "Shipping info saved"){

        addPrice();
        await new Promise(r => setTimeout(r, 3000));
        history.push("/payment");
      }
    
     }catch(err){
        console.log(err);
        if(err?.response?.status === 401){
          localStorage.setItem('checkoutAuth', 'login');           
          history.push("/login");
        }
       }finally{
        setCheckoutIsLoading(false);
       }
  }

  

    
  }

  const handleShippingChange = (e) =>{
    setShippingPrice(Number(e.target.value));
  } 
 
 

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

 


  
  return (
<div className="bg-gray-100 dark:bg-background-dark font-sans antialiased text-gray-900 dark:text-text-main-dark min-h-screen flex flex-col">
<main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-text-main-dark mb-10 tracking-tight">Checkout</h1>
    <div className="flex justify-center items-center space-x-8 sm:space-x-12 text-sm sm:text-base">
      <div className="flex items-center gap-2 text-accent-green font-semibold text-emerald-600">
        <span className="material-symbols-outlined text-2xl fill-1">local_shipping</span>
        <span>Shipping</span>
      </div>
      <div className="w-12 sm:w-20 h-0.5 bg-gray-300 dark:bg-border-dark"></div>
      <div className="flex items-center gap-2 text-accent-green font-semibold text-gray-500">
        <span className="material-symbols-outlined text-2xl">payment</span>
        <span>Payment</span>
      </div>
      <div className="w-12 sm:w-20 h-0.5 bg-gray-300 dark:bg-border-dark"></div>
      <div className="flex items-center gap-2 text-accent-green font-semibold text-gray-500">
        <span className="material-symbols-outlined text-2xl">check_circle</span>
        <span>Review</span>
      </div>
    </div>
  </div>

  
  <div className="grid md:grid-cols-2 md:gap-x-10 items-start justify-self-center">
    <form className=" md:col-span-1 md:w-1fr space-y-8 ">

      <div className="bg-white dark:bg-surface-dark shadow-md rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-border-dark">
        <h2 className="text-xl font-bold text-gray-900 dark:text-text-main-dark mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Shipping Information
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="first-name">First name</label>
              <input className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 shadow-input text-base placeholder-gray-500 transition-all duration-200 ease-in-out" onChange={(e) => setFirstName(e.target.value)} id="first-name" placeholder="John" type="text"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="last-name">Last name</label>
              <input className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 shadow-input text-base placeholder-gray-500 transition-all duration-200 ease-in-out" onChange={(e) => setLastName(e.target.value)} id="last-name" placeholder="Doe" type="text"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="address">Address</label>
            <input className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 shadow-input text-base placeholder-gray-500 transition-all duration-200 ease-in-out" onChange={(e) => setAddress(e.target.value)} id="address" placeholder="123 Main Street" type="text"/>
          </div>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="city">City</label>
              <input className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 shadow-input text-base placeholder-gray-500 transition-all duration-200 ease-in-out" onChange={(e) => setCity(e.target.value)} id="city" placeholder="Anytown" type="text"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="postal-code">Postal Code</label>
              <input className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 shadow-input text-base placeholder-gray-500 transition-all duration-200 ease-in-out" onChange={(e) => setPostalCode(e.target.value)} id="postal-code" placeholder="12345" type="text"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="country">Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary py-3 px-4 shadow-input text-base placeholder-gray-500 transition-all duration-200 ease-in-out cursor-pointer">
              <option value="" disabled>Choose a country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </select>
          </div>

          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          {status
  ? loading
    ? 'loading'
    : oldShippingAddress.length === 0
      ? <p className="text-red-500 mb-3">You don&apos;t have an old shipping address</p>
      : null
  : null}
            <div className="flex items-center">
                <input className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer" type="checkbox" checked={oldShippingAddress.length > 0} onChange={handleChange}/>
                <label className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none" for="billing-match">use old shipping address</label>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-surface-dark shadow-md rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-border-dark">
        <h2 className="text-xl font-bold text-gray-900 dark:text-text-main-dark mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">local_shipping</span>
          Shipping Method
        </h2>
        <div className="space-y-4">
          <label className="relative flex cursor-pointer rounded-lg border-2 border-primary bg-blue-50/50 p-5 shadow-sm transition-all hover:bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-blue-900/30">
            <input className="mt-1 h-5 w-5 border-gray-300 text-primary focus:ring-primary" onChange={handleShippingChange} checked={shippingPrice === 5} name="Shipping" type="radio" value="5" />
            <span className="ml-4 flex flex-1 flex-col">
              <span className="block text-base font-bold text-gray-900 dark:text-white">Standard Shipping</span>
              <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">4-6 business days</span>
            </span>
            <span className="mt-1 text-base font-bold text-gray-900 dark:text-white">$5</span>
          </label>
          <label className="relative flex cursor-pointer rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all hover:border-gray-400 dark:hover:border-gray-500">
            <input className="mt-1 h-5 w-5 border-gray-300 text-primary focus:ring-primary" onChange={handleShippingChange} checked={shippingPrice === 15} name="Shipping" type="radio" value="15" />
            <span className="ml-4 flex flex-1 flex-col">
              <span className="block text-base font-bold text-gray-900 dark:text-white">Express Shipping</span>
              <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">1-2 business days</span>
            </span>
            <span className="mt-1 text-base font-bold text-gray-900 dark:text-white">$15</span>
          </label>
        </div>
      </div>
    </form>
    <aside classNameName='grid md:col-span-1 mt-10 lg:mt-0 md:w-1fr w-full'>
        <div className="bg-white dark:bg-surface-dark shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-border-dark">
        <h2 className="text-xl font-bold text-gray-900 dark:text-text-main-dark mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">shopping_bag</span>
          Order Summary
        </h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-8">
          {carts.map(items => (
            <li className="flex py-5 first:pt-0" key={items.product_id}>
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50">
                <img alt="Red Nike running shoe" className="h-full w-full object-cover object-center" src={`../public/${items.username}/${items.ProductName}/${items.media}`}/>
              </div>
              <div className="ml-5 flex flex-1 flex-col justify-center">
                <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-white">
                  <h3>{items.ProductName}</h3>
                  <p>${items.Price}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Quantity: {items.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <form className="flex space-x-3">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <span className="material-symbols-outlined text-lg">sell</span>
              </span>
              <input className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary text-sm pl-10 pr-3 py-2.5" placeholder="Discount code" type="text"/>
            </div>
            <button className="rounded-lg bg-gray-900 dark:bg-blue-600 border border-transparent px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800 dark:hover:bg-blue-700 shadow-md transition-all active:scale-95" type="submit">Apply</button>
          </form>
        </div>

        <div className="space-y-4 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium">Subtotal</p>
            <p className="font-bold text-gray-900 dark:text-white">${subtotal}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium">Shipping</p>
            <p className="font-bold text-gray-900 dark:text-white">${shippingPrice}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium">Taxes</p>
            <p className="font-bold text-gray-900 dark:text-white">${estimatedTax}</p>
          </div>
          <div className="flex items-center justify-between border-t-2 border-gray-100 dark:border-gray-700 pt-6 mt-6">
            <p className="text-lg font-bold text-gray-900 dark:text-white">Total</p>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{grandTotal}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">USD</p>
            </div>
          </div>
        </div>
        </div>    
        <div className="flex items-center justify-between pt-6 mt-4">
        <Link className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors group" to="/shoppingcart">
          <span className="material-symbols-outlined text-xl mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Return to cart
        </Link>
        <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg font-bold text-base shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 transform active:scale-95" disabled={checkoutIsLoading} onClick={handleShippingInfo}>
        {checkoutIsLoading ? "loading" : "Continue to Payment"}  
        </button>
        </div>     
    </aside>
  </div>
</main>

<footer className="bg-gray-50 dark:bg-background-dark py-10 mt-auto border-t border-gray-200 dark:border-border-dark">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-text-sub-dark text-sm font-medium">
    <p>© 2023 Aperture. All Rights Reserved.</p>
  </div>
</footer>
</div>
  )
}

export default Checkout;