import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

const ImageUploader: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [rotation, setRotation] = useState<number>(0); // state for rotation
    const [isGrayscale, setIsGrayscale] = useState<boolean>(false); // state for grayscale
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

    const handleRotateLeft = () => {
        setRotation((prev) => prev - 90);
    };

    const handleRotateRight = () => {
        setRotation((prev) => prev + 90);
    };

    const toggleGrayscale = () => {
        setIsGrayscale((prev) => !prev);
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
                
                ctx?.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

                ctx?.save();
                ctx?.translate(canvas.width / 2, canvas.height / 2); // move to center
                ctx?.rotate((rotation * Math.PI) / 180); // rotate canvas
                ctx?.drawImage(image, -image.width / 2, -image.height / 2); // draw image
                ctx?.restore();

                if (isGrayscale) {
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
                    }
                }

                const downloadUrl = canvas.toDataURL('image/png');
                setDownloadUrl(downloadUrl);
            };
        }
    }, [selectedImage, rotation, isGrayscale]);

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {selectedImage && (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {/* Display Original Image */}
              <div>
                  <h3>Original Image:</h3>
                  <img src={selectedImage} alt="Original" style={{ maxWidth: '300px', maxHeight: '300px' }} />
              </div>   {/* Display Processed Image */}
                    <div>
                        <h3>Processed Image:</h3>
                    <canvas ref={canvasRef}  style={{ maxWidth: '300px', maxHeight: '300px' }}></canvas>
                    <div>
                     
                        <Button variant='contained' onClick={handleRotateLeft}>Rotate Left (-90°)</Button>
                        <Button variant='contained' onClick={handleRotateRight}>Rotate Right (+90°)</Button>
                        <Button variant='contained' onClick={toggleGrayscale}>   {isGrayscale ? 'Remove Grayscale' : 'Apply Grayscale'}</Button>
                    </div>
                    {downloadUrl && (
                        <Button variant='contained' href={downloadUrl} download="grayscale-image.png">
                            <button>Download Image</button>
                        </ Button >
                    )} 
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
