// import React, { useState } from 'react';
// import { createFFmpeg, fetch } from '@ffmpeg/ffmpeg';
// // มีปํญหา
// const ffmpeg = createFFmpeg({ log: true });

// const VideoTrimmer: React.FC = () => {
//   const [videoSrc, setVideoSrc] = useState<string>('');
//   const [startTime, setStartTime] = useState<number>(0);
//   const [endTime, setEndTime] = useState<number>(60); // ตัวอย่างเวลาสิ้นสุด 60 วินาที

//   const loadFFmpeg = async () => {ฟ
//     if (!ffmpeg.isLoaded()) {
//       await ffmpeg.load();
//     }
//   };

//   const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setVideoSrc(url);
//       await loadFFmpeg();
//       ffmpeg.FS('writeFile', 'input.mp4', await fetch(file));
//     }
//   };

//   const handleTrim = async () => {
//     await ffmpeg.run('-i', 'input.mp4', '-ss', `${startTime}`, '-to', `${endTime}`, '-c', 'copy', 'output.mp4');
//     const data = ffmpeg.FS('readFile', 'output.mp4');
//     const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
//     setVideoSrc(url);
//   };

//   return (
//     <div>
//       <input type="file" accept="video/*" onChange={handleVideoUpload} />
//       {videoSrc && <video src={videoSrc} controls />}
//       <div>
//         <label>
//           Start Time (seconds):
//           <input
//             type="number"
//             value={startTime}
//             onChange={(e) => setStartTime(Number(e.target.value))}
//           />
//         </label>
//         <label>
//           End Time (seconds):
//           <input
//             type="number"
//             value={endTime}
//             onChange={(e) => setEndTime(Number(e.target.value))}
//           />
//         </label>
//         <button onClick={handleTrim}>Trim</button>
//       </div>
//     </div>
//   );
// };

// export default VideoTrimmer;
