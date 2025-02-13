import React from 'react';

interface ImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

const AdImageGallery: React.FC<ImageGalleryProps> = ({ images, currentImageIndex, setCurrentImageIndex }) => {
  return (
    <>
      {images.length > 0 && (
        <div className="relative mb-4">
          <img
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-96 w-auto h-auto rounded-md"
            style={{ maxWidth: '800px', maxHeight: '600px' }}
          />
          <div className="absolute bottom-0 left-0 w-full flex justify-center space-x-1 p-1 bg-black bg-opacity-50 rounded-b-md">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                onClick={() => setCurrentImageIndex(index)}
              ></div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4 space-x-2 mb-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-16 h-16 object-cover rounded-md cursor-pointer"
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </>
  );
};

export default AdImageGallery;