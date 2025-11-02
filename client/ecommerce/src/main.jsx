import './main.css'
// import App from './App.jsx'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import {useRef,useState,useEffect}from 'react'
import { BrowserRouter,Routes,Route, Link } from 'react-router-dom'
import Header from './components/common/header.jsx';
import MainContent from './components/common/mainContent.jsx';
import Register from './components/common/Register.jsx';
import HomePage from './components/common/HomePage.jsx';

// User UI Components
import UserHomePage from './components/userUI/userHomePage.jsx';
import ProductDetails from './components/userUI/productDetails.jsx';
import ShoppingCart from './components/userUI/shoppingCart.jsx';
import CategoriesPage from './components/userUI/categoriesPage.jsx';
import UserAccount from './components/userUI/userAccount.jsx';
import SearchResults from './components/userUI/searchResults.jsx';
import Checkout from './components/userUI/checkout.jsx';
import Orders from './components/userUI/orders.jsx';
import AddressManagement from './components/userUI/addressManagement.jsx';
import Wishlist from './components/userUI/wishlist.jsx';

// Admin UI Components
import AddProducts from './components/adminUI/addProducts.jsx';
import EditProducts from './components/adminUI/editProducts.jsx';
import AddCategories from './components/adminUI/addCategories.jsx';
import EditCategories from './components/adminUI/editCategories.jsx';
import ViewUsers from './components/adminUI/viewUsers.jsx';
import DashboardAnalytics from './components/adminUI/dashboardAnalytics.jsx';
import './main.css';
import AdminHomePage from './components/adminUI/adminHomePage.jsx';
// import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes> 
        
  <Route path="/" element={<MainContent />} />
  <Route path="/login" element={<MainContent />} />
  <Route path="/signup" element={<Register />} />
  <Route path="/home" element={<HomePage />} />
  
  {/* User Routes */}
  <Route path="/user/home" element={<UserHomePage />} />
  <Route path="/user/product/:id" element={<ProductDetails />} />
  <Route path="/user/cart" element={<ShoppingCart />} />
  <Route path="/user/checkout" element={<Checkout />} />
  <Route path="/user/orders" element={<Orders />} />
  <Route path="/user/addresses" element={<AddressManagement />} />
  <Route path="/user/wishlist" element={<Wishlist />} />
  <Route path="/user/categories" element={<CategoriesPage />} />
  <Route path="/user/category/:id" element={<CategoriesPage />} />
  <Route path="/user/account" element={<UserAccount />} />
  <Route path="/user/search" element={<SearchResults />} />
  
  {/* Admin Routes */}
  <Route path="/adminHomePage" element={<AdminHomePage />} />
  <Route path="/dashboard" element={<DashboardAnalytics />} />
  <Route path="/addProducts" element={<AddProducts />} />
  <Route path="/editProducts" element={<EditProducts />} />
  <Route path="/addCategories" element={<AddCategories />} />
  <Route path="/editCategories" element={<EditCategories />} />
  <Route path="/viewUsers" element={<ViewUsers />} />
</Routes>
       
      {/* <App /> */}
    </BrowserRouter>
  </StrictMode>,
)