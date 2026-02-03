import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AuthContext } from './auth';
import { useContext } from 'react';

function AddReview({id, refreshReviews, close, productTitle, category, price, username, productImage}) {
  const {currentuser} = useContext(AuthContext)
  useEffect(() => {
      console.log(id, close, productTitle, category, price, username, productImage, "rere");
  }, [id, close, productTitle, category, price, username, productImage]);
  
  
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState("");
  

  const ratingValues = [5, 4, 3, 2, 1];

  const handleClick = (num) => {
    setRating(num);
  };

  const handleValidation = () => {
     if(title === ""){
       setError("field is empty")
     }
     if(review === ""){
      setError("field is empty")
    }
    if(rating === ""  ){
      setError("field is empty")
    }
  }

  const addReview = async (e) => {
    e.preventDefault();
    if(handleValidation()){
      console.log("validation success")
    }
    try{
      setLoggedInUsername(currentuser.username);
      const res = await axios.post("http://localhost:3000/posts/review", {
        title,
        rating,
        review,
        id
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });
     if(res.status === 200){
        setTitle("");
        setReview("");
        close();
        refreshReviews();
     }
    }catch(err){
      console.log(err)
    }
  }
  return (
<div className=" font-display min-h-screen flex flex-col text-text-main">
  <main className="flex-1 flex justify-center py-6 px-4 md:py-10 md:px-8">
    <div className="layout-content-container flex flex-col max-w-[1024px] w-full gap-6 md:gap-8">
      {console.log(id)}
      <div className="flex flex-col gap-2">
      <div className={`${id ? 'flex justify-between items-center' : ''}`}>
        <h1 className="text-text-main tracking-tight text-2xl md:text-[32px] font-bold leading-tight">Write a Review</h1>
       {id ? <span className="material-symbols-outlined" onClick={close}>close</span> : "" }
        </div>

        <p className="text-text-secondary text-sm font-normal">Share your experience to help others make better choices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-surface-light rounded-xl p-4 shadow-sm border border-border-light">
            <img className=" absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors w-full aspect-[4/3] bg-center bg-cover rounded-lg mb-4 relative overflow-hidden group" 
                 src={`../public/${username}/${productTitle}/${productImage}`}/>
              
            
            <div className="flex flex-col gap-1">
              <h3 className="text-text-main text-lg font-bold leading-tight">{productTitle}</h3>
              <p className="text-text-secondary text-sm">{category}</p>
              <p className="text-text-main font-medium mt-2">${price}</p>
            </div>
          </div>
          
           
        </div>

        <div className="lg:col-span-8 bg-surface-light rounded-xl p-5 md:p-8 shadow-sm border border-border-light">
          <form className="flex flex-col gap-6 md:gap-8" onSubmit={(e) => e.preventDefault()}>
            
            <div className="flex flex-col gap-3">
              <label className="text-text-main text-sm font-bold">Overall Rating <span className="text-red-500">*</span></label>
              <div className="flex flex-row-reverse justify-end gap-1 star-rating w-fit">
                {ratingValues.map((num) => (
  <React.Fragment key={num}>
    <input 
      className={`peer/${num} opacity-0 absolute w-0 h-0`} 
      id={`star${num}`} 
      name="rating" 
      type="radio" 
      value={num}
      checked={rating === num}
      onChange={() => handleClick(num)}
    />
    <label 
      className={`cursor-pointer text-slate-300 ${
        (hover >= num || rating >= num) ? 'text-yellow-400' : ''
      } transition-colors duration-200`}
      htmlFor={`star${num}`}
      onClick={() => handleClick(num)}
      onMouseEnter={() => setHover(num)}
      onMouseLeave={() => setHover(0)}
    >
      <span 
        className="material-symbols-outlined text-[32px] md:text-[40px] filled-star" 
        style={{ 
          fontVariationSettings: "'FILL' 1",
          color: (hover >= num || rating >= num) ? '#facc15' : '#d1d5db'
        }}
      >
        star
      </span>
    </label>
  </React.Fragment>
))}
  {console.log(rating)}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-text-main text-sm font-bold" htmlFor="headline">Review Title</label>
                <input className="w-full bg-white text-text-main border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-lg h-12 px-4 placeholder:text-slate-400" id="headline" placeholder="Summarize your thoughts" value={title} onChange={(e) => setTitle(e.target.value)} type="text"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-text-main text-sm font-bold" htmlFor="review">Your Review</label>
                <textarea className="w-full bg-white text-text-main border border-border-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-lg p-4 placeholder:text-slate-400 resize-y" id="review" placeholder="What did you like or dislike?" value={review} onChange={(e) => setReview(e.target.value)} rows="5"></textarea>
                <p className="text-xs text-text-secondary text-right">Minimum 20 characters</p>
              </div>
            </div>

            <hr className="border-border-light"/>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 items-center">
              <button onClick={close} className="text-text-secondary text-sm font-medium hover:text-text-main transition-colors py-2">Cancel</button>
              <button onClick={addReview} className="w-full sm:w-auto h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg px-8 transition-colors shadow-sm flex items-center justify-center" type="submit">
                Submit Review
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </main>
</div>
  )
}

export default AddReview;