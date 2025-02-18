import React from 'react'
import ProjectImage from './ProjectLetterImage';
import { Card } from '@mui/material';
import { getImageUrl } from '../../function/util';
interface ProjectCardProps {

    name:string;
    desc: string;
    projectImage?:string;
    ai_type:string;
    ai_tags:string[];
    enable: boolean;
  }
  
const ProjectCard :React.FC<ProjectCardProps> = (props) =>{
  return (
    <Card className="mx-auto my-4 w-11/12 h-fit bg-white rounded-[10px] hover:bg-gray-100 border border-zinc-400 items-center flex p-2 ">
           {props.projectImage ? (
           <div className='mx-2 w-fit h-fit  flex items-center  '>
             <img
             className="m-2 w-[300px] h-[186px] rounded-[10px]  mx-auto border-2  justify-center object-cover"
             src={getImageUrl(props.projectImage)}
             alt={`${props.name} project`}
             />
              </div>
            ) : (
              
              <ProjectImage
              projectName={props.name}
              className="m-2  w-[300px] h-[186px] rounded-[10px] mx-2 border-2 flex items-center justify-center text-white font-medium text-3xl"
              />
            )}
            
          <div className='flex flex-col h-fit w-full'>
            <h1 className="mb-2 text-indigo-900 text-2xl font-medium">{props.name}</h1>
            <span className="mb-2 w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5   text-white text-sm font-normal">{props.ai_type}</span>
            <span>{props.desc}</span>
            <div className='mb-2 mt-2'>
            {props.ai_tags.map((tag) => (
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5   text-white text-sm font-normal">{tag}</span>
            ))}
            </div>
          </div>
        </Card>
  )
}

export default ProjectCard