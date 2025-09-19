import User from '../models/User.js';

// ---------------- ADD ADDRESS ----------------
export const addAddress = async (req, res, next) => {
  try {
    const { Address, street, city, state, pincode } = req.body;
    const userId = req.user.id;

    if (!Address || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push({ Address, street, city, state, pincode });
    await user.save();

    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ---------------- GET ALL ADDRESSES ----------------
export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ---------------- UPDATE ADDRESS ----------------
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { Address, street, city, state, pincode } = req.body;
    const userId = req.user.id;

    if (!Address || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.Address = Address;
    address.street = street;
    address.city = city;
    address.state = state;
    address.pincode = pincode;

    await user.save();

    res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// ---------------- DELETE ADDRESS ----------------
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.id(addressId).remove();
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};