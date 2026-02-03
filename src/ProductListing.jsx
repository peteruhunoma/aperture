import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function ProductListing() {
  const [categories, setCategories ] = useState([]);
  const [categoriesProduct, setCategoriesProduct ] = useState([]);
  const [u, i, cats] = useLocation().pathname.split("/");
  const [range, setRange] = useState(0);
  const [added, setAdded] = useState([]);
  const [activeCategory, setActiveCategory] = useState(cats || '');
  const [loading, setLoading] = useState(true);
 
  const max = 10000;
  const percentage = (range / max) * 100;
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const openPopUp  = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  useEffect(() => {
    getCategories();
    CategoriesProducts();
    setActiveCategory(cats);
    setLoading("false");
  }, [cats]); 
  
    useEffect(() => {
      if (categories.length && !cats) {
        setCategories();  
      }
    }, [categories]);

  const getCategories = async () => {
    try{
      const res = await axios.get('http://localhost:3000/posts/categories', {
      withCredentials: true
      })
      setCategories(res.data);

    }catch(err){
      console.log(err);
    }
    
  }


  const CategoriesProducts = async () => {
    try{
      const res = await axios.get(`http://localhost:3000/posts/categories/${cats}`, {
      withCredentials: true
      })
      setCategoriesProduct(res.data[0]);
    }catch(err){
      console.log(err);
    }
    
  }
  
 
 
  const handleCategoryNav = (navCats) => {
  
    setActiveCategory(navCats);
  
  };

  const addToCart = async (productId) => {
    const quantity = 1;
    try{
    const res = await axios.post("http://localhost:3000/posts/addtocart", { id : productId, productId, quantity},
    {
      withCredentials:true
    });
    res;
    setAdded(prev => [...prev, productId]);
    }catch(err){
      console.log(err, "error in cart");
    }
  }



  const details = (items) => {
    history.push(`/productdetails/${items.id}`);

}

  return (<>
{loading ? "loading" :<div className="font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Header />
      
      <main className="container mx-auto px-4 py-2">
      
        <div className="flex flex-col lg:flex-row gap-8">
          <aside id="popup" className={`lg:block lg:w-full lg:static lg:right-auto lg:bottom-auto lg:left-auto lg:bg-transparent lg:rounded-none lg:p-0 lg:shadow-none lg:transition-none lg:duration-0 lg:ease-linear lg:z-auto lg:h-auto lg:overflow-visible lg:w-1/4 xl:w-1/5  sm:fixed sm:bottom-0 sm:left-0 sm:right-0
              sm:bg-white sm:rounded-t-2xl sm:shadow-2xl
              sm:transform sm:transition-transform sm:duration-300 sm:ease-out
              sm:z-50
              sm:max-h-[75vh] 
              md:fixed md:bottom-0 md:left-0 md:right-0
              md:bg-white md:rounded-t-2xl md:shadow-2xl
              md:transform md:transition-transform md:duration-300 md:ease-out
              md:z-50
              md:max-h-[80vh]  md:overflow-y-auto md:py-2 md:px-4 scroll ${isOpen ? 'open' : 'close  lg:!block'}`}>
            <div className="sticky justify-center top-28 space-y-[6px]">
              {console.log(isOpen)}
              <div className="flex justify-between items-center lg:hidden">
                <h3 className='text-lg font-bold text-heading-light dark:text-heading-dark '>Filters</h3>
                <button className='p-2' id="popup-overlay" onClick={closePopup}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="border-b border-border-light dark:border-border-dark ">
                <h4 className="font-bold mb-2 text-heading-light dark:text-heading-dark">Category</h4>
                {categories.map(items => (
                <ul className="space-y-2 text-sm" key={items.id}>
                  <li><Link to={`/categories/${items.category}`} className={`hover:text-primary transition-colors ${activeCategory === items.category ? 'text-primary' : 'text-text-light dark:text-text-dark'}`}onClick={() => handleCategoryNav(items.category)}>{items.category}</Link></li>
                </ul>
                ))}

              </div>
              
              

              <div className="border-b border-border-light dark:border-border-dark  w-full">
      <h4 className="font-bold mb-4 text-heading-light dark:text-heading-dark">Price Range</h4>
      
      <div className="relative h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full">
        <div 
          className="absolute h-1 bg-primary rounded-full z-0" 
          style={{ width: `${percentage}%` }}
        ></div>

        <input 
          type="range" 
          min="0" 
          max={max} 
          step="1" 
          value={range} 
          onChange={(e) => setRange(e.target.value)}
          className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer z-10 custom-slider"
        />
      </div>

      <div className="flex justify-between text-sm mt-3 text-body-light dark:text-body-dark">
        <span>$0</span>
        <p className="font-medium">${range}</p>
        <span>$10,000</span>
      </div>
    </div>        
              
             
              
              <div className="flex flex-col gap-2 pt-4">
                <button className="w-full text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-accent/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Apply Filters
                </button>
                <button className="w-full text-text-light dark:text-text-dark bg-gray-200/60 dark:bg-gray-800/60 hover:bg-gray-300/60 dark:hover:bg-gray-700/60 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Clear All
                </button>
              </div>
            </div>
          </aside>
          
          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 text-sm mb-2">
                <Link className="hover:text-accent transition-colors" to="/">Home</Link>
                <span className="text-gray-400">/</span>
                <Link className="hover:text-accent transition-colors" to="/">Shop</Link>
                <span className="text-gray-400">/</span>
                <span className="text-heading-light dark:text-heading-dark font-medium">{cats}</span>
              </div>
              <h1 className="text-4xl font-black text-heading-light dark:text-heading-dark tracking-tight">
                Men's Jackets
              </h1>
            </div>
            
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Showing {categoriesProduct.length}</p>
              <div className="flex items-center gap-3">
                <button onClick={openPopUp} className="lg:hidden flex h-10 items-center gap-x-2 rounded-lg bg-primary text-white px-4">
                   <span className="material-symbols-outlined text-base">filter_list</span>
                   <p className="text-sm font-medium">Filters Category</p>
                </button>
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-gray-200/60 dark:bg-gray-800/60">
                  <button className="p-2 rounded-md bg-white dark:bg-gray-700 text-primary">
                    <span className="material-symbols-outlined">grid_view</span>
                  </button>
                  <button className="p-2 rounded-md text-gray-500 hover:bg-white dark:hover:bg-gray-700">
                    <span className="material-symbols-outlined">view_list</span>
                  </button>
                </div>
              </div>
            </div>
            
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
  {categoriesProduct.map((items) => (
    <div 
      key={items.id} 
      className="group  relative bg-white dark:bg-gray-900/50 rounded-lg overflow-hidden border border-border-light dark:border-border-dark transition-shadow hover:shadow-xl">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          alt={items.ProductName}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          src={`../public/${items.username}/${items.ProductName}/${items.Media.split(',')[0].trim()}`}
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-heading-light dark:text-heading-dark">{items.ProductName}</h3>
 
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{items.Category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-heading-light dark:text-heading-dark">${items.Price}</p>
                    <div className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-yellow-500 text-base">star</span>
                      <span className="material-symbols-outlined text-yellow-500 text-base">star</span>
                      <span className="material-symbols-outlined text-yellow-500 text-base">star</span>
                      <span className="material-symbols-outlined text-yellow-500 text-base">star</span>
                      <span className="material-symbols-outlined text-gray-400 text-base">star_half</span>
                    </div>
                  </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
         <button className="flex-1 text-primary dark:text-white bg-primary/20 dark:bg-white/20 hover:bg-primary/30 dark:hover:bg-white/30 font-bold rounded-lg text-sm px-4 py-2.5 text-center transition-colors" onClick={() => details(items)}>Quick View</button>
         <button className="flex-1 text-white bg-primary hover:bg-primary/90 font-bold rounded-lg text-sm px-4 py-2.5 text-center transition-colors" onClick={() => addToCart(items.id)}>Add to Cart</button>
      </div>
    </div>
  ))}
</div>
             
          </div>
        </div>
      </main>
      
      <Footer />
    </div>}</>
  );
}

export default ProductListing;