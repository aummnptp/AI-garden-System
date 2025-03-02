import React from 'react'

import calculateDaysPassed from '../../function/caculatedDaysPassed';
import { getImageUrl } from '../../function/util';

interface WorkspaceCardProps {
  workspaceId: string;
  name: string;
  description: string;
  createById?: string;
  createdAt: string;
  updatedAt: string;
  members: {
    id: number;
    role: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      googleId: string;
      email: string;
      name: string;
      picture: string;
    };
  }[];
}


const WorkspaceCard: React.FC<WorkspaceCardProps> = (props) => {
    return (
        <div className="mx-auto w-10/12 h-[184px] relative bg-white rounded-[15px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50 ">
          {/* left blue line card */}
        <div className="w-2.5 h-[184px] bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
          {/* content */}
          <div className="py-3  col-start-2 col-end-13 grid grid-rows-4">
            {/* upper content */}
            <div className=' row-span-4'>
              <h1 className="text-indigo-900 text-2xl font-medium">
              {props.name}
              </h1>
              <p className='text-neutral-700 pr-4'>{props.description}</p>
              <div
              className=" absolute top-0 right-0 m-3 hover:bg-gray-100 rounded-md w-5 text-center">
                {/* <MoreOutlined style={{color:'#999'}}/> */}
                </div>
            </div>
            {/* lower content */}
            <div className='grid grid-cols-3 bg'>
              <div className='col-span-2'>
                <p className='text-black text-xs font-normal'>{props.members.length} member</p>
                <p className='text-black text-xs font-normal'>{calculateDaysPassed(props.updatedAt)}</p>
              </div>
            <div className="flex -space-x-2 justify-end pr-2">
  
              {props.members.slice(0, 2).map((member, index) => (
                <img 
                key={index} 
                className="w-8 h-8 rounded-full border-2 border-white" 
                src={getImageUrl(member.user.picture)|| "/images/homeImage/profile.webp"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/homeImage/profile.webp"; 
                }} 
                alt={member.user.name}
                />
              ))}

              {props.members.length > 2 && (
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-700">
                  +{props.members.length - 2}
                </div>
              )}
            </div>
      </div>    
          </div>
        </div>
    );
  };
  
  export default WorkspaceCard;


  
