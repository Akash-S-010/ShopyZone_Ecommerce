import React, { useState, useEffect } from 'react';
import Loader from '../shared/Loader';

import { categoriesData } from '../../utils/categories';

const ProductForm = ({ initialData = {}, onSubmit, isLoading, buttonText }) => {
  const [formData, setFormData] = useState(() => {
    const initialState = {
      name: '',
      description: '',
      brand: '',
      category: '',
      secondaryCategory: '',
      tertiaryCategory: '',
      price: '',
      discountPrice: '',
      images: [], // This will hold File objects
    };

    if (Object.keys(initialData).length > 0) { // Check if initialData is not empty
      return {
        ...initialState,
        ...initialData,
        images: [], // Clear file inputs for editing, users re-upload if needed
        secondaryCategory: initialData.secondaryCategory || '',
        tertiaryCategory: initialData.tertiaryCategory || '',
      };
    }
    return initialState;
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData.images && initialData.images.length > 0) {
      setImagePreviews(initialData.images);
    }
  }, [initialData.images]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      let newFormData = { ...prev, [name]: value };

      // Reset dependent categories if parent changes
      if (name === 'category' && prev.category !== value) {
        newFormData.secondaryCategory = '';
        newFormData.tertiaryCategory = '';
      } else if (name === 'secondaryCategory' && prev.secondaryCategory !== value) {
        newFormData.tertiaryCategory = '';
      }
      return newFormData;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        formData.images.forEach(image => data.append('images', image));
      } else {
        data.append(key, formData[key]);
      }
    }
    onSubmit(data);
  };

  const secondaryOptions = formData.category ? Object.keys(categoriesData[formData.category]) : [];
  const tertiaryOptions = (formData.category && formData.secondaryCategory) ? categoriesData[formData.category][formData.secondaryCategory] : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>

      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
        <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a category</option>
          {Object.keys(categoriesData).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {formData.category && (
        <div>
          <label htmlFor="secondaryCategory" className="block text-sm font-medium text-gray-700">Secondary Category</label>
          <select
            id="secondaryCategory"
            name="secondaryCategory"
            value={formData.secondaryCategory}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a secondary category</option>
            {secondaryOptions.map(secCat => (
              <option key={secCat} value={secCat}>{secCat}</option>
            ))}
          </select>
        </div>
      )}

      {formData.secondaryCategory && (
        <div>
          <label htmlFor="tertiaryCategory" className="block text-sm font-medium text-gray-700">Tertiary Category</label>
          <select
            id="tertiaryCategory"
            name="tertiaryCategory"
            value={formData.tertiaryCategory}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a tertiary category</option>
            {tertiaryOptions.map(terCat => (
              <option key={terCat} value={terCat}>{terCat}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
        <input type="number" id="discountPrice" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Images</label>
        <input type="file" multiple onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <div className="mt-2 grid grid-cols-4 gap-4">
          {imagePreviews.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt="Product Preview" className="w-full h-24 object-cover rounded-md" />
              <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        {isLoading ? <Loader size={20} className="inline-block mr-2" colorClass="text-white" /> : buttonText}
      </button>
    </form>
  );
};

export default ProductForm;

