import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    const { paymentType, address } = req.body;

    if (!paymentType || !["Razorpay"].includes(paymentType)) {
      return res.status(400).json({ message: "Valid payment type is required" });
    }

    if (!address || !address.Address || !address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    let totalPrice = 0;
    const items = [];

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.product);
      if (!product) continue;

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      totalPrice += (product.discountPrice || product.price) * cartItem.quantity;
      items.push({
        product: product._id,
        quantity: cartItem.quantity,
        itemStatus: "Pending",
        paymentStatus: "pending",
      });
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      items,
      totalPrice,
      address,
      paymentType,
      paymentStatus: "pending",
    });

    // Reduce stock
    for (const cartItem of user.cart) {
      await Product.findByIdAndUpdate(cartItem.product, { $inc: { stock: -cartItem.quantity } });
    }

    // Clear user cart
    user.cart = [];
    await user.save();

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get orders of logged-in user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Find all products belonging to the seller
    const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
    const sellerProductIds = sellerProducts.map((product) => product._id);

    // Find orders that contain any of the seller's products
    const orders = await Order.find({
      "items.product": { $in: sellerProductIds },
    })
      .populate("user", "name email phone")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update order item status (seller)
const updateOrderStatusBySeller = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const sellerId = req.seller._id;
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId).populate({
      path: "items.product",
      select: "seller",
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check if any product in the order belongs to the seller
    const sellerOwnsProductInOrder = order.items.some(
      (item) => item.product.seller.toString() === sellerId.toString()
    );

    if (!sellerOwnsProductInOrder) {
      return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    order.orderStatus = status;

    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status by seller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create Razorpay Order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const user = req.user;
    const { total, address, items } = req.body;

    console.log("Received data for Razorpay order:", { user: user._id, total, address, items });

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order in database with pending status
    const order = await Order.create({
      user: user._id,
      items,
      totalPrice: total,
      address,
      paymentType: "Razorpay",
      paymentStatus: "pending",
    });

    console.log("Order created in DB:", order);

    const options = {
      amount: total * 100, // amount in the smallest currency unit (e.g., paise for INR)
      currency: "INR", // Assuming INR, you might want to make this dynamic
      receipt: order._id.toString(),
    };

    console.log("Razorpay options:", options);

    const razorpayOrder = await razorpay.orders.create(options);

    console.log("Razorpay order created:", razorpayOrder);

    // Update the order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      orderId: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      dbOrderId: order._id, // Return our internal order ID as well
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    next(error);
  }
};

// Handle Razorpay Webhook
const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const dbOrderId = req.body.dbOrderId;

    console.log("Webhook received:", { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId });
    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    console.log("Calculated digest:", digest);
    console.log("Received signature:", razorpay_signature);

    if (digest === razorpay_signature) {
      const order = await Order.findById(dbOrderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.paymentStatus = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      return res.status(200).json({ message: "Payment verified successfully", order });
    } else {
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Verify Razorpay Payment (for client-side handler)
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    // Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Find order
    const order = await Order.findById(dbOrderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Update order status
    order.paymentStatus = "paid";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    return res.json({ success: true, message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const getSellerRevenue = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    console.log("Seller ID:", sellerId);

    // Find all products belonging to the seller
    const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
    const sellerProductIds = sellerProducts.map((product) => product._id.toString());
    console.log("Seller Product IDs:", sellerProductIds);

    // Find orders that contain any of the seller's products, are paid, and delivered
    const orders = await Order.find({
      "items.product": { $in: sellerProductIds },
      paymentStatus: "paid",
      orderStatus: "Delivered",
    });
    console.log("Orders found for revenue calculation:", orders.length);

    let totalRevenue = 0;

    for (const order of orders) {
      for (const item of order.items) {
        if (sellerProductIds.includes(item.product.toString())) {
          const product = await Product.findById(item.product);
          if (product) {
            const itemPrice = product.discountPrice || product.price;
            totalRevenue += itemPrice * item.quantity;
            console.log(`Adding ${itemPrice} * ${item.quantity} to revenue. Current total: ${totalRevenue}`);
          }
        }
      }
    }

    console.log("Final Total Revenue:", totalRevenue);
    return res.status(200).json({ totalRevenue });
  } catch (err) {
    console.error("Error fetching seller revenue:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrderStatusBySeller,
  createRazorpayOrder,
  handleRazorpayWebhook,
  verifyRazorpayPayment,
  getSellerOrders,
  getSellerRevenue,
};
