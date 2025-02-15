import { SendOutlined } from '@ant-design/icons';
import React from 'react'
import { Button, Card, CardContent,} from '@mui/material';
import { Link } from 'react-router-dom';




interface AiCardProps {
    id:string;
    name:string;
    aiDesc: string;
    img:string;
    type: string;
    tags:string[];
  }

  
  const AiCard: React.FC<AiCardProps> = (props) => {
    return (
      <Link to={`/ai/${props.id}/detail`} className="w-full">
        <Card className="w-full h-full flex flex-col shadow-md rounded-lg">
          {/* Image */}
          <div className="w-full h-48">
            <img
              className="w-full h-full object-cover rounded-t-lg"
              src={props.img}
              alt={props.name}
            />
          </div>
  
          {/* Card Content */}
          <CardContent className="flex flex-col justify-between flex-grow p-4">
            <div className="w-full text-left">
              {/* ชื่อ AI */}
              <h1 className="text-indigo-900 text-lg font-semibold mb-1">
                {props.name}
              </h1>
  
              {/* ประเภท AI */}
              <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-lg">
                {props.type}
              </span>
  
              {/* คำอธิบาย AI */}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {props.aiDesc}
              </p>
  
              {/* แท็ก AI */}
              <div className="flex flex-wrap gap-2 mt-2">
                {props.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-sky-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
  
            {/* ปุ่มดูรายละเอียด */}
            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#4f46e5",
                  "&:hover": { backgroundColor: "#3730a3" },
                }}
              >
                <SendOutlined style={{ color: "#fff", marginRight: "4px" }} />
                ดูรายละเอียด
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };
  
  export default AiCard;