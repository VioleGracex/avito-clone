import React, { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange }) => {
  const [error, setError] = useState<string | null>(null);
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<number>(Date.now()); // to reset input

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
      const newImages = [];

      for (const file of files) {
        const image = await new Promise<{ src: string; width: number; height: number }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => resolve({ src: event.target?.result as string, width: img.width, height: img.height });
            img.onerror = reject;
            img.src = event.target?.result as string;
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        if (file.size > 5 * 1024 * 1024) {
          setError('Каждое изображение должно быть меньше 5 МБ..');
          return;
        }

        if (image.width > 1920 || image.height > 1080) {
          setError('Каждое изображение должно быть меньше 1920x1080 пикселей..');
          return;
        }

        // Crop the image for mini-display
        const croppedImage = await new Promise<string>((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            const maxSize = 200; // Maximum size for the square shape
            const scaleSize = maxSize / Math.max(image.width, image.height);
            canvas.width = image.width * scaleSize;
            canvas.height = image.height * scaleSize;
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg'));
          };
          img.src = image.src;
        });

        newImages.push(croppedImage);
      }

      setError(null);
      onImagesChange([...images, ...newImages]);
      setInputKey(Date.now()); // reset the input
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-blue-500 text-white rounded-lg w-20 h-20 flex items-center justify-center"
        >
          <FaPlus className="w-8 h-8" />
          <input
            key={inputKey} // reset input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {error && <p className="text-red-500 w-full">{error}</p>}
        {images.length > 0 && images.map((img, index) => (
          <div key={index} className="relative w-20 h-20">
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => setFullSizeImage(img)}
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-transparent text-black rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => removeImage(index)}
            >
              <FaTimes className="w-3 h-3 hover:cursor-pointer" />
            </button>
          </div>
        ))}
      </div>
      {fullSizeImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setFullSizeImage(null)}
        >
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="bg-transparent text-black rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setFullSizeImage(null)}
            >
              <FaTimes className="w-6 h-6 hover:cursor-pointer" />
            </button>
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={fullSizeImage} alt="Full Size" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;