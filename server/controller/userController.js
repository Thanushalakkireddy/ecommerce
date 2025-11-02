import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Wishlist from '../models/Wishlist.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// ========== ORDER MANAGEMENT ==========

// Create new order
export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
  const userId = req.user.id;

  try {
    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
      userId,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'Pending'
    });

    // Populate product details
    await order.populate('items.productId');

    res.status(201).json({
      status: true,
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      orders
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: id, userId })
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({
        status: false,
        message: 'Cannot cancel this order'
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      status: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// ========== ADDRESS MANAGEMENT ==========

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  const userId = req.user.id;

  try {
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      status: true,
      addresses
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  const userId = req.user.id;
  const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country, isDefault } = req.body;

  try {
    // If this is set as default, unset all other defaults
    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country: country || 'India',
      isDefault: isDefault || false
    });

    res.status(201).json({
      status: true,
      message: 'Address added successfully',
      address
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    // If setting as default, unset all other defaults
    if (updateData.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        status: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Address updated successfully',
      address
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) {
      return res.status(404).json({
        status: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Address deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// ========== WISHLIST MANAGEMENT ==========

// Get user's wishlist
export const getWishlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.find({ userId })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      wishlist
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({
        status: false,
        message: 'Product already in wishlist'
      });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    await wishlistItem.populate('productId');

    res.status(201).json({
      status: true,
      message: 'Added to wishlist',
      wishlistItem
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const result = await Wishlist.findOneAndDelete({ userId, productId });

    if (!result) {
      return res.status(404).json({
        status: false,
        message: 'Product not found in wishlist'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Removed from wishlist'
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// ========== USER PROFILE ==========

// Get user profile
export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-pass');

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: true,
      user
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-pass');

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};
