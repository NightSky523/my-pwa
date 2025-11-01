import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export function ImagePreview({ isOpen, onClose, imageUrl, alt }: ImagePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/90 shadow-none flex items-center justify-center"
        showCloseButton={false}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/20 text-white rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}