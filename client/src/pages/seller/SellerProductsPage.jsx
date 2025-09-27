import React from 'react';
import { Link } from 'react-router-dom';

const SellerProductsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Your Products</h2>
      <Link to="/seller/products/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add New Product</Link>
      <p className="mt-4">This page will display a list of your products and allow you to manage them.</p>
    </div>
  );
};

export default SellerProductsPage;

