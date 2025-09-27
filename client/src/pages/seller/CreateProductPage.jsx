import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import ProductForm from '../../components/seller/ProductForm';
import Loader from '../../components/shared/Loader';

const CreateProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/product/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(res.data.message);
      navigate('/seller/products'); // Redirect to products listing
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      {isLoading ? <Loader /> : <ProductForm onSubmit={handleSubmit} isLoading={isLoading} buttonText="Create Product" />}
    </div>
  );
};

export default CreateProductPage;

