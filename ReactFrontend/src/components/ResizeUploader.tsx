import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

interface ImageUploaderProps {
    image: File;
    onProcessedImage: (processedImageUrl: string) => void; 
}

const ResizeUploader: React.FC<ImageUploaderProps> = ({ image,  onProcessedImage }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [padding, setPadding] = useState<number>(0); // state for padding
    const [resizeWidth, setResizeWidth] = useState<number>(300); // state for resize width
    const [resizeHeight, setResizeHeight] = useState<number>(300); // state for resize height
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

                // Step 1: Resize
                canvas.width = resizeWidth;
                canvas.height = resizeHeight;
                ctx?.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
                ctx?.drawImage(image, 0, 0, resizeWidth, resizeHeight);

             
                const processedImageUrl = canvas.toDataURL('image/png');
                setDownloadUrl(downloadUrl);
                onProcessedImage(processedImageUrl); 
             
            };
        }
    }, [selectedImage, padding, resizeWidth, resizeHeight]);

    return (
        <div>
            {selectedImage && (
                <div>
                    <h3>Processed Image (Resize first, then Padding):</h3>
                    <canvas ref={canvasRef}></canvas>
                    {downloadUrl && (
                        <Button variant='contained' href={downloadUrl} download="resizedAndPaddedImage.png">
                            Download Image
                        </Button>
                    )}
                    <div>
                        <label>Resize Width (px):</label>
                        <input type="number" value={resizeWidth} onChange={(e) => setResizeWidth(Number(e.target.value))} />
                        <label>Resize Height (px):</label>
                        <input type="number" value={resizeHeight} onChange={(e) => setResizeHeight(Number(e.target.value))} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResizeUploader;
