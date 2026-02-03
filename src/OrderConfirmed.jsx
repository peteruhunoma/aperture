import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './auth';
import moment from 'moment';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useHistory, useLocation} from 'react-router-dom/cjs/react-router-dom.min';

function OrderComfirmed() {
  const [orderNumber, setOrderNumber] = useState("");
  const [carts, setCarts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingPrice, setShippingPrice] = useState("");
  const [tax, setTax] = useState(10);
  const [total, setTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState({});
  const {currentuser, oldShippingAddress} = useContext(AuthContext);
  const [arrivalDate, setArrivalDate] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Load order number first, then other data
    const loadData = async () => {
      await getOrderNumber(); // Wait for order number
    };
    loadData();
    
  }, []);

  
  const notifictions = async () => {
    setIsLoading(true);
    try{
      const res = await axios.post('http://localhost:3000/posts/notifications', {orderNumber, arrivalDate}, {
      withCredentials: true
        });
         

        
    }catch(err){

      console.log(err);
    }
  }

  const ShoppingCart = async () => {
    console.log(orderNumber);
  
      try {
        const res = await axios.get("http://localhost:3000/posts/getcartsafterpurchase", {
          params :{orderNumber},
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
   }
   };

   const Continue = () => {
      localStorage.removeItem("confirmed");
      history.push('/');     
   }

   const getOrderNumber = async () => {
    try {
      const res = await axios.get("http://localhost:3000/posts/getordernumber", {
        withCredentials: true
      });
      setOrderNumber(res.data[0].orderNumber);
      const arrivalTime = moment(res.data[0].paid_at);
      setArrivalDate(res.data[0].paid_at)
      const DayOneDate = arrivalTime.clone().add(2, 'days');
const DayTwoDate = arrivalTime.clone().add(4, 'days');
const ExpDate = arrivalTime.clone().add(1, 'day');

setDate({
  month: arrivalTime.format('MMMM'), 
  year: arrivalTime.format('YYYY'), 
  DayOne: arrivalTime.format('D'), 
  estimatedDay: DayOneDate.format('dddd'),
  DayTwo: DayTwoDate.format('D'),
  estimatedDayTwo: DayTwoDate.format('dddd'), 
  ExpDayone: arrivalTime.format('DD'), 
  ExpDate: ExpDate.format('YYYY-MM-DD'), 
  ExpDayTwo: ExpDate.format('D') 
});
    } catch (err) {
      console.log(err);
      if(err.response.data){
        history.push("/login");
      }
    } 
  };

  useEffect(() => {
    // Load order number first, then other data
    const loadData = async () => {
      await getOrderNumber(); // Wait for order number
    };
    loadData();
    
  }, []);
   useEffect(() => {
    if (orderNumber) {
    
      ShoppingCart();
      ShippingPrice();
      ShippingInfo();
      localStorage.setItem("orderconfirmed", "ordered");
      notifictions();
      setIsLoading(true);
      
    } else if (orderNumber === 0) {
      setIsLoading(false);
      if(isLoading === false){
        history.push("/");

      }
    }
    

     
  }, [orderNumber]);
  return (
<div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
 
{isLoading ? <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div className="layout-container flex h-full grow flex-col">
{/* <!-- Header --> */}
<Header/>
<main className="flex flex-1 justify-center py-5 sm:py-10 px-4">
<div className="layout-content-container flex flex-col w-full max-w-3xl flex-1 gap-8">
{/* <!-- Confirmation Banner --> */}
<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-accent/20 dark:bg-accent/30 p-6 rounded-xl border border-accent">
<div className="flex items-center justify-center size-16 rounded-full bg-accent text-white shrink-0">
<span className="material-symbols-outlined text-4xl">check</span>
</div>
<div className="text-center sm:text-left">
<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-light dark:text-white">Thank you for your order, {currentuser.fullName.split(" ")[0]}</h1>
<p className="text-base text-text-muted-light dark:text-text-muted-dark mt-1">A confirmation email has been sent. You can also check your notification page.</p>
</div>
</div>
{/* <!-- Order Number Card --> */} 
<div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 text-center">
<p className="text-text-muted-light dark:text-text-muted-dark text-sm">Your Order Number is</p>
<p className="text-2xl font-bold text-primary dark:text-accent tracking-wider mt-1">#{orderNumber}</p>
</div>
{/* <!-- Delivery Details --> */}
<div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark">
<div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark">
<h3 className="text-lg font-bold tracking-[-0.015em]">Delivery Details</h3>
</div>
<div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-accent text-2xl mt-0.5">calendar_month</span>
<div>
<p className="text-base font-medium leading-normal">Estimated Arrival</p>
<p className="text-accent text-sm font-bold leading-normal">{shippingPrice === 5 ? `${date.month} ${date.DayOne} - ${date.DayTwo}, ${date.year}`: `${date.month} ${date.ExpDayone} - ${date.ExpDayTwo}, ${date.year}`}</p>
</div>
</div>
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-2xl mt-0.5">home</span>
<div>
<p className="text-base font-medium leading-normal">Shipping To</p>
<p className="text-text-muted-light dark:text-text-muted-dark text-sm leading-normal">{shippingInfo.address}<br/>{shippingInfo.city}, {shippingInfo.country}, {shippingInfo.postalCode}</p>
</div>
</div>
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-2xl mt-0.5">local_shipping</span>
<div>
<p className="text-base font-medium leading-normal">Shipping Method</p>
<p className="text-text-muted-light dark:text-text-muted-dark text-sm leading-normal">{ shippingPrice === 5 ? "Standard shipping" : "Express shipping" }</p>
</div>
</div>
</div>
</div>
{/* <!-- Order Summary --> */}
<div className="bg-white dark:bg-neutral-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark">
<div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark">
<h3 className="text-lg font-bold tracking-[-0.015em]">Order Summary</h3>
</div>
<div className="p-6 space-y-4">
{/* <!-- Product Item --> */}
{carts.map(items =>(

<div className="flex items-center gap-4"key={items.product_id}>
<img className="size-16 rounded-lg object-cover bg-neutral-light dark:bg-neutral-dark" data-alt="Close up of a modern digital camera lens" src={`../public/${items.username}/${items.ProductName}/${items.media}`}/>
<div className="flex-grow">
<p className="font-medium">{items.ProductName}</p>
<p className="text-sm text-text-muted-light dark:text-text-muted-dark">Quantity:{items.quantity}</p>
</div>
<p className="font-medium">${items.Price}</p>
</div>
))}

</div>
<div className="p-6 border-t border-neutral-border-light dark:border-neutral-border-dark space-y-2 text-sm">
<div className="flex justify-between">
<p className="text-text-muted-light dark:text-text-muted-dark">Subtotal</p>
<p>${subtotal}</p>
</div>
<div className="flex justify-between">
<p className="text-text-muted-light dark:text-text-muted-dark">Shipping</p>
<p>${shippingPrice}</p>
</div>
<div className="flex justify-between">
<p className="text-text-muted-light dark:text-text-muted-dark">Taxes</p>
<p>${tax}</p>
</div>
<div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-border-light dark:border-neutral-border-dark mt-2">
<p>Total</p>
<p>${total}</p>
</div>
</div>
</div>
{/* <!-- Call to Action --> */}
<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
<button className="flex w-full sm:w-auto max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-blue text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] px-6 hover:opacity-90 transition-opacity" onClick={Continue}>Continue Shopping</button>
</div>
</div>
</main>
{/* <!-- Footer --> */}
<Footer/>
</div>
</div> : <div >loading...</div>
  }

</div>
  
  )
}

export default OrderComfirmed;