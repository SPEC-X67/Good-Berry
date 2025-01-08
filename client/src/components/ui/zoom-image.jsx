import { useState } from "react";

const ZoomImage = ({ src }) => {
  const [zoomStyle, setZoomStyle] = useState({
    "--display": "none",
    "--zoom-x": "0%",
    "--zoom-y": "0%",
    "--url": `url(${src})`,
  });

  const handleMouseMove = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      "--display": "block",
      "--zoom-x": `${x}%`,
      "--zoom-y": `${y}%`,
      "--url": `url(${src})`,
    });
  };

  const handleMouseOut = () => {
    setZoomStyle((prev) => ({
      ...prev,
      "--display": "none",
    }));
  };

  return (
    <div
      id="imageZoom"
      style={zoomStyle}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    >
      <img src={src} alt="Product" />
    </div>
  );
};

export default ZoomImage;
