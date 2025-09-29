import { create } from 'zustand';
import axios from '../config/axios';

const useAddressStore = create((set) => ({
  addresses: [],
  hydrate: async () => {
    try {
      const { data } = await axios.get('/address');
      set({ addresses: data.addresses || [] });
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
      set({ addresses: [] });
    }
  },
  addAddress: (address) => set((state) => ({ addresses: [...state.addresses, address] })),
  updateAddress: (updatedAddress) =>
    set((state) => ({
      addresses: state.addresses.map((addr) =>
        addr._id === updatedAddress._id ? updatedAddress : addr
      ),
    })),
  deleteAddress: (addressId) =>
    set((state) => ({
      addresses: state.addresses.filter((addr) => addr._id !== addressId),
    })),
}));

export default useAddressStore;