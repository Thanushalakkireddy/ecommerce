import express from 'express';
import * as authController from '../controller/authController.js';
import * as adminController from '../controller/adminController.js';
// import your middleware if needed
// import { verifyAdmin } from '../middleware/authenticateMiddleware.js';

const router = express.Router();

const { adminLogin, adminRegister, adminChangePass } = authController;
const {
  getAllUsers,
  viewProducts,
  addProducts,
  editProducts,
  deleteProducts,
  addCategories,
  viewCategories,
  deleteCategories,
  editCategories,
} = adminController;

// Routes
router.post('/register', adminRegister);
router.post('/login', adminLogin); // generate Token
router.get('/allUsers', getAllUsers); // middleware to check the token
router.post('/addProduct', addProducts);
router.post('/products', addProducts);  // matches frontend POST
router.post('/deleteProduct/:id', deleteProducts);
router.post('/category', addCategories);
router.patch('/category/:id', editCategories);
router.delete('/categoryDelete/:id', deleteCategories);
router.get('/viewCategory', viewCategories);
router.put('/changePass/:id', adminChangePass);
router.get('/viewProducts', viewProducts);
router.get('/products', viewProducts);  // matches frontend
router.patch('/editProducts/:id', editProducts);

// Export as ESM
export default router;
