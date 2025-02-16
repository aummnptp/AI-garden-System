

export interface PaddingOptions {
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingSymmetric?: number;
}

export const processPaddingEffect = (
  canvas: HTMLCanvasElement,
  imageSrc: string,
  paddingMode: "custom" | "symmetric" | "square",
  options: PaddingOptions
): Promise<{ dataUrl: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const ctx = canvas.getContext("2d")!;
      let newWidth = 0;
      let newHeight = 0;

      if (paddingMode === "custom") {
        const pl = options.paddingLeft || 0;
        const pr = options.paddingRight || 0;
        const pt = options.paddingTop || 0;
        const pb = options.paddingBottom || 0;
        newWidth = img.width + pl + pr;
        newHeight = img.height + pt + pb;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, pl, pt);
      } else if (paddingMode === "symmetric") {
        const pad = options.paddingSymmetric || 0;
        newWidth = img.width + pad * 2;
        newHeight = img.height + pad * 2;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, pad, pad);
      } else if (paddingMode === "square") {
        newWidth = newHeight = Math.max(img.width, img.height);
        const paddingHorizontal = (newWidth - img.width) / 2;
        const paddingVertical = (newHeight - img.height) / 2;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, paddingHorizontal, paddingVertical);
      }

      const dataUrl = canvas.toDataURL("image/png");
      resolve({ dataUrl, width: newWidth, height: newHeight });
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};



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