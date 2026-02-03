import React,{useState, useEffect} from 'react';
import axios from "axios";
import {useHistory} from "react-router-dom";
import AddReview from './AddReview';
import moment from 'moment';

function CustomerReview({id,  category, username, productTitle, price, productImage}) {
  const [reviews, setReviews] = useState([]);
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(true);

const getReview = async () => { 
  try {
    const res = await axios.get(`http://localhost:3000/posts/getreview/${id}`, {
      withCredentials: true
    });
    
    setReviews(res.data.reviews);
    
  } catch (err) {
    console.log("Error fetching product details:", id, err);
  }
};

  const addReviewNav = async () => {
    setNav(true);
  }
  
  const closeNav = async () => {
    setNav(false);

  }



const calculateRatingStats = () => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      ratingPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const total = reviews.length;
  const sum = reviews.reduce((acc, review) => {
    const rating = Number(review.rating) || 0;
    return acc + (rating >= 1 && rating <= 5 ? rating : 0);
  }, 0);
  
  const averageRating = total > 0 ? sum / total : 0;
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    const rating = Math.round(Number(review.rating)) || 0;
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });
  
  const ratingPercentages = {};
  for (let i = 1; i <= 5; i++) {
    ratingPercentages[i] = total > 0 ? Math.round((distribution[i] / total) * 100) : 0;
  }
  
  return {
    averageRating,
    totalReviews: total,
    ratingDistribution: distribution,
    ratingPercentages
  };
};

const ratingStats = calculateRatingStats();



  useEffect(() => {
    getReview();
    setLoading(false)
}, []);
  return (
    <>
    {loading ? "loading" :
<div className="font-display">
  {/* Modal backdrop - keep as is */}
  <div 
    onClick={closeNav} 
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm ${nav ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
  >
    {/* Modal content */}
    <div 
    onClick={(e) => e.stopPropagation()} // This prevents click from bubbling up to backdrop
    className={`w-full bg-red-500 rounded-lg shadow-2xl 
               sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-2xl 
               max-h-[90vh] overflow-y-auto custom-scrollbar ${nav ? "block" : "block"}`}
  >
    <div className="p-4"> 
      <AddReview close={closeNav} refreshReviews={getReview} productImage={productImage} productTitle={productTitle} category={category} username={username} price={price} id={id} />
    </div>
  </div>
  </div>
  
  <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      <div className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="layout-content-container flex flex-col max-w-4xl flex-1">
          <div className="flex flex-wrap justify-center gap-3 p-4 text-center">
            <div className="flex w-full flex-col gap-3">
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">What Our Customers Say</p>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Here's what our valued customers have to say about their Aperture experience.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-12 gap-y-8 p-4 border-b border-slate-200 dark:border-slate-700 pb-8 mb-8">
            {/* Average Rating */}
            <div className="flex flex-col gap-2 items-center text-center">
              <p className="text-slate-900 dark:text-white text-5xl font-black leading-tight tracking-[-0.033em]">
                {ratingStats.averageRating.toFixed(1)}
              </p>
              <div className="flex gap-0.5">
  {[1, 2, 3, 4, 5].map((star) => {
    const filled = ratingStats.averageRating >= star;
    const halfFilled = ratingStats.averageRating >= star - 0.5 && ratingStats.averageRating < star;
    
    return (
      <span 
        key={star}
        className={`material-symbols-outlined ${filled || halfFilled ? 'text-blue' : 'text-gray-300'}`} 
        style={{ fontSize: "18px" }}
      >
        {filled ? 'star' : halfFilled ? 'star_half' : 'star_border'}
      </span>
    );
  })}
</div>
              <p className="text-slate-900 dark:text-white text-base font-normal leading-normal">
                {ratingStats.totalReviews.toLocaleString()} reviews
              </p>
            </div>
            
            {/* Rating Distribution - with safe access */}
            <div className="grid min-w-[240px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-x-3 gap-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <React.Fragment key={rating}>
                  <p className="text-slate-900 dark:text-white text-sm font-normal leading-normal">
                    {rating}
                  </p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div 
                      className="rounded-full bg-blue" 
                      style={{ 
                        width: `${ratingStats?.ratingPercentages?.[rating] || 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal text-right">
                    {ratingStats?.ratingPercentages?.[rating] || 0}%
                  </p>
                </React.Fragment>
              ))}
            </div>
            
            {/* Add Review Button */}
            <div className="flex flex-col items-center justify-center sm:pl-8">
              <button 
                onClick={addReviewNav} 
                className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-6 bg-blue text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue/90 transition-colors w-full sm:w-auto"
              >
                <span className="material-symbols-outlined" style={{fontSize: "20px"}}>edit</span>
                <span className="truncate">Add Review</span>
              </button>
            </div>
          </div>
          
          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 mt-6">
            {reviews.map(items => (
              <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm" key={items.id}>
                <div className="flex items-center gap-3">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
                    data-alt="avatar of Elena Rodriguez" 
                    style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQhC-np34j2Gwt7w70djiaYikNuOF1aejwvwKOIeQwabszrc0DmLL_SNInvnRvK_QhNQ_MhoK199j7iR8bW9_Lz-FklHI1r3nKcn4UXcKsRl1JEkKbwtHa4wQqja2CNbDozt0RCyIucsPNaBRqdjhCL4XPDQeK2iMtbD2IvMfEewVffG2LUxlehzZ5CXMu-LqiQMdYLQCG0aSfpbnWI_z7q7DeWrghRDHDRrQexiy0EdtQf9r1VwU6U55SWHwmcU7PzToesq2dnd8Y")`}}
                  ></div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">
                      {items.username}
                    </p>
                  </div>
                </div>
                
                {/* Dynamic stars for each review with safe access */}
                <div className="flex gap-0.5">
  {[1, 2, 3, 4, 5].map((star) => {
    const itemRating = Number(items.rating) || 0;
    const isFilled = star <= itemRating;
    
    return (
      <span 
        key={star}
        className={`material-symbols-outlined ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`} 
        style={{ fontSize: "20px" }}
      >
        {isFilled ? 'star' : 'star_border'}
      </span>
    );
  })}
</div>
                
                <p className="text-slate-900 dark:text-white font-bold text-lg">
                  {items.reviewTitle}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-base font-normal leading-relaxed">
                  {items.review}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {moment(items.date).fromNow()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex px-4 py-10 justify-center">
            {id ? "" : (
              <button 
                onClick={() => continueShopping()} 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-blue text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue/90 transition-colors"
              >
                <span className="truncate">Continue Shopping</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>}
</>
  );
}


export default CustomerReview;