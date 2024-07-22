import React from 'react'

interface ProjectCardProps {

    name:string;
    desc: string;
  }
  
const ProjectCard :React.FC<ProjectCardProps> = (props) =>{
  return (
    <div
          className="m-10 w-fit bg-white rounded-[10px] hover:bg-gray-100 border border-zinc-400 items-center flex p-2"
          >
          <img
            className="m-2 w-[186px] h-[168px] rounded-[10px] "
            src="../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png"
            />
          <div className='flex flex-col h-fit w-full'>
            <h1 className="mb-2 text-indigo-900 text-2xl font-medium">{props.name}</h1>
            <span className="mb-2 w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-sm font-normal">AI Type</span>
            <span>{props.desc}</span>
            <div className='mb-2 mt-2'>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-sm font-normal">Default</span>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-sm font-normal">Default</span>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-sm font-normal">Default</span>
            </div>
          </div>
        </div>
  )
}

export default ProjectCard