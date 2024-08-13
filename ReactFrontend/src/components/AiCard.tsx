import { SendOutlined } from '@ant-design/icons';
import React from 'react'
import { Button } from '@mui/material';

interface AiCardProps {
    id:number;
    name:string;
    aiDesc: string;
    img:string;
    type: string;
    tags:string[];
  }

const AiCard :React.FC<AiCardProps> = (props) => {
  return (
    <div className="mx-auto mt-10 pb-5 w-9/12 h-fit bg-white shadow border items-center ">
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
          <p className=" p-2">
          {props.aiDesc}
          </p>
          
          <div className=' p-2 mb-2'>
          {props.tags.map((tag) => (
              <span  className="w-fit bg-sky-500 rounded-[10px] me-2 px-2.5 py-0.5   text-white text-xs font-normal">{tag}</span>
            ))}
            </div>
            <div className="flex justify-center"> 
              <button
                type="button"
                className=" items-center text-white bg-indigo-600 rounded-[15px] hover:bg-blue-800
                font-medium  text-sm px-5 py-2.5 me-2 mb-2">
                <SendOutlined  style={{color:"#fff",marginRight:"4px"}}/>ส่งคำขอใช้งาน
              </button>
             {/* <Button text={"ส่งคำขอใช้งาน"}>

             </Button> */}
            {/* <Button variant="contained">Contained</Button> */}
                {/* <SendOutlined  style={{color:"#fff",marginRight:"4px"}}/>ส่งคำขอใช้งาน */}
              {/* </button> */}
          </div>
          </div>
        </div>
  )
}

export default AiCard