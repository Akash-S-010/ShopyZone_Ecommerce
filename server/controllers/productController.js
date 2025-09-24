import Product from "../models/Product.js";
import Seller from "../models/Seller.js";

// -------- CREATE PRODUCT --------
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, brand, images, category, subCategory, price, discountPrice, stock, variants } = req.body;

    if (!name || !images || !category || !price) {
      return res.status(400).json({ message: "Name, images, category, and price are required" });
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
      images,
      category,
      subCategory,
      price,
      discountPrice,
      stock,
      variants,
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
    const products = await Product.find({ status: "active" }).populate("seller", "name");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// -------- GET SELLER'S PRODUCTS --------
export const getSellerProducts = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const products = await Product.find({ seller: sellerId });
    res.json(products);
  } catch (err) {
    next(err);
  }
};
