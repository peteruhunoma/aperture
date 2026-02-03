import React, { useState, useContext } from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"; 
import './App.css';
import Home from './Home';
import Shopper_Login from './Shopper_Login';
import Shipper_Login from './Shipper_Login.jsx';
import ProductDetails from './ProductDetails';
import ProductListing from './ProductListing';
import ShoppingCart from './ShoppingCart';
import Shopping_Signup from './Shopping_Signup';
import OrderConfirmed from './OrderConfirmed';
import CustomerReview from './CustomerReview';
import Checkout from './Checkout';
import UploadProduct from './UploadProduct';
import Shipper_Signup from './Shipper_Signup';
import Payment from './Payment';
import AddReview from './AddReview';
import Notification from './Notification';
import ViewNotification  from './ViewNotification';
import UserImage from './UserImage';
import Search from './Search';

function App() {
   
  return (
    <>
    <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Shopper_Login} />
      <Route exact path="/userimage" component={UserImage} />
      <Route exact path="/search/:search" component={Search} />
      <Route exact path="/sellerlogin" component={Shipper_Login} />
      <Route exact path="/sellersignup" component={Shipper_Signup} />
      <Route exact path="/signup" component={Shopping_Signup} />
      <Route exact path="/notifications" component={Notification} />
      <Route exact path="/productdetails/:id" component={ProductDetails} />
      <Route exact path="/categories/:cats" component={ProductListing} />
      <Route exact path="/shoppingcart" component={ShoppingCart} />
      <Route exact path="/payment" component={Payment} />
      <Route exact path="/addreview" component={AddReview} />
      <Route exact path="/orderconfirmed" component={OrderConfirmed} />
      <Route exact path="/view-notification/:id" component={ViewNotification} />
      <Route exact path="/customer-review" component={CustomerReview} />
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/uploadproduct" component={UploadProduct} />
    </Switch>
   </Router>
   </>
  )
}

export default App;
