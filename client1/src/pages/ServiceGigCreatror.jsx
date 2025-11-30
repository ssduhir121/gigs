// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// const ServiceGigcreator = () => {
//   const [gigData, setGigData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     image: null
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setGigData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
//         return;
//       }

//       // Validate file size (10MB)
//       if (file.size > 10 * 1024 * 1024) {
//         toast.error('Image size must be less than 10MB');
//         return;
//       }

//       setGigData(prev => ({
//         ...prev,
//         image: file
//       }));
      
//       // Create preview URL
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };

//   const handleRemoveImage = () => {
//     setGigData(prev => ({
//       ...prev,
//       image: null
//     }));
//     setImagePreview('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!gigData.title || !gigData.description || !gigData.price) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     if (parseFloat(gigData.price) < 5) {
//       toast.error('Minimum price is $5');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append('title', gigData.title);
//       formData.append('description', gigData.description);
//       formData.append('price', gigData.price);
      
//       if (gigData.image) {
//         formData.append('image', gigData.image);
//       }

//       const response = await axios.post('/api/service-gigs', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true
//       });

//       toast.success('Service gig created successfully!');
      
//       // Reset form
//       setGigData({
//         title: '',
//         description: '',
//         price: '',
//         image: null
//       });
//       setImagePreview('');

//     } catch (error) {
//       console.error('Error creating gig:', error);
//       const errorMessage = error.response?.data?.message || 'Error creating gig. Please try again.';
//       toast.error(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//             <h1 className="text-2xl font-bold text-white">Create a Service Gig</h1>
//             <p className="text-blue-100 text-sm mt-1">Offer your services and start earning</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Gig Title */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Gig Title *
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={gigData.title}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                 placeholder="e.g., I will design a professional website"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={gigData.description}
//                 onChange={handleInputChange}
//                 required
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                 placeholder="Describe what you will deliver..."
//               />
//             </div>

//             {/* Price */}
//             <div>
//               <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
//                 Price ($) *
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500">$</span>
//                 </div>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   value={gigData.price}
//                   onChange={handleInputChange}
//                   required
//                   min="5"
//                   step="0.01"
//                   className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                   placeholder="0.00"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">Minimum price: $5.00</p>
//             </div>

//             {/* Image Upload */}
//             <div>
//               <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
//                 Gig Image
//               </label>
              
//               {imagePreview ? (
//                 <div className="relative">
//                   <img 
//                     src={imagePreview} 
//                     alt="Gig preview" 
//                     className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRemoveImage}
//                     className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-200"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition duration-200">
//                   <input
//                     type="file"
//                     id="image"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                   <label htmlFor="image" className="cursor-pointer">
//                     <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                       <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                     <div className="mt-2">
//                       <span className="text-blue-600 hover:text-blue-500 font-medium">Upload an image</span>
//                       <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                     </div>
//                   </label>
//                 </div>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:-translate-y-0.5"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating Gig...
//                 </div>
//               ) : (
//                 'Create Service Gig'
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceGigcreator;



import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  PhotoIcon, 
  XMarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

const ServiceGigcreator = () => {
  const [gigData, setGigData] = useState({
    title: '',
    description: '',
    price: '',
    image: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGigData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

      setGigData(prev => ({
        ...prev,
        image: file
      }));
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setGigData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gigData.title || !gigData.description || !gigData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (parseFloat(gigData.price) < 5) {
      toast.error('Minimum price is $5');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', gigData.title);
      formData.append('description', gigData.description);
      formData.append('price', gigData.price);
      
      if (gigData.image) {
        formData.append('image', gigData.image);
      }

      const response = await axios.post('/api/service-gigs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      toast.success('Service gig created successfully!');
      
      setGigData({
        title: '',
        description: '',
        price: '',
        image: null
      });
      setImagePreview('');

    } catch (error) {
      console.error('Error creating gig:', error);
      const errorMessage = error.response?.data?.message || 'Error creating gig. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusCircleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create Service Gig</h1>
                <p className="text-gray-600 text-sm">Offer your services and start earning</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Gig Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Gig Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={gigData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Professional website design"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={gigData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe what you will deliver, your expertise, and what clients can expect..."
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={gigData.price}
                  onChange={handleInputChange}
                  required
                  min="5"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum price: $5.00</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gig Image
              </label>
              
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Gig preview" 
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">Click to upload</span>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Gig...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Create Service Gig
                </>
              )}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              View guidelines
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceGigcreator;