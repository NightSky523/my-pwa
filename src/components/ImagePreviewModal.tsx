import { useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface ImagePreviewModalProps {
  images: string[];
  initialSlide: number;
}

export const ImagePreviewModal = NiceModal.create(({ images, initialSlide }: ImagePreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const modal = NiceModal.useModal();

  // 当模态框不可见时不渲染
  if (!modal.visible) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div 
        className="fixed inset-0 z-50 bg-black" 
        onClick={modal.hide}
      />
      
      {/* 内容区域 */}
      <div 
        className="fixed inset-0 z-50 w-screen h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={modal.hide}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
          aria-label="关闭"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Swiper 轮播 */}
        <div className="w-full h-full p-4">
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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white bg-black/70 py-2 px-4 rounded-lg pointer-events-none">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </>
  );
});

export const showImagePreview = (images: string[], initialSlide = 0) => {
  return NiceModal.show(ImagePreviewModal, { images, initialSlide });
};