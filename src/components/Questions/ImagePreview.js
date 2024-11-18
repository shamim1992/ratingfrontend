import Image from "next/image";

// src/components/Questions/ImagePreview.js
const ImagePreview = ({ images, removeImage, title }) => (
    <div className="mt-4">
      {title && <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>}
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`} 
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default ImagePreview;