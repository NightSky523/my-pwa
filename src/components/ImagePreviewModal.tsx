import { useState, useCallback } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

interface ImagePreviewModalProps {
  images: string[];
  initialSlide: number;
}

export const ImagePreviewModal = NiceModal.create(({ images, initialSlide }: ImagePreviewModalProps) => {
  const [index, setIndex] = useState(initialSlide);
  const modal = NiceModal.useModal();

  // 处理关闭事件
  const handleClose = useCallback(() => {
    modal.hide();
  }, [modal]);

  // 处理索引变化
  const handleIndexChange = useCallback(({ index: currentIndex }: { index: number }) => {
    setIndex(currentIndex);
  }, []);

  // 当模态框不可见时不渲染
  if (!modal.visible) return null;

  // 将图片字符串数组转换为 lightbox 需要的格式
  const slides = images.map((image) => ({ src: image }));

  return (
    <Lightbox
      slides={slides}
      open={modal.visible}
      index={index}
      close={handleClose}
      on={{
        view: handleIndexChange,
      }}
      // 添加插件
      plugins={[Zoom, Counter]}
      // 缩放配置
      zoom={{
        maxZoomPixelRatio: 3, // 最大缩放比例
        zoomInMultiplier: 2, // 放大倍数
        doubleTapDelay: 300, // 双击延迟
        doubleClickDelay: 300, // 双击延迟
        scrollToZoom: true, // 启用滚动缩放
      }}
      // 全屏配置
    
      // 计数器配置
      counter={{
        style: {
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        },
      }}
      // 自定义样式和配置
      carousel={{
        finite: false, // 允许无限循环
        preload: 2, // 预加载前后各2张图片
      }}
      // 添加动画效果
      animation={{
        fade: 250, // 淡入淡出动画时间
        swipe: 300, // 滑动动画时间
      }}
      // 自定义渲染
      render={{
        // 隐藏左右箭头导航按钮
        buttonPrev: () => null,
        buttonNext: () => null,
        // 自定义关闭按钮
        buttonClose: () => (
          <button
            key="close-button"
            onClick={handleClose}
            className="yarl__button yarl__button_close"
            aria-label="关闭"
          >
            <svg className="yarl__icon" viewBox="0 0 24 24" width="24" height="24">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        ),
      }}
      // 自定义工具栏按钮
      toolbar={{
        buttons: ["counter", "zoom",  "close"],
      }}
    />
  );
});

export const showImagePreview = (images: string[], initialSlide = 0) => {
  return NiceModal.show(ImagePreviewModal, { images, initialSlide });
};