import React, { useState, useEffect, useRef } from 'react';

const ImageUploader: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (selectedImage && canvasRef.current) {
            const image = new Image();
            image.src = selectedImage;
            image.onload = () => {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                ctx?.drawImage(image, 0, 0);
                const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

                if (imageData && ctx) {
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = avg;     // Red
                        data[i + 1] = avg; // Green
                        data[i + 2] = avg; // Blue
                    }
                    ctx.putImageData(imageData, 0, 0);

                    // สร้าง URL สำหรับการดาวน์โหลด
                    const downloadUrl = canvas.toDataURL('image/png');
                    setDownloadUrl(downloadUrl);
                }
            };
        }
    }, [selectedImage]);

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {selectedImage && (
                <>
   
                    <canvas ref={canvasRef}></canvas>
   
                    {downloadUrl && (
                        <a href={downloadUrl} download="grayscale-image.png">
                            <button>Download Grayscale Image</button>
                        </a>
                    )}
                </>
            )}
        </div>
    );
};

export default ImageUploader;
