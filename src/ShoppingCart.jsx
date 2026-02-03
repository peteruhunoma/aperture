import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

function ShoppingCart() {
   const [carts, setCarts] = useState([]); 
   const [subtotal, setSubtotal] = useState("");
   const [estimatedShipping, setEstimatedShipping] = useState(5.00);
   const [estimatedTax, setEstimatedTax] = useState(10.00);
   const [grandTotal, setGrandTotal] = useState("");
   const [cartQuantity, setCartQuantity] = useState(0);
   const [quantity, setQuantity] = useState(0);
   const [loading, setLoading] = useState(false);
   const [activeId, setActiveId] = useState(null);


   const handleShoppingCart = async () => {
     try {
       setLoading(true);
       const res = await axios.get("http://localhost:3000/posts/carts", {
         withCredentials: true
       });
       
       setCarts(res.data.items);
       setSubtotal(res.data.subtotal);
     } catch (err) {
       console.log(err);
     } finally {
       setLoading(false);
     }
   };

  
   
   const changeQty = async (item, newQty) => {
    setQuantity(newQty);                  
    try {
      await axios.post(
        'http://localhost:3000/posts/addtocart',
        { id:item.product_id, productId: item.product_id, quantity: newQty },
        { withCredentials: true }
      );
      handleShoppingCart();
    } catch (e) { console.error(e); }
  };
   
    
  const deleteCart = async (productId) => {
    try{
    const res = await axios.delete(`http://localhost:3000/posts/removecarts/${productId}`,{
      withCredentials:true
    });
    console.log(productId);
    res
    console.log(res);
    handleShoppingCart();
  }catch(err){
    console.log(err);
  }
 } 
    
   
  useEffect(()=>{

    handleShoppingCart();
    setGrandTotal( Number(subtotal)  + Number(estimatedTax) );
    
           
  }, [subtotal, estimatedTax]);
  
  
 
 
  return (
 
 <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-wrap gap-2 mb-8">
            <a className="text-primary/80 dark:text-primary/70 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">
              Home
            </a>
            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium leading-normal">/</span>
            <span className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Shopping Cart</span>
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
            <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
              Your Shopping Cart
            </p>
            <a className="text-primary hover:underline text-sm font-medium" href="#">
              Continue Shopping
            </a>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Items */}
              <div className="p-6 bg-white dark:bg-background-dark/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
                {/* Item 1 */}
                {carts.length === 0 ? ( 
                <div className='flex justify-center items-center'>you have nothing in your shopping cart</div> ) : ( 
                  carts.map(item => (

<div className="flex flex-col sm:flex-row gap-4 py-6 first:pt-0 last:pb-0" key={item.product_id} >
  <div className="flex items-start gap-4 flex-1">
    <div 
      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[80px] sm:size-[100px]" 
      data-alt="Vintage Film Camera in silver color" 
      style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoTilhEyHIMnYOP_j0mCZYObTYYu1vbuPlVezofSZyXMAq6xQAiFEZPg7D161bD-MTzwm07XWI_-kxT9nATf3EnTpPPJCLVy01VJp052VM0z8RLPeJgzHyWX-YtYL0-ikc4r3VDK1rNd42A9W-srxjuMOixAjcf82W2BIJ-Y5QoHiqtQDTb4UWu-SG-0kb_zrWfkKmnUTX6UqU-0Zj60_fe9KlpgFOTYpd6Z6gIVz8NHLceQTf_7_C_iH-RxLb5S0fDtfKxs3d8U14")'}}
    ></div>
    <div className="flex flex-1 flex-col justify-center gap-1">
      <p className="text-gray-900 dark:text-white text-base font-bold leading-normal">{item.ProductName}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">${item.Price}</p>
      <div className="flex items-center gap-2 text-sm mt-2">
        <button className="text-gray-600 hover:text-red dark:text-gray-400 dark:hover:text-primary font-medium" onClick={() => {
          
          const itemId = item.product_id;
          deleteCart(itemId)}}>
          Remove
        </button>
      </div>
    </div>
  </div>
  <div className="shrink-0 flex sm:flex-col items-center justify-between sm:justify-center gap-4">
    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
      <button className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors"  onClick={() => { const oldQty = item.product_id ? quantity : item.quantity; changeQty(item, oldQty - 1); }}>
        -
      </button>
      <input 
        className="text-base font-medium leading-normal w-10 p-0 text-center bg-transparent focus:outline-none focus:ring-0 focus:border-primary border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
        type="number" 
        value={activeId === item.product_id ? quantity : item.quantity}
         
        
      />
      <button className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors"  onClick={() => { const oldQty =  item.product_id ? quantity : item.quantity; changeQty(item, oldQty + 1); }}>
        +
      </button>
    </div>
    <p className="text-base font-bold text-gray-900 dark:text-white">${item.Price}</p>
  </div>
</div>


)) )}
                
                
                
                 
              </div>
              
              {/* Promo Code */}
              {carts.length > 0 ? <div className="p-6 bg-white dark:bg-background-dark/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Have a promo code?</h3>
                <div className="flex gap-2">
                  <input 
                    className="flex-grow rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary" 
                    placeholder="Enter promo code" 
                    type="text"
                  />
                  <button className="px-6 py-2 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 font-bold hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors">
                    Apply
                  </button>
                </div>
              </div> : ""}
              
            </div>
            
            {/* Order Summary */}
            {carts.length > 0 ? <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 bg-white dark:bg-background-dark/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{subtotal}</span>
                  </div>
                   
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Tax</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">${estimatedTax}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                    <span>Grand Total</span>
                    <span>${grandTotal}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                <Link className="no-underline" to="/checkout">
                  <button className="w-full bg-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">lock</span>
                    Proceed to Checkout
                  </button>
                </Link>
                </div>
                <div className="flex flex-col items-center justify-center pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Secure Payments</p>
                  <div className="flex items-center gap-3">
                    <img 
                      alt="Visa" 
                      className="h-6" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIHvtrw4A5T5IRfGZY9wI2eE4-_dz4fanJydn8SEVGdEc3WBB3vecdTa5oL2d2TgE_lznA-qdeh7-tae7JFlcRwQ0XZSTlRDftOJH_eqbbgOR-Z_KVWuYpHGdPpUuNyLkv4PP4pI_U1MUMgjCH5xO0GsqdqUBxSZSA7tcUzg4RSU4w8hkcqSFf3fFMLtYTHu3-TwYb46tOEIZnN5KmDFLawH7FFOaokM-SiAmszlxnz7PceX9ctVoJ9EBRaq2yLTlcfSCZG8NYXYAy"
                    />
                    <img 
                      alt="Mastercard" 
                      className="h-6" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgsm08SvJ1WXLV74i_ifTFYNMfHWII45JfTivDAGGhYHwsrjirtwaktqkQ8MSH2bBdYBXSeecZZOd0263NmR4ZLUofOnYsJFjltwevYRrt2LpP1ktbPplzSTj_w1ymkbEFIP3NXZ9WochRoSaM_wIt9RUynody62CvhF7hCeygpbMF4MagQ7kRh3V350-MzIm8XnF2EOhwm6E24aukojygxemsRpMgLeNrRzIS36DjjPho7Z0tq-MpfTHt2fpFxGYoAh1Su7jmijSy"
                    />
                    <img 
                      alt="PayPal" 
                      className="h-6" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa1FllcuooDzSBG599M1c4OtYDzGtv8krFbsI4mGaCCHCFNXOyCDiM--ThOTt9oYX9XdevVv0N72HCH8WAN_XlqlaHPtwTleqPXFDs7iBGGpfpuCf9k4Lc5bCZWkX74fjN3OgUIpwOVDz8c_MXU6nWhi7JzIb2RPZWu2coAMs57eA6seniakNfP8gWRdUKWb7CIJ5z_re2Y1BeIBBvwLzmmCMgIZDkt6Na9o7vzvKuReFC0qqgMAyMkGQ4CWn6Kazz-faeOccEg3Js"
                    />
                  </div>
                </div>
              </div>
            </div> : ""}
            
            
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default ShoppingCart;