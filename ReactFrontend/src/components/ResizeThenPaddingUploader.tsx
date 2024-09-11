import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

interface ImageUploaderProps {
    image: File;
}

const ResizeThenPaddingUploader: React.FC<ImageUploaderProps> = ({ image }) => {
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

                // Step 2: Add Padding
                const paddedCanvas = document.createElement('canvas');
                const paddedCtx = paddedCanvas.getContext('2d');
                const paddedWidth = resizeWidth + padding * 2;
                const paddedHeight = resizeHeight + padding * 2;
                paddedCanvas.width = paddedWidth;
                paddedCanvas.height = paddedHeight;

                paddedCtx?.clearRect(0, 0, paddedWidth, paddedHeight);
                paddedCtx?.drawImage(canvas, padding, padding);

                const downloadUrl = paddedCanvas.toDataURL('image/png');
                setDownloadUrl(downloadUrl);
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

export default ResizeThenPaddingUploader;
