import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { FaTimes, FaPlus, FaImage } from 'react-icons/fa';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange }) => {
  const [uploadedImages, setUploadedImages] = useState<ImageListType>(images.map((src) => ({ dataURL: src })));
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Для просмотра изображения в полном размере
  const [isDragging, setIsDragging] = useState(false); // Состояние для отслеживания перетаскивания
  const maxNumber = 5;

  // Глобальное отслеживание перетаскивания
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget || (e.relatedTarget as Node).nodeName === 'HTML') {
        setIsDragging(false);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      dataURL: URL.createObjectURL(file),
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
    onImagesChange([...images, ...newImages.map(image => image.dataURL!)]);
    setIsDragging(false); // Сброс состояния перетаскивания
  }, [uploadedImages, images, onImagesChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: maxNumber,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/avif': ['.avif'],
    },
    onDropRejected: () => setError('Каждый файл должен быть изображением и меньше 5MB.'),
  });

  const onChange = (imageList: ImageListType) => {
    setUploadedImages(imageList);
    onImagesChange(imageList.map(image => image.dataURL!));
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages.map(image => image.dataURL!));
  };

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Устанавливаем выбранное изображение для просмотра
  };

  const closeImage = () => {
    setSelectedImage(null); // Закрываем просмотр изображения
  };

  return (
    <div>
      {/* Dropzone для загрузки изображений */}
      <div
        {...getRootProps({ className: 'dropzone' })}
        className={`p-4 border-dashed border-2 ${
          isDragging ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/50' : 'border-gray-400'
        } cursor-pointer transition-all duration-300`}
      >
        <input {...getInputProps()} />
        {isDragging ? (
          <div className="flex flex-col items-center justify-center">
            <FaImage className="w-12 h-12 text-blue-500 mb-2" />
            <p className="text-blue-500 text-lg">Перетащите сюда</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <FaPlus className="w-8 h-8 mb-2" />
            <p>Перетащите файлы сюда или нажмите для выбора</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Компонент для загрузки изображений */}
      <ImageUploading
        multiple
        value={uploadedImages}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="dataURL"
      >
        {({ imageList }) => (
          <div className="upload__image-wrapper flex flex-wrap">
            {imageList.map((image, index) => (
              <div key={index} className="relative w-20 h-20 m-2 inline-block">
                <img
                  src={image.dataURL}
                  alt=""
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => openImage(image.dataURL!)}
                  draggable="false" // Отключаем перетаскивание загруженных изображений
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => removeImage(index)}
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>

      {/* Модальное окно для просмотра изображения в полном размере */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImage}>
          <div className="relative">
            <img
              src={selectedImage}
              alt="Полный размер"
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на изображение
              draggable="false" // Отключаем перетаскивание в модальном окне
            />
            <button
              onClick={closeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;