import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

interface ImageUploaderProps {
    image: File;
}

const PaddingThenResizeUploader: React.FC<ImageUploaderProps> = ({ image }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [padding, setPadding] = useState<number>(0); // state for padding
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string); // แปลงไฟล์เป็น base64 string
            };
            reader.readAsDataURL(image); // อ่านไฟล์ภาพจาก props
        }
    }, [image]);

      useEffect(() => {
        if (selectedImage && canvasRef.current) {
            const image = new Image();
            image.src = selectedImage;
            image.onload = () => {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d');

                // Step 1: Add Padding
                const paddedWidth = image.width + padding * 2;
                const paddedHeight = image.height + padding * 2;
                canvas.width = paddedWidth;
                canvas.height = paddedHeight;

                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(image, padding, padding);
                const downloadUrl = canvas.toDataURL('image/png');
                setDownloadUrl(downloadUrl);
            };
        }
    }, [selectedImage, padding]);

    // Resize the canvas and update download URL whenever padding or resize size changes
   
    return (
        <div>
            {selectedImage && (
                <div>
                    <h3>Processed Image (Padding first, then Resize):</h3>
                    <canvas ref={canvasRef}  style={{ maxWidth: '300px', maxHeight: '300px' }}></canvas>
                    {downloadUrl && (
                        <Button variant='contained' href={downloadUrl} download="paddedAndResizedImage.png">
                            Download Image
                        </Button>
                    )}
                    <div>
                        <label>Padding (px):</label>
                        <input type="number" value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
                  
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaddingThenResizeUploader;
