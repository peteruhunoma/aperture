import React, {useState, useEffect, useContext, useRef} from 'react';
import { Link, useParams, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import { AuthContext } from './auth';

const Header = ({refreshCartTotal, reload, search, changed }) => {
  const [cartTotal, setCartTotal] = useState("");
  const [internalSearch, setInternalSearch] = useState('');
  const {currentuser, logout} = useContext(AuthContext);
  const [cats, setCats] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const history = useHistory();
  const location = useLocation();



  useEffect(() => {
    if (search !== undefined) {
      setInternalSearch(search);
    }
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const getCategories = async () => {
    try{
      const res = await axios.get('http://localhost:3000/posts/categories', {
      withCredentials: true
      })
      setCats(res.data[0].category);

    }catch(err){
      console.log(err);
    }
    
  }
  const handleShoppingCart = async () => {
    try {
      
      const res = await axios.get("http://localhost:3000/posts/carts", {
        withCredentials: true
      });
      
      setCartTotal(res.data.items.length);
    } catch (err) {
      console.log(err);
    }
  };

  const img = async () => {
    try{
    const res = await axios.get("http://localhost:3000/api/auth/img",{
      withCredentials:true
    });
    setUserImage(res.data[0].userImage);
    console.log(res);
    }catch(err){
      console.log(err);
    }
    
  }
  const handleSearchChange = (e) => {
    setInternalSearch(e.target.value);
    if (changed) {
      changed(e);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (internalSearch && internalSearch.trim()) {
      history.push(`/search/${encodeURIComponent(internalSearch.trim())}`);
    }
  };

  useEffect(() => {
      if(reload !== ""){
        img();
      }
      img();
      handleShoppingCart();
      getCategories();
    
  }, [reload]);
  

  return (
<header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 mr-2 text-text-secondary-light dark:text-text-secondary-dark"
            >
              <span className="material-icons-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>

            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-primary w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs">A</div>
              <span className="font-bold text-lg tracking-tight">Aperture</span>
            </div>

            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Shop</Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors" to={`/categories/${cats}`}>Category</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <span className="material-icons-outlined text-text-secondary-light dark:text-text-secondary-dark text-lg">search</span>
             </div>
  <input 
value={internalSearch} 
onChange={handleSearchChange} 
    className="block w-64 pl-10 pr-3 py-1.5 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark sm:text-sm" 
    placeholder="Search products..." 
    type="search"
  />
</form>

            <div className="flex items-center gap-3">
              {currentuser ? (
                <div className="flex items-center gap-4">
                  <Link to="/notifications" className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
                    <span className="material-icons-outlined">notifications</span>
                  </Link>

                  <div className="relative hidden md:block" ref={profileRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-primary transition-colors"
                    >
                      <img className="h-8 w-8 rounded-full object-cover" src={userImage === "" ? '../public/uploadeduser/default.png'  : `../public/uploadeduser/${userImage}`}  />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md shadow-lg py-1 z-50">
                        <Link to="/uploadproduct" onClick={closeAll} className="block px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800">
                          Upload Product
                        </Link>
                        <button 
                          onClick={() => { 
                            logout(); 
                            closeAll();
                           }}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link className="text-sm font-medium hover:text-primary hidden sm:block" to="/login">Sign In</Link>
                  <Link className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded text-sm font-medium transition-colors" to="/signup">Create Account</Link>
                </div>
              )}

              <div className="relative p-1 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
                <Link to="/shoppingcart"><span className="material-icons-outlined">shopping_cart</span></Link>
                <span className="absolute top-0 right-0 -mr-1 -mt-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full">
                  {refreshCartTotal ? refreshCartTotal : cartTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-xl`}>
        <div className="px-4 pt-2 pb-6 space-y-4">
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center material-icons-outlined text-text-secondary-light text-lg">search</span>
            <input className="block w-full pl-10 pr-3 py-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-sm" placeholder="Search products..." type="search"/>
          </div>

          <nav className="flex flex-col space-y-1">
            <Link onClick={closeAll} className="block px-3 py-2 rounded-md text-base font-medium" to="/">Shop</Link>
            <Link onClick={closeAll} className="block px-3 py-2 rounded-md text-base font-medium" to={`/categories/${cats}`}>Category</Link>
            
            {currentuser && (
              <>
                <div className="border-t border-border-light dark:border-border-dark my-2 pt-2"></div>
                <Link onClick={closeAll} className="block px-3 py-2 text-base font-medium" to="/uploadproduct">Upload Product</Link>
                <button 
                  onClick={() => {
                     logout(); 
                     closeAll(); 
                    }} 
                  className="w-full text-left block px-3 py-2 text-base font-medium text-red-600"
                >
                  Log Out
                </button>
              </>
            )}
          </nav>

          {!currentuser && (
            <div className="pt-4 border-t border-border-light dark:border-border-dark flex flex-col gap-2">
              <Link onClick={closeAll} className="text-center py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-md" to="/login">Sign In</Link>
              <Link onClick={closeAll} className="text-center py-2 bg-primary text-white rounded-md text-sm font-medium" to="/register">Create Account</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;