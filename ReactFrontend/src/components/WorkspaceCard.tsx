import React from 'react'

import {MoreOutlined}  from '@ant-design/icons';

interface WorkspaceCardProps {
  id: number;
  name:string;
  desc: string;
  members: { name: string; avatar: string }[];
  createAt:string;
  updateAt:string;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = (props) => {
    return (
        <div className="mt-5 w-10/12 h-[184px] relative bg-white rounded-[15px] border border-zinc-400 grid grid-cols-12 hover:bg-gray-50">
          {/* left blue line card */}
        <div className="w-2.5 h-[184px] bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
          {/* content */}
          <div className="py-3  col-start-2 col-end-13 grid grid-rows-4">
            {/* upper content */}
            <div className=' row-span-4'>
              <h1 className="text-indigo-900 text-lg font-semibold">
              {props.name}
              </h1>
              <p className='text-black/opacity-75 text-xs font-normal pr-4'>{props.desc}</p>
              <div
              className=" absolute top-0 right-0 m-3 hover:bg-gray-100 rounded-md w-5 text-center"><MoreOutlined style={{color:'#999'}}/></div>
            </div>
            {/* lower content */}
            <div className='grid grid-cols-3 bg'>
              <div className='col-span-2'>
                <p className='text-black/opacity-75 text-xs font-normal'>{props.members.length} member</p>
                <p className='text-black/opacity-75 text-xs font-normal'>{props.createAt}</p>
              </div>
            <div className="flex -space-x-2">
              {props.members.slice(0, 2).map((member, index) => (
                <img 
                key={index} 
                className="w-8 h-8 rounded-full border-2 border-white" 
                src={member.avatar} 
                alt={member.name} 
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


  
