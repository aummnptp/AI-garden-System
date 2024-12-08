// import React, { useEffect, useRef, useState } from 'react';
// import Nouislider from 'nouislider-react';
// import 'nouislider/dist/nouislider.css';

// let ffmpeg: any;

// interface VideoTrimmerProps {
//   onTrimComplete?: (trimmedVideoUrl: string) => void;
// }

// const VideoTrimmer: React.FC<VideoTrimmerProps> = ({ onTrimComplete }) => {
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [endTime, setEndTime] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const [videoSrc, setVideoSrc] = useState('');
//   const [videoFileValue, setVideoFileValue] = useState<File | null>(null);
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [videoTrimmedUrl, setVideoTrimmedUrl] = useState('');
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     // Load ffmpeg script
//     const loadScript = async () => {
//       const script = document.createElement('script');
//       script.src = 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js';
//       script.async = true;
//       script.onload = () => {
//         ffmpeg = (window as any).FFmpeg.createFFmpeg({ log: true });
//         ffmpeg.load();
//         setIsScriptLoaded(true);
//       };
//       document.head.appendChild(script);
//     };
//     loadScript();
//   }, []);

//   useEffect(() => {
//     if (videoRef && videoRef.current) {
//       const currentVideo = videoRef.current;
//       currentVideo.onloadedmetadata = () => {
//         const duration = currentVideo.duration || 1; // ตั้งค่า fallback เป็น 1
//         setVideoDuration(duration);
//         setEndTime(duration);
//       };
//     }
//   }, [videoSrc]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setVideoFileValue(file);
//       setVideoSrc(URL.createObjectURL(file));
//     }
//   };

//   const convertToHHMMSS = (value: number) => {
//     const secNum = Math.floor(value);
//     const hours = Math.floor(secNum / 3600).toString().padStart(2, '0');
//     const minutes = Math.floor((secNum % 3600) / 60).toString().padStart(2, '0');
//     const seconds = (secNum % 60).toString().padStart(2, '0');
//     return hours !== '00' ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
//   };

//   const updateOnSliderChange = (values: (number | string)[], handle: number) => {
//     if (handle === 0) {
//       setStartTime(Number(values[0]));
//       if (videoRef.current) {
//         videoRef.current.currentTime = Number(values[0]);
//       }
//     } else {
//       setEndTime(Number(values[1]));
//     }
//   };

//   const handleTrim = async () => {
//     if (isScriptLoaded && videoFileValue) {
//       const { name, type } = videoFileValue;
//       ffmpeg.FS('writeFile', name, await (window as any).FFmpeg.fetchFile(videoFileValue));
//       const videoFileType = type.split('/')[1];
//       await ffmpeg.run(
//         '-i',
//         name,
//         '-ss',
//         convertToHHMMSS(startTime),
//         '-to',
//         convertToHHMMSS(endTime),
//         '-c',
//         'copy',
//         `output.${videoFileType}`
//       );
//       const data = ffmpeg.FS('readFile', `output.${videoFileType}`);
//       const trimmedUrl = URL.createObjectURL(new Blob([data.buffer], { type }));
//       setVideoTrimmedUrl(trimmedUrl);
//       if (onTrimComplete) {
//         onTrimComplete(trimmedUrl);
//       }
//     }
//   };

//   return (
//     <div className='w-fit'>
//       <h2>Video Trimmer</h2>
//       <input type="file" accept="video/*" onChange={handleFileUpload} />
//       {videoSrc && (
//         <>
//           <video
//             ref={videoRef}
//             src={videoSrc}
//             controls
//             onTimeUpdate={(e) => {
//               if (Math.floor(e.currentTarget.currentTime) >= endTime) {
//                 e.currentTarget.pause();
//               }
//             }}
//           />
//         <Nouislider
//   range={{ min: 0, max: videoDuration > 0 ? videoDuration : 1 }}
//   start={[0, videoDuration > 0 ? videoDuration : 1]}
//   step={1}
//   connect
//   onUpdate={updateOnSliderChange}
// />
//           <div>
//             <span>Start: {convertToHHMMSS(startTime)}</span> |{' '}
//             <span>End: {convertToHHMMSS(endTime)}</span>
//           </div>
//           <button onClick={handleTrim}>Trim</button>
//           {videoTrimmedUrl && (
//             <video controls>
//               <source src={videoTrimmedUrl} type={videoFileValue?.type} />
//             </video>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default VideoTrimmer;
