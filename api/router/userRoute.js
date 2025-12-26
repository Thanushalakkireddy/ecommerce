import express from 'express';
import * as authController from '../controller/authController.js';
import * as adminController from '../controller/adminController.js';
import * as userController from '../controller/userController.js';
import { authenticateToken } from '../middleware/authenticateMiddleware.js';

const router = express.Router();
const {userRegister,userLogin} = authController;
const {viewProducts,viewCategories,searchProducts,viewProductsByCategory} = adminController;
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserProfile,
  updateUserProfile
} = userController;

router.post('/register',userRegister);
router.post('/login',userLogin);
router.get('/viewAllProducts',viewProducts)
router.get('/viewAllCategories',viewCategories)
router.get('/products/:categories',viewProductsByCategory)
router.get('/viewProducts/:id',viewProducts)
router.get('/search',searchProducts)

// Protected routes - require authentication
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

// Order routes
router.post('/orders', authenticateToken, createOrder);
router.get('/orders', authenticateToken, getUserOrders);
router.get('/orders/:id', authenticateToken, getOrderById);
router.put('/orders/:id/cancel', authenticateToken, cancelOrder);

// Address routes
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.put('/addresses/:id', authenticateToken, updateAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);

// Wishlist routes
router.get('/wishlist', authenticateToken, getWishlist);
router.post('/wishlist', authenticateToken, addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, removeFromWishlist);

export default router;