import React, {useEffect, useState, useContext} from 'react';
import Header from './Header';
import axios from "axios";
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { AuthContext } from './auth';
import {Link, useHistory } from 'react-router-dom';
import CustomerReview from "./CustomerReview";

function ProductDetails() {
  const history = useHistory();
  const {currentuser} = useContext(AuthContext);
  console.log(currentuser)
  const [productDetails, setProductDetails] = useState([]);
  const [categoriesProduct, setCategoriesProduct ] = useState([]);
  const [nav, setNav] = useState(true);
  const params = useLocation();
  console.log(params);
  const [u, i, id] = useLocation().pathname.split("/");
  console.log(id, "id number");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    handleDetail(id);
    CategoriesProducts();
    cart();
    setLoading(false) 
    
  }, []);

  const decrement = () => {
    setQuantity(prev => Math.max(prev > 0 ? prev - 1 : 0));
  }

  const increment =  ()  =>  {
    setQuantity(prev => Math.max(prev  + 1));
  }

 

  const handleDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/${id}`, {
        withCredentials: true
      });
      
      setProductDetails(res.data);
      
    } catch (err) {
      console.log("Error fetching product details:", err);
      
       
    }
  };
  const addToCart = async () => {
    const productId = id;
    try{
    const res = await axios.post("http://localhost:3000/posts/addtocart", { id, productId, quantity},
    {
      withCredentials:true
    });
    res;
    }catch(err){
      console.log(err, "error in cart");
    }
  }
  const cart = async () => {
     const res = await axios.get("http://localhost:3000/posts/carts", {
      withCredentials:true
     });
     res;

  } 


  const CategoriesProducts = async () => {
    try{
      const response = await axios.get(`http://localhost:3000/posts/${id}`, {
        withCredentials: true
      });

      const res = await axios.get(`http://localhost:3000/posts/categories/${response.data.Category}`, {
      withCredentials: true
      })
      setCategoriesProduct(res.data[0]);
    }catch(err){
      console.log(err);
    }
    
  }

  const descriptionNavigate = () => {
    setNav(true);
  }
  const reviewNavigate = () => {
    setNav(false);
  }

  const truncateByWords = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };
  
 

  
  return (
  <>{loading ? "loading" : <div className="bg-background-light dark:bg-background-dark font-display text-[#212529] dark:text-gray-300">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          
          <main className="px-4 sm:px-10 lg:px-20 py-5">
            <div className="layout-content-container flex flex-col w-full max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 p-
              4">
                <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary" to="/">Home</Link>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary capitalize" to={`/${productDetails.Category}`}>{productDetails.Category}</Link>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm font-medium leading-normal capitalize">{productDetails.ProductName}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mt-6">
                <div className="flex flex-col gap-4">
                  <img  
                    className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl aspect-square min-h-80" 
                    data-alt="Aperture Model Pro lens shown from the front"
                    src={`../public/${productDetails.username}/${productDetails.ProductName}/${productDetails.media}`}
                  />
                
                  <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex items-stretch p-1 gap-3">
                      <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-24">
                        <img 
                          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col border-2 border-primary" 
                          data-alt="Aperture Model Pro lens side view"
                          src={`../public/${productDetails.username}/${productDetails.ProductName}/${productDetails.Media?.split(',')[1]?.trim()}`}
                        />
                      </div>
                      <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-24">
                        <img 
                          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col" 
                          data-alt="Aperture Model Pro lens top view"
                          src={`../public/${productDetails.username}/${productDetails.ProductName}/${productDetails.Media?.split(',')[2]?.trim()}`}
                        />
                      </div>
                      <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-24">
                        <img 
                          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col" 
                          data-alt="Close up of Aperture Model Pro lens glass"
                          src={`../public/${productDetails.username}/${productDetails.ProductName}/${productDetails.Media?.split(',')[3]?.trim()}`}
                        />
                      </div>
                      <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-24">
                        <img 
                          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col" 
                          data-alt="Aperture Model Pro lens in use on a camera body"
                          src={`../public/${productDetails.username}/${productDetails.ProductName}/${productDetails.Media?.split(',')[4]?.trim()}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6 py-4">
                  {/* Product Title */}
                  <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] capitalize">{productDetails.ProductName}</h1>
                  {console.log(productDetails, "productDeetails check")}
                  {/* Rating & Price */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                     
                    <p className="text-gray-900 dark:text-white text-3xl font-bold">${productDetails.Price}</p>
                  </div>

                  {/* Short Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{truncateByWords(productDetails.ProductDescription)}</p>
                  
                  <div className="h-px bg-gray-200 dark:bg-gray-800"></div>

                  {/* Customization Options */}
                  <div className="flex flex-col gap-6">
                  
                     
                  </div>

                  {/* Quantity & CTA */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700">
                      <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary" onClick={decrement}>-</button>
                      <input className="w-12 text-center border-0 bg-transparent focus:ring-0 text-gray-900 dark:text-gray-200" type="text" value={quantity} onChange={(e) => { const int = parseInt(e.target.value, 10); setQuantity(Number.isNaN(int) ? 0 : Math.max(int, 0));  }}
/>
                      <button className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"  onClick={increment}>+</button>
                    </div>
                    <button className="flex-1 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 py-3 sm:py-3 px-2" onClick={addToCart}>
  Add to Cart
</button>
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4">
                      <span className="material-symbols-outlined">favorite_border</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Info Section */}
              <div className="mt-16">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                    <span onClick={descriptionNavigate} className={`${nav ? "border-primary text-primary" : "border-transparent hover:border-gray-300 hover:text-gray-700 text-gray-500"}  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`} >Full Description</span>
                    <span onClick={reviewNavigate} className={` ${nav ? "border-transparent hover:border-gray-300 hover:text-gray-700 text-gray-500" : "border-primary text-primary"}   dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`} >Customer Reviews</span>
                  </nav>
                </div>
                <div className="py-8 prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                  <p className={`${nav ? "" : "hidden"}`}>{productDetails.ProductDescription}</p> 
                  <div className={`${nav ? "hidden" : ""}`}>
                    <CustomerReview  id={id}  productImage={productDetails.media} productTitle={productDetails.ProductName} category={productDetails.Category} username={productDetails.username} price={productDetails.Price} />                           
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You Might Also Like</h3>
<div className="flex flex-nowrap overflow-x-auto overscroll-x-contain gap-6 scroll-smooth scrollbar-hide pb-4">
  
  {categoriesProduct.map((items) => (
    <Link to={`/productDetails/${items.id}`} key={items.id}>
      <div 
      key={items.id} 
     onClick={()=> {window.location.href = `/productDetails/${items.id}`}} className={`min-w-[280px] md:min-w-[320px] flex flex-col gap-2 group ${items.ProductName === productDetails.ProductName ? "hidden" : ""}`}
    >
      <img 
        className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-xl bg-gray-100 dark:bg-gray-800" 
        src={`../public/${items.username}/${items.ProductName}/${items.Media?.split(',')[0]?.trim()}`} 
      />
      
      <div className="flex flex-col px-1">
        <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
          {items.ProductName}
        </p>
        <p className="font-medium text-gray-600 dark:text-gray-400">
          ${items.Price}
        </p>
      </div>
    </div>
     </Link>
  ))}

</div>



              </div>
            </div>
          </main>
        </div>
      </div>
    </div>}</>
  );
}

export default ProductDetails;