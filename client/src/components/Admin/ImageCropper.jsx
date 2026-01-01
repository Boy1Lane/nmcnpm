import { useCallback, useState } from "react";
import { Modal, Slider, Button } from "antd";
import Cropper from "react-easy-crop";

// Helper: create cropped image blob from image and crop area
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      0.95
    );
  });
}

export default function ImageCropper({
  visible,
  src,
  aspect = 2 / 3,
  onCancel,
  onCropDone,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((area, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleOk = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedImg(src, croppedAreaPixels);
    onCropDone && onCropDone(blob);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Áp dụng"
      cancelText="Hủy"
      width={800}
      destroyOnClose
    >
      <div style={{ position: "relative", width: "100%", height: 480 }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <Slider min={1} max={3} step={0.01} value={zoom} onChange={setZoom} />
        </div>
        <Button onClick={handleOk} type="primary">
          Áp dụng
        </Button>
      </div>
    </Modal>
  );
}
