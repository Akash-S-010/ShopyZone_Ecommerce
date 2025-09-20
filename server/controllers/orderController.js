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
export const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    const { paymentType, address } = req.body;

    if (!paymentType || !["COD", "Razorpay"].includes(paymentType)) {
      return res.status(400).json({ message: "Valid payment type is required" });
    }

    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
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

      totalPrice += product.price * cartItem.quantity;
      items.push({
        product: product._id,
        quantity: cartItem.quantity,
        itemStatus: "Pending",
        paymentStatus: paymentType === "COD" ? "pending" : "paid",
      });
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      items,
      totalPrice,
      address,
      paymentType,
      paymentStatus: paymentType === "COD" ? "pending" : "pending",
    });

    let razorpayOrder = null;
    if (paymentType === "Razorpay") {
      razorpayOrder = await razorpay.orders.create({
        amount: totalPrice * 100, // amount in the smallest currency unit
        currency: "INR", // Assuming INR, you might want to make this dynamic
        receipt: order._id.toString(),
      });
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    // Reduce stock
    for (const cartItem of user.cart) {
      await Product.findByIdAndUpdate(cartItem.product, { $inc: { stock: -cartItem.quantity } });
    }

    // Clear user cart
    user.cart = [];
    await user.save();

    if (paymentType === "Razorpay" && razorpayOrder) {
      return res.status(201).json({
        message: "Order placed successfully",
        order,
        razorpayOrder: {
          id: razorpayOrder.id,
          currency: razorpayOrder.currency,
          amount: razorpayOrder.amount,
        },
      });
    } else {
      return res.status(201).json({ message: "Order placed successfully", order });
    }
  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get orders of logged-in user
export const getUserOrders = async (req, res) => {
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
export const getAllOrders = async (req, res) => {
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

export const updateOrderStatus = async (req, res) => {
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
export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId, status } = req.body;
    const sellerId = req.seller._id;
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid item status" });
    }

    const order = await Order.findById(orderId).populate({
      path: "items.product",
      select: "seller",
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Order item not found" });

    // Check if the seller owns the product
    if (item.product.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this item" });
    }

    item.itemStatus = status;

    // If COD and item is delivered, mark payment as paid for this item
    if (order.paymentType === "COD" && status === "Delivered") {
      item.paymentStatus = "paid";
    }

    await order.save();

    return res.status(200).json({ message: "Order item status updated", order });
  } catch (err) {
    console.error("Error updating order item status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create Razorpay Order
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (e.g., paise for INR)
      currency,
      receipt,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      orderId: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    next(error);
  }
};

// Handle Razorpay Webhook
export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const event = req.body.event;
      const payload = req.body.payload;

      if (event === "payment.captured") {
        const paymentId = payload.payment.entity.id;
        const orderId = payload.payment.entity.order_id;

        // Find the order in your database using the orderId (Razorpay order ID)
        // You'll need to store the Razorpay order ID in your Order model when creating it
        const order = await Order.findOne({ "items.razorpayOrderId": orderId });

        if (order) {
          // Update payment status for all items in the order
          order.items.forEach((item) => {
            item.paymentStatus = "paid";
          });
          // Update overall order payment status
          order.paymentStatus = "paid";
          await order.save();
          console.log(`Payment captured for order: ${order._id}`);
        }
      } else if (event === "payment.failed") {
        const orderId = payload.payment.entity.order_id;
        const order = await Order.findOne({ "items.razorpayOrderId": orderId });

        if (order) {
          order.paymentStatus = "failed";
          await order.save();
          console.log(`Payment failed for order: ${order._id}`);
        }
      }
      res.status(200).json({ status: "ok" });
    } else {
      res.status(403).json({ message: "Invalid signature" });
    }
  } catch (error) {
    next(error);
  }
};
