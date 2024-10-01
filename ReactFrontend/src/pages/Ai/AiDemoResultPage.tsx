import React, { useState } from 'react'

const AiDemoResultPage = () => {
    const [uploadStep, setUploadStep] = useState(1);
    const [image, setImage] = useState<File | null>(null);
    // first step of customimage for rotate grayscale
    const [customImage, setCustomImage] = useState<File | null>(image);
    const [open, setOpen] = React.useState(false);
    const [customedImageUrl, setCustomedImageUrl] = useState<string | null>(null); // URL ของรูปที่กำลังแสดง
  return (
    <div>AiDemoResultPage</div>
  )
}

export default AiDemoResultPage