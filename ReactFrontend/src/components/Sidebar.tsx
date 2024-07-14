import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="px-3 pt-6 h-full w-2/12 bg-white shadow border  fixed z-40">
        <div className='flex items-center'>
            <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full" />
                <div className=''>
                    <div className="text-neutral-400 text-base font-medium font-['Roboto'] leading-loose">In workspace</div>
                    <h1 className='text-black text-2xl font-semibold'>
                    h1 and icon
                    </h1>
                </div>
        </div>
        <div className='mx-[10%] w-fit '><span className=' text-neutral-400 text-base font-medium'>you are </span><span className='text-indigo-600 text-lg font-semibold '>Project Owner</span></div>
        <div className="mt-6 w-full border border-zinc-300"></div>
        {/* workspace menu */}
        <div className=" text-neutral-400 text-lg font-normal font-['Roboto'] leading-loose">Workspace Menu</div>
        <ul className="font-medium">
        
            <li>
                <Link to={`/workspaces/:id/project-list`}>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group  focus:ring-4 focus:bg-blue-300  ' >
                    <span className="flex-1 ms-3 whitespace-nowrap">Project List</span>
                </div>
                </Link>
            </li>
  
            <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">Workspace history</span>
                </div>
                    
            </li>
             <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">Workspace setting</span>
                </div>   
                </li>
            </ul>
            <div className="my-3 w-full border border-zinc-300"></div>
            <div className='flex items-center '>
                <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full" />
                <div className=''>
                    <div className="text-neutral-400 text-base font-medium font-['Roboto'] leading-loose">In project</div>
                    <h1 className='text-black text-2xl font-semibold'>
                    ProjectName
                    </h1>
                </div>
            </div>
            <span className='ml-[5%] w-fit  text-indigo-600 text-lg font-semibold'>AI name</span>
            <span className='text-indigo-900 text-base font-medium '> | </span>
            <span className='text-indigo-900 text-base font-medium '> ai type </span>
            <div className="mt-6 w-full border border-zinc-300"></div>
            {/* project menu */}
            <div className="text-neutral-400 text-lg font-normal font-['Roboto'] leading-loose">Project Menu</div>
        <ul className="font-medium">
            <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">detail</span>
                </div>
            </li>
            <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">upload image</span>
                </div>
                    
            </li>
             <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">upload video</span>
                </div>   
            </li>
            <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">project history</span>
                </div>   
            </li>
            <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">project setting</span>
                </div>   
            </li>
            </ul>
    
    </div>

  )
}

export default Sidebar