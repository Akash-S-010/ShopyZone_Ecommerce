import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import cloudinary from '../config/cloudinary.js';

// -------- CREATE PRODUCT --------
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, brand, category, secondaryCategory, tertiaryCategory, price, discountPrice } = req.body;

    if (!name || !req.files || req.files.length === 0 || !category || !price) {
      return res.status(400).json({ message: "Name, images, category, and price are required" });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path || `data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
        folder: 'shopyzone',
      });
      imageUrls.push(result.secure_url);
    }

    const sellerId = req.seller?._id || req.admin?._id;

    if (req.seller) {
        const seller = await Seller.findById(sellerId);
        if (!seller || seller.status !== "approved") {
            return res.status(403).json({ message: "Seller not approved to add products." });
        }
    }

    const product = await Product.create({
      name,
      description,
      brand,
      images: imageUrls,
      category,
      secondaryCategory,
      tertiaryCategory,
      price,
      discountPrice,
      seller: sellerId,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    next(err);
  }
};

// -------- UPDATE PRODUCT --------
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only the seller who owns it or admin can update
    if (req.seller && product.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    if (req.files && req.files.length > 0) {
      const newImageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path || `data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
          folder: 'shopyzone',
        });
        newImageUrls.push(result.secure_url);
      }
      updates.images = [...product.images, ...newImageUrls]; // Append new images
    }

    Object.assign(product, updates);
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    next(err);
  }
};

// -------- DELETE PRODUCT --------
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only seller who owns it or admin can delete
    if (req.seller && product.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.remove();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// -------- GET SINGLE PRODUCT --------
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// -------- GET ALL PRODUCTS (PUBLIC) --------
export const getAllProducts = async (req, res, next) => {
  try {
    const { search, sort, minPrice, maxPrice, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.discountPrice = {};
      if (minPrice) query.discountPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.discountPrice.$lte = parseFloat(maxPrice);
    }

    if (category) {
      query.category = category;
    }

    let sortOptions = {};
    if (sort) {
      if (sort === "price") {
        sortOptions.discountPrice = 1;
      } else if (sort === "-price") {
        sortOptions.discountPrice = -1;
      } else if (sort === "-createdAt") {
        sortOptions.createdAt = -1;
      }
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .populate("seller", "name");

    res.json(products);
  } catch (err) {
    next(err);
  }
};
