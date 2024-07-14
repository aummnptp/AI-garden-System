import React from 'react'

interface AiCardProps {
    id:number;
    name:string;
    aiDesc: string;
    type: string;
    tags:string[];
  }

const AiCard :React.FC<AiCardProps> = (props) => {
  return (
    <div className="m-10 w-8/12 bg-white shadow border items-center ">
          <img
            className=" w-full h-3/6   
            object-cover"
            src="../../public/images/homeImage/puttipong.jpg"
            />

          <h1 className="p-2 mb-2 text-black text-[25px] font-semibold">
            {props.name}
          </h1>
       
          <span className=" mx-2 mb-2 w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">
          {props.type}
          </span>
          <p className=" p-2">
          {props.aiDesc}
          </p>
          <div className=' p-2 mb-2'>
          {props.tags.map((tag) => (
              <span  className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">{tag}</span>
            ))}
              </div>
        </div>
  )
}

export default AiCard