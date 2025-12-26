import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllUsers = async(req,res) =>{
    try{
        const Data = await User.find({ role: 'user' });
        res.status(200).send({status:true,data:Data});
    }catch(err){
         
         res.status(400).send({status:false,message:err});
    }

}
export const addCategories = async (req, res) => {
    const { name } = req.body;

    try {
        const categoryData = await Category.create({ name });

        res.status(200).send({
            data: categoryData,
            status: true,
            message: "Category created"
        });

    } catch (err) {
        console.error('Prisma Error:', err);
        res.status(400).send({
            message: err.message,
            status: false
        });
    }
};

export const addProducts = async (req, res) => {
    const { pname, desc, price, stock, imageUrl, categoryId } = req.body;

    console.log('Request Body:', req.body);  // Debugging purpose

    if (!pname || !desc || !price || !stock || !imageUrl || !categoryId) {
        return res.status(400).json({ message: 'All fields are required', status: false });
    }

    try {
        // Verify category exists
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ 
                message: 'Invalid category ID. Category does not exist.', 
                status: false 
            });
        }

        const productData = await Product.create({
            pname,
            desc,
            price: parseFloat(price),
            stock: stock.toString(),
            imageUrl,
            categoryId
        });

        res.status(201).json({
            data: productData,
            status: true,
            message: "Product added successfully"
        });

    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

export const viewCategories = async (req, res) => {
    try {
        const categoryData = await Category.find();
        res.status(200).json({ data: categoryData, status: true });
    } catch (err) {
        console.error('Prisma Error:', err);
        res.status(500).json({ status: false, message: err.message });
    }
};


export const viewProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name');
    res.status(200).json({ 
      status: true,
      products: products 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ 
      status: false,
      message: "Failed to fetch products" 
    });
  }
};

export const editProducts = async (req, res) => {
    const productId = req.params.id;
    const { pname, desc, price, stock, imageUrl, categoryId } = req.body;

    try {
        const updateData = {};
        if (pname) updateData.pname = pname;
        if (desc) updateData.desc = desc;
        if (price) updateData.price = parseFloat(price);
        if (stock) updateData.stock = stock.toString();
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (categoryId) updateData.categoryId = categoryId;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (err) {
        console.error('Prisma Error:', err);
        res.status(400).json({ status: false, message: err.message });
    }
};


export const deleteProducts = async (req, res) => {
    const productId = req.params.id;

    try {
        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            status: true,
            message: "Product deleted successfully"
        });

    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

export const deleteCategories = async (req, res) => {
    const categoryId = req.params.id;
    console.log("Deleting category:", categoryId);

    try {
        // Delete all products in this category first
        await Product.deleteMany({ categoryId });

        // Delete the category itself
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({
            status: true,
            message: 'Category and its products deleted successfully'
        });

    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

export const editCategories = async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ status: false, message: "Category name is required" });
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true }
        );

        res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: updatedCategory
        });

    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({ status: false, message: err.message });
    }
};


export const searchProducts = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ status: false, message: "Search query is required" });
    }

    try {
        const products = await Product.find({
            pname: { $regex: query, $options: 'i' }
        });

        res.status(200).json({
            status: true,
            message: "Search results fetched successfully",
            data: products
        });
    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({ status: false, message: err.message });
    }
};

export const viewProductsByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const products = await Product.find({ categoryId });

        res.status(200).json({
            status: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (err) {
        console.error("Prisma Error:", err);
        res.status(500).json({ status: false, message: err.message });
    }
};
