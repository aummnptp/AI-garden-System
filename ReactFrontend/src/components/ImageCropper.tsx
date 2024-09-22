import { FormControl, FormControlLabel, FormLabel, Hidden, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react'
    import Cropper from 'react-easy-crop'

    interface CroppedArea {
        x: number;
        y: number;
        width: number;
        height: number;
      }
      
      interface ImageCropperProps {
        image: string; // path หรือ URL ของรูปภาพที่ต้องการครอบ
        onCropDone: (croppedArea: CroppedArea | null) => void;
        onCropCancle: () => void;
      }
const ImageCropper: React.FC<ImageCropperProps> = ({ image ,onCropDone,onCropCancle}) => {
    const [crop,setCrop] =useState({x:0,y:0});
    const [zoom,setZoom] =useState(1)
    const [croppedArea, setCroppedArea] = useState<CroppedArea | null>(null);
    const [aspectRatio,setAspectRatio] = useState(4/3);

    const onCropComplete = (croppedAreaPercentage: any, croppedAreaPixels: CroppedArea) => {
        setCroppedArea(croppedAreaPixels);
      };
    
      const onAspectRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAspectRatio(parseFloat(event.target.value));
      };

  return (
    <div className="w-full flex  items-center space-y-4  ">
        <div className="relative w-[50%] h-[350px] mx-auto  ">
            <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              overflow: 'hidden',
              width: '100%',
              height: '350px',
              backgroundColor: '#fff',
            },
          }}
        />
         </div>
        <div className='w-[40%]'>  
            <div className="w-full flex  bg-red-200">
                    <FormControl>
                    <FormLabel id="ratio-radio-buttons-group-label">Ratio</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="ratio-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={onAspectRatioChange}
                        >
                        <FormControlLabel value={1 / 1} name="ratio" control={<Radio />} label="1:1" />
                        <FormControlLabel value={5 / 4} name="ratio" control={<Radio />} label="5:4" />
                        <FormControlLabel value={4 / 3} name="ratio" control={<Radio />} label="4:3" />
                        <FormControlLabel value={3 / 2} name="ratio" control={<Radio />} label="3:2" />
                        <FormControlLabel value={16 / 9} name="ratio" control={<Radio />} label="16:9" />
                        <FormControlLabel value={3 / 1} name="ratio" control={<Radio />} label="3:1" />
                    </RadioGroup>
                    </FormControl>
            </div>
  <div className="w-full flex justify-center mt-4  gap-4">
    <button onClick={onCropCancle} className="bg-gray-200 p-2 rounded bg0">
      Cancel
    </button>
    <button onClick={() => onCropDone(croppedArea)} className="bg-blue-500 text-white p-2 rounded">
      Save
    </button>
  </div>

        </div>
    </div>
  )
}

export default ImageCropper