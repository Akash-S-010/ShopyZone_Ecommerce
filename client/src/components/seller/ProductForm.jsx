import React, { useState, useEffect } from 'react';
import Loader from '../shared/Loader';

const ProductForm = ({ initialData = {}, onSubmit, isLoading, buttonText }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    subCategory: '',
    price: '',
    discountPrice: '',
    stock: '',
    variants: [],
    images: [], // This will hold File objects
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Assuming initialData.images are URLs (strings)
        images: [], // Clear file inputs for editing, users re-upload if needed
      }));
      // Set image previews for existing images
      if (initialData.images && initialData.images.length > 0) {
        setImagePreviews(initialData.images);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = formData.variants.map((variant, i) =>
      i === index ? { ...variant, [name]: value } : variant
    );
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', color: '', ram: '', storage: '', quantity: '' }],
    }));
  };

  const removeVariant = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        formData.images.forEach(image => data.append('images', image));
      } else if (key === 'variants') {
        data.append('variants', JSON.stringify(formData.variants));
      } else {
        data.append(key, formData[key]);
      }
    }
    onSubmit(data);
  };

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
        <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">Sub-Category</label>
        <input type="text" id="subCategory" name="subCategory" value={formData.subCategory} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">Discount Price</label>
        <input type="number" id="discountPrice" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Variants</h4>
        {formData.variants.map((variant, index) => (
          <div key={index} className="flex space-x-4 mb-4 p-4 border border-gray-200 rounded-md">
            <input type="text" name="size" placeholder="Size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} className="flex-1 border border-gray-300 rounded-md shadow-sm p-2" />
            <input type="text" name="color" placeholder="Color" value={variant.color} onChange={(e) => handleVariantChange(index, e)} className="flex-1 border border-gray-300 rounded-md shadow-sm p-2" />
            <input type="text" name="ram" placeholder="RAM" value={variant.ram} onChange={(e) => handleVariantChange(index, e)} className="flex-1 border border-gray-300 rounded-md shadow-sm p-2" />
            <input type="text" name="storage" placeholder="Storage" value={variant.storage} onChange={(e) => handleVariantChange(index, e)} className="flex-1 border border-gray-300 rounded-md shadow-sm p-2" />
            <input type="number" name="quantity" placeholder="Quantity" value={variant.quantity} onChange={(e) => handleVariantChange(index, e)} className="flex-1 border border-gray-300 rounded-md shadow-sm p-2" />
            <button type="button" onClick={() => removeVariant(index)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Variant</button>
      </div>

      <button type="submit" disabled={isLoading} className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        {isLoading ? <Loader size={20} className="inline-block mr-2" colorClass="text-white" /> : buttonText}
      </button>
    </form>
  );
};

export default ProductForm;

