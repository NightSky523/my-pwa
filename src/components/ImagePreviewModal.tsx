import { useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface ImagePreviewModalProps {
  images: string[];
  initialSlide: number;
}

export const ImagePreviewModal = NiceModal.create(({ images, initialSlide }: ImagePreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const modal = NiceModal.useModal();

  const handleClose = () => {
    modal.hide();
  };

  return (
    <DialogPrimitive.Root 
      open={modal.visible}
      onOpenChange={(open: boolean) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black" 
          onClick={handleClose} 
        />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 w-screen h-screen max-w-none max-h-none p-0 bg-transparent border-none top-0 left-0 translate-x-0 translate-y-0 gap-0 rounded-none shadow-none pointer-events-none"
          onEscapeKeyDown={handleClose}
        >
          <DialogPrimitive.Title className="sr-only">图片预览</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            使用滑动手势或按钮浏览图片，双指缩放查看细节
          </DialogPrimitive.Description>
          
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 pointer-events-auto"
            aria-label="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full h-full p-4 pointer-events-auto">
            <Swiper
              modules={[Zoom]}
              spaceBetween={0}
              slidesPerView={1}
              zoom={{ maxRatio: 3, minRatio: 1, toggle: true }}
              initialSlide={initialSlide}
              onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              className="w-full h-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                    <img
                      src={image}
                      alt={`预览图片 ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 图片序号指示器 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white bg-black/70 py-2 px-4 rounded-lg z-60 pointer-events-none">
            {currentIndex + 1} / {images.length}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
});

export const showImagePreview = (images: string[], initialSlide = 0) => {
  return NiceModal.show(ImagePreviewModal, { images, initialSlide });
};