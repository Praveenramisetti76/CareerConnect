export default function getCroppedImg(
  imageSrc,
  crop,
  outputWidth = 512,
  outputHeight = 512
) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Handle CORS if needed
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      // Set canvas to desired output resolution
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw the cropped portion and scale it to the output resolution
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Canvas is empty");
          const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
          resolve(file);
        },
        "image/jpeg",
        0.95
      ); // Increased quality to 95% for better output
    };
    image.onerror = (error) => reject(error);
  });
}
