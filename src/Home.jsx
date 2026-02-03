import React, {useState, useEffect, useRef, useContext} from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import {useHistory, Link} from "react-router-dom"
import { AuthContext } from './auth.jsx';

function Home() {
  const [bestSeller, setBestSeller] = useState([]);
  const [added, setAdded] = useState([]);
  const [newArrival, setNewArrival] = useState([]);
  const [category, setCategory] = useState([]);
  const scrollRef = useRef(null);
  const CategoryScrollRef = useRef(null);
  const BestSellerScrollRef = useRef(null);
  const [cartTotal, setCartTotal] = useState("");
  const {currentuser} = useContext(AuthContext);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300, 
      behavior: "smooth",
    });
  }
    const CategoryScrollLeft = () => {  
    CategoryScrollRef.current.scrollBy({
      left: -300, 
      behavior: "smooth",
    });
  }
    const BestSellerScrollLeft = () => {  
    
    BestSellerScrollRef.current.scrollBy({
      left: -300, 
      behavior: "smooth",
    });
  };
  
  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  }

  const BestSellerScrollRight = () => {
    BestSellerScrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  }

  const CategoryScrollRight = () => {
    CategoryScrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };
  const history = useHistory();
  
  
  const productList = async ()=> {
    const res = await axios.get("http://localhost:3000/posts",{withCredentials:true});
    setBestSeller(res.data.bestSeller);
    setNewArrival(res.data.newArrival);
    setCategory(res.data.category);

  }
  
  const handleShoppingCart = async () => {
    try {
      
      const res = await axios.get("http://localhost:3000/posts/carts", {
        withCredentials: true
      });
      
      setCartTotal(res.data.items.length);
    } catch (err) {
      console.log(err);
    } finally {
    
    }
  };

  const addToCart = async (productId) => {
    console.log(productId);
    const quantity = 1;
    try{
    const res = await axios.post("http://localhost:3000/posts/addtocart", { id : productId, productId, quantity},
    {
      withCredentials:true
    });
    res;
    handleShoppingCart();
    setAdded(prev => [...prev, productId]);
    }catch(err){
      console.log(err, "error in cart");
    }
  }

   

  const details = (items) => {
      history.push(`/productdetails/${items.id}`);

  }

  const redirectToCategories = (items) => {
    history.push(`/categories/${items.category}`);

}
  

  useEffect(() => {
      productList();
  

  }, []);
     
     
     
     return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-gray-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header refreshCartTotal={cartTotal} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
              <section className="relative">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Shop by Category</h2>
                  </div>
                  
                  <div className="relative flex items-center">
                    <button onClick={CategoryScrollLeft} className="sm:hidden md:block lg:block  -ml-4 lg:-ml-6 w-20 h-10 flex items-center justify-center rounded-full shadow-md border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary dark:hover:text-primary transition-colors bg-surface-light dark:bg-surface-dark z-10" type="button">
                      <span className="material-icons-outlined text-xl">chevron_left</span>
                    </button>
                    <div ref={CategoryScrollRef} className="flex overflow-x-scroll overscroll-x-contain gap-4 scroll-smooth scrollbar-hide">

                        
                            {category.map(items=> (
                            
                            <div onClick={() => redirectToCategories(items)} className="min-w-[280px] group relative block aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800" key={items.id}>
                              <img alt="Men's Fashion" className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" src={`../public/${items.username}/${items.productName}/${items.media}`}/>
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                              <span className="text-white font-semibold text-lg">{items.ProductName}</span>
                            </div>
                            </div>
                            ))}
                      
                    </div>
                    <button onClick={CategoryScrollRight} className=" sm:hidden md:block lg:block -mr-4 lg:-mr-6 w-20 h-10 flex items-center justify-center rounded-full shadow-md border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary dark:hover:text-primary transition-colors bg-surface-light dark:bg-surface-dark z-10" type="button">
                      <span className="material-icons-outlined text-xl">chevron_right</span>
                     </button>
                  </div>
                  
                  
              </section>
              <section className="relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">New Arrivals</h2>
                
                   
                </div>
                
                <div className="relative group flex  items-center">
                    <button onClick={BestSellerScrollLeft} className="sm:hidden md:block lg:block text-primary -ml-4 lg:-ml-6 w-20 h-10 flex items-center justify-center rounded-full shadow-md border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary dark:hover:text-primary transition-colors bg-surface-light dark:bg-surface-dark z-10" type="button">
                      <span className="material-icons-outlined text-xl">chevron_left</span>
                    </button>
                    <div ref={BestSellerScrollRef} className=" flex overflow-x-scroll overscroll-x-contain gap-4 scroll-smooth scrollbar-hide">
                        {newArrival.map(items => (
                          <div key={items.id} className="min-w-[280px] bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-border-light dark:border-border-dark hover:shadow-md transition-shadow" >
                            <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative cursor-pointer" onClick={() => details(items)} >
                              <img alt="Denim Work Jacket" className="object-cover w-full h-full" src={`../public/${items.username}/${items.productName}/${items.media}`}/>
                            </div>

                            <div className="p-4">
                              <h3
                                className="font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
                                onClick={() => details(items)}
                              >
                                {items.productName}
                              </h3>

                              <p
                                className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 mb-3 cursor-pointer"
                                onClick={() => details(items)}
                              >
                                ${items.price}
                              </p>

                              <button
                                onClick={() => addToCart(items.id)}
                                className="w-full bg-blue-50 dark:bg-blue-900/20 text-primary hover:bg-primary hover:text-white py-2 rounded text-sm font-medium transition-colors"
                              >
                                {added.includes(items.id) ? 'Added to Cart' : 'Add to Cart'}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <button onClick={BestSellerScrollRight} className="sm:hidden md:block lg:block -mr-4 lg:-mr-6 w-20 h-10 flex items-center justify-center rounded-full shadow-md border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary dark:hover:text-primary transition-colors bg-surface-light dark:bg-surface-dark z-10" type="button">
                      <span className="material-icons-outlined text-xl">chevron_right</span>
                    </button>
                </div>
                
              </section>
              <section className="relative">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Best Sellers</h2>
                
                
                </div>
                  
                <div className="relative group flex  items-center ">
                  <button onClick={scrollLeft} className="sm:hidden md:block lg:block  -ml-4 lg:-ml-6 w-20 h-10 flex items-center justify-center rounded-full shadow-md border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary dark:hover:text-primary transition-colors bg-surface-light dark:bg-surface-dark z-10" type="button">
                   <span className="material-icons-outlined text-xl">chevron_left</span>
                  </button>
                  
                  <div ref={scrollRef} className="flex overflow-x-scroll overscroll-x-contain gap-4 scroll-smooth scrollbar-hide">
                      {bestSeller.map(items => (

                  <div className="min-w-[280px] bg-surface-light dark:bg-surface-dark rounded-lg overflow-hidden shadow-sm border border-border-light dark:border-border-dark hover:shadow-md transition-shadow"  key={items.id}>
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative" onClick={()=> {details(items)}}>
                        <img alt="Velocity Runner" className="object-cover w-full h-full" src={`../public/${items.username}/${items.productName}/${items.media}`}/>
                      </div>
                    <div className="p-4">
                    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark" onClick={()=> {details(items)}}>{items.productName}</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 mb-3" onClick={()=> {details(items)}}>${items.price}</p>
                    <button className="w-full bg-blue-50 dark:bg-blue-900/20 text-primary hover:bg-primary hover:text-white py-2 rounded text-sm font-medium transition-colors" onClick={(e)=>{
                      e.stopPropagation();
                      addToCart(items.id)
                    }}>{added.includes(items.id) ? 'Added to Cart' : 'Add to Cart'}</button>
                    </div>
                  </div>
                  ))}
                  </div>
                  
                  <button onClick={scrollRight} className="sm:hidden md:block lg:block -mr-4 lg:-mr-6 w-20 h-10 flex items-center justify-center rounded-full shadow-md border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary dark:hover:text-primary transition-colors bg-surface-light dark:bg-surface-dark z-10" type="button">
                   <span className="material-icons-outlined text-xl">chevron_right</span>
                  </button>
                  
                </div>
              </section>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;