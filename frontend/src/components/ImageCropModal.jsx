import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import getCroppedImg from "@/utils/getCroppedImg";

const ImageCropModal = ({
  open,
  onClose,
  imageSrc,
  type,
  onCropCompleteAction,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      // Different resolutions for different image types
      let width, height;

      if (type === "avatar") {
        width = 512;
        height = 512;
      } else if (type === "logo") {
        width = 512;
        height = 512; // Square logo for company
      } else if (type === "cover") {
        width = 1200;
        height = 675; // 16:9 aspect ratio for cover images
      } else {
        // Default fallback
        width = 512;
        height = 512;
      }

      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        width,
        height
      );
      onCropCompleteAction(croppedImage);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === "avatar" && "Crop Avatar"}
            {type === "logo" && "Crop Company Logo"}
            {type === "cover" && "Crop Cover Image"}
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={type === "avatar" || type === "logo" ? 1 / 1 : 16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape={type === "avatar" || type === "logo" ? "round" : "rect"}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop & Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropModal;
