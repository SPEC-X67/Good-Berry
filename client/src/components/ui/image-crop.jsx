import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 95,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropDialog({ isOpen, onClose, image, onCropComplete }) {
  const [crop, setCrop] = useState();
  const [aspect] = useState(1);
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleCropComplete = async () => {
    if (!crop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = imgRef.current;

    // Get the actual dimensions
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to match the cropped area at full resolution
    canvas.width = Math.round(crop.width * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the image with proper scaling
    ctx.drawImage(
      image,
      Math.round(crop.x * scaleX),
      Math.round(crop.y * scaleY),
      Math.round(crop.width * scaleX),
      Math.round(crop.height * scaleY),
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to blob with high quality
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas to Blob conversion failed');
          return;
        }
        
        // Preserve original file name and extension if possible
        const originalFileName = image.src.split('/').pop()?.split('?')[0] || 'cropped-image';
        const fileExtension = originalFileName.split('.').pop() || 'jpeg';
        const newFileName = `cropped-${originalFileName}`;
        
        const croppedFile = new File([blob], newFileName, { 
          type: `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`
        });
        
        onCropComplete(croppedFile);
        onClose();
      },
      image.src.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
      1.0 // Maximum quality (1.0)
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative max-h-[500px] p-1 overflow-auto no-scrollbar">
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              aspect={aspect}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                alt="Crop"
                src={image}
                onLoad={onImageLoad}
                className="max-w-full"
              />
            </ReactCrop>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}