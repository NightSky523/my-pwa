import { useTranslation } from "react-i18next";
import {
  Heart,
  Eye,
  ChevronRight,
  MessageSquare,
  Info,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { showImagePreview } from "@/components/ImagePreviewModal";

export function ProfilePage() {
  const { t } = useTranslation();

  // 定义图片数组
  const profileImages = [
    "https://picsum.photos/seed/profile1/800/400.jpg",
    "https://picsum.photos/seed/profile2/800/400.jpg",
    "https://picsum.photos/seed/profile3/800/400.jpg",
    "https://picsum.photos/seed/profile4/800/400.jpg",
  ];

  // 处理图片点击事件
  const handleImageClick = (index: number) => {
    showImagePreview(profileImages, index);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overflow-x-hidden">
      <div className="h-55 w-full bg-secondary">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="h-full w-full"
        >
          {profileImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${t("profile.userPhoto")}${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="px-4 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://picsum.photos/seed/profile5/100/100.jpg"
              alt={t("profile.avatar")}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="text-xl font-bold">Lisa,26</h3>
              <p className="text-sm text-muted-foreground">女</p>
            </div>
            <div className="text-sm">
              <p>{t("profile.location")}</p>
              <p className="flex flex-col md:flex-row">  
                  <span>ip地址:</span>
                  <span>中国浙江</span>
                </p>
            </div>
          </div>
          <Link to="/my/profile" className="text-yellow-500 flex items-center hover:text-yellow-600 transition-colors">
            <div className="flex items-center flex-col-reverse md:flex-row">
              {t("profile.unverified")}
              <ShieldAlert size={18} className="ml-1 " />
            </div>
            <ChevronRight size={28} className="text-foreground ml-1" />
          </Link>
        </div>

        <div className="mt-2 flex flex-wrap gap-1 w-1/2">
          <Badge variant="secondary">{t("profile.interests.food")}</Badge>
          <Badge variant="secondary">{t("profile.interests.sports")}</Badge>
          <Badge variant="secondary">{t("profile.interests.gaming")}</Badge>
          <Badge variant="secondary">{t("profile.interests.music")}</Badge>
          <Badge variant="secondary">{t("profile.interests.nature")}</Badge>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex items-center justify-center flex-1 bg-secondary rounded-md p-2">
            <Heart size={18} className="text-red-500 mr-1" />
            <span className="font-bold">1023</span>
          </div>
          <div className="flex items-center justify-center flex-1 bg-secondary rounded-md p-2">
            <Eye size={18} className="text-blue-500 mr-1" />
            <span className="font-bold">1023</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <button className="flex items-center justify-between w-full p-4 border-b">
          <span className="text-foreground flex items-center">
            <Heart size={18} className="mr-1" />
            {t("profile.myLikes")}
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <Link to="/my/vip" className="flex items-center justify-between w-full p-4 border-b hover:bg-secondary/50 transition-colors">
          <span className="text-foreground flex items-center">
            <MessageSquare size={18} className="mr-1" />
            会员等级
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
        <button className="flex items-center justify-between w-full p-4 border-b">
          <span className="text-foreground flex items-center">
            <MessageSquare size={18} className="mr-1" />
            {t("profile.datingHistory")}
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <button className="flex items-center justify-between w-full p-4 border-b">
          <span className="text-foreground flex items-center">
            <Info size={18} className="mr-1" />
            {t("profile.aboutUs")}
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <Link
          to="/my/settings"
          className="flex items-center justify-between w-full p-4 border-b"
        >
          <span className="text-foreground flex items-center">
            <Settings size={18} className="mr-1" />
            {t("profile.settingsPage")}
          </span>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
