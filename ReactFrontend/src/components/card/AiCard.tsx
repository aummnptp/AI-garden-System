import { SendOutlined } from '@ant-design/icons';
import React from 'react'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import axios from 'axios';

import ProjectImage from './ProjectLetterImage';


interface AiCardProps {
    id:number;
    name:string;
    aiDesc: string;
    img:string;
    type: string;
    tags:string[];
  }

  
  const AiCard: React.FC<AiCardProps> = (props) => {

    const handleSendRequest = async () => {
      console.log("AI ID (props.id):", props.id); // Debug
      try {
        const response = await axios.post(
          "http://localhost:3000/ai-permission/add",
          { ai_id: props.id }, // ต้องส่ง aiId ไป
          { withCredentials: true }
        );
        alert(`คำขอใช้งาน AI ถูกส่งเรียบร้อย: ${response.data.message || 'สำเร็จ'}`);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งคำขอใช้งาน:', error);
        alert('ไม่สามารถส่งคำขอใช้งานได้');
      }
    };
    
  return (
    <Link to={`/ai/${props.id}/detail`}>
  
    <div className="mx-auto mt-10 pb-5 w-9/12 h-fit bg-white shadow border items-center  hover:bg-gray-100 b">
    {/* {props.img ? (
          //  <div className='mx-2 w-fit h-fit  flex items-center  '>
          //    <img
          //    className="m-2 w-[300px] h-[186px] rounded-[10px]  mx-auto border-2  justify-center object-cover"
          //    src={props.img}
          //    alt={`${props.name} project`}
          //    />
          //     </div>
            ) : ( */}
              
              {/* <ProjectImage
              projectName={props.name}
              className="  w-full h-[186px] rounded-[10px]  border-2 flex items-center justify-center text-white font-medium text-3xl"
              /> */}
            {/* )} */}
          <img
            className=" w-full h-48 
            object-cover"
            src={props.img}
            />
        <div className='px-4'>


          <h1 className="p-2 text-indigo-900  text-2xl font-medium">
            {props.name}
          </h1>
       
          <span className=" mx-2 mb-2 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-xs font-normal">
          {props.type}
          </span>
          <div className="text-gray-600 text-sm line-clamp-4">
          {props.aiDesc}
          </div>
          
          <div className=' p-2 mb-2'>
          {props.tags.map((tag) => (
              <span  className="w-fit bg-sky-500 rounded-[10px] me-2 px-2.5 py-0.5    text-white text-xs font-normal">{tag}</span>
            ))}
            </div>
            <div className="flex justify-center"> 
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#4f46e5',
                '&:hover': { backgroundColor: '#3730a3' },
              }}

            >

              <SendOutlined  style={{color:"#fff",marginRight:"4px"}}/>ดูรายละเอียด
              </Button>

          </div>
          </div>
        </div>
        </Link>
  )
}

export default AiCard