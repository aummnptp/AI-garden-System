export const processResizeEffect = (
  canvas: HTMLCanvasElement,
  imageSrc: string,
  newWidth: number,
  newHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Cannot get canvas context");
        return;
      }
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
  });
};