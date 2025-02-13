import React from 'react'
import { Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

interface AdminAiCardProps {
    id:string;
    name:string;
    aiDesc: string;
    img:string;
    type: string;
    tags:string[];
  }
const AdminAiCard:React.FC<AdminAiCardProps> = (props) => { 
    return (
        <Link to={`/admin/updateai/${props.id}`}>
        {/* <div className="mx-auto mt-10  pb-5 w-9/12 h-fit bg-white shadow border items-center  hover:bg-gray-100 b"> */}
        <Card sx={{ minWidth: 275 }}>
        <CardContent>
        
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
              <p className=" text-gray-600 text-sm line-clamp-4">
              {props.aiDesc}
              </p>
              
              <div className=' p-2 mb-2'>
              {props.tags.map((tag) => (
                  <span  className="w-fit bg-sky-500 rounded-[10px] me-2 px-2.5 py-0.5    text-white text-xs font-normal">{tag}</span>
                ))}
                </div>
                <div className="flex justify-center"> 
                {/* <Button
                  variant="contained"
                //   size=""
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
                  >
                  <EditOutlined style={{color:"#fff",marginRight:"4px"}}/>แก้ไข
                  </Button> */}
              </div>
              </div>
            </CardContent>
            </Card>
            {/* </div> */}
            </Link>
      )
}

export default AdminAiCard