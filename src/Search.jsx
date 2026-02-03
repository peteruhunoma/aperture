import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from "./Header"
const Search = () => {

  const location = useLocation();
  const history = useHistory();
  const [cartTotal, setCartTotal] = useState("");
  const [added, setAdded] = useState([]);
  const pathParts = location.pathname.split("/");
  const urlQuery = decodeURIComponent(pathParts[2] || ''); 
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Newest Arrivals');
  const [email, setEmail] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    currentPage: 1
  });

  useEffect(() => {
    const newQuery = decodeURIComponent(pathParts[2] || '');
    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
      setPagination(prev => ({ ...prev, offset: 0, currentPage: 1 }));
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, sortBy, pagination.offset]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        q:  searchQuery,
        limit: pagination.limit,
        offset: pagination.offset
      };

      const response = await axios.get('http://localhost:3000/posts/search', { params });

      if (response.data.success) {
        let sortedProducts = [...response.data.data];
        
        // Apply sorting
        switch (sortBy) {
          case 'Price: Low to High':
            sortedProducts.sort((a, b) => a.Price - b.Price);
            break;
          case 'Price: High to Low':
            sortedProducts.sort((a, b) => b.Price - a.Price);
            break;
          case 'Most Popular':
            sortedProducts.sort((a, b) => b.stock - a.stock);
            break;
          default: // Newest Arrivals
            sortedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        setProducts(sortedProducts);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total
        }));
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, offset: 0, currentPage: 1 }));
  };

  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    setPagination(prev => ({ ...prev, offset: 0, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    const newOffset = (page - 1) * pagination.limit;
    setPagination(prev => ({ ...prev, offset: newOffset, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating = 4) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="material-symbols-outlined text-yellow-400" style={{ fontSize: '16px' }}>
        {i < Math.floor(rating) ? 'star' : 'star_outline'}
      </span>
    ));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startResult = pagination.offset + 1;
  const endResult = Math.min(pagination.offset + pagination.limit, pagination.total);


  const addToCart = async ( productId) => {
    
    console.log(productId);
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

  const details = (items) => {
      history.push(`/productdetails/${items.id}`);

  }
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0d131b] dark:text-slate-100 font-display transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      
       <Header refreshCartTotal={cartTotal} search={searchQuery} changed={handleSearchChange} />

        <main className="flex-1 px-4 md:px-10 lg:px-40 py-8">
           

          <div className="flex flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-[#0d131b] dark:text-white">Search Results</h1>
                  <p className="text-sm text-[#4c6c9a] dark:text-slate-400 font-medium mt-1">
                    {loading ? 'Loading...' : `Showing ${startResult}-${endResult} of ${pagination.total} results`}
                  </p>
                </div>
 
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8">
                  {error}
                </div>
              )}

              {loading && products.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-slate-500">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-slate-500">No products found</p>
                  <p className="text-sm text-slate-400 mt-2">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <div key={product.id} onClick={() => details(product)} className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#e7ecf3] dark:border-slate-800">
                      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={product.ProductName}
                          src={product.Media || 'https://via.placeholder.com/400?text=No+Image'}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=No+Image';
                          }}
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-sm">favorite</span>
                        </button>
                        {product.status === 'active' && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-primary">
                            Active
                          </div>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-red-500">
                            Out of Stock
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-black/60 to-transparent">
                          <button className="w-full bg-primary text-white py-2 rounded-lg font-bold text-sm" onClick={(e) =>{
                            e.stopPropagation();
                            addToCart(product.id);
                          }}>{added.includes(product.id) ? 'Added to Cart' : 'Quick Add'}</button>
                        </div>
                      </div>
                      <div className="p-5">
                         
                        <h3 className="font-bold text-[#0d131b] dark:text-white mb-1">{product.ProductName}</h3>
                        <p className="text-sm text-slate-500 mb-3">{product.Category}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-bold text-lg">${parseFloat(product.Price).toFixed(2)}</span>
                          </div>
                          {product.stock > 0 && (
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">In Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center justify-center h-10 w-10 rounded-lg border border-[#e7ecf3] dark:border-slate-800 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-10 w-10 rounded-lg font-bold ${
                          pagination.currentPage === pageNum 
                            ? 'bg-primary text-white' 
                            : 'border border-[#e7ecf3] dark:border-slate-800 hover:bg-primary/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <button 
                        onClick={() => handlePageChange(totalPages)}
                        className="h-10 w-10 rounded-lg border border-[#e7ecf3] dark:border-slate-800 hover:bg-primary/10 font-bold"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button 
                    onClick={() => handlePageChange(Math.min(totalPages, pagination.currentPage + 1))}
                    disabled={pagination.currentPage === totalPages}
                    className="flex items-center justify-center h-10 w-10 rounded-lg border border-[#e7ecf3] dark:border-slate-800 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

         
      </div>
    </div>
  );
};

export default Search;