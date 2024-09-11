import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

interface ImageUploaderProps {
    image: File;
}

const PaddingThenResizeUploader: React.FC<ImageUploaderProps> = ({ image }) => {
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
                // Step 1: Add Padding
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext('2d');
                const paddedWidth = image.width + padding * 2;
                const paddedHeight = image.height + padding * 2;
                canvas.width = paddedWidth;
                canvas.height = paddedHeight;

                ctx?.clearRect(0, 0, canvas.width, canvas.height);
                ctx?.drawImage(image, padding, padding);

                // Step 2: Resize
                const resizedCanvas = document.createElement('canvas');
                const resizedCtx = resizedCanvas.getContext('2d');
                resizedCanvas.width = resizeWidth;
                resizedCanvas.height = resizeHeight;

                resizedCtx?.drawImage(canvas, 0, 0, resizeWidth, resizeHeight);

                const downloadUrl = resizedCanvas.toDataURL('image/png');
                setDownloadUrl(downloadUrl);
            };
        }
    }, [selectedImage, padding, resizeWidth, resizeHeight]);

    return (
        <div>
            {selectedImage && (
                <div>
                    <h3>Processed Image (Padding first, then Resize):</h3>
                    <canvas ref={canvasRef}></canvas>
                    {downloadUrl && (
                        <Button variant='contained' href={downloadUrl} download="paddedAndResizedImage.png">
                            Download Image
                        </Button>
                    )}
                    <div>
                        <label>Padding (px):</label>
                        <input type="number" value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
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

export default PaddingThenResizeUploader;
