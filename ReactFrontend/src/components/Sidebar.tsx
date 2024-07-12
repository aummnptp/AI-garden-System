import React from 'react'

const Sidebar = () => {
  return (
    <div className="p-3 h-full w-11/12 bg-white shadow border relative col-span-2">
        <div className="text-neutral-400 text-base font-medium font-['Roboto'] leading-loose">In workspace</div>
        <div className='flex items-center '>
            <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full" />
            <h1 className='text-black text-2xl font-semibold'>
            h1 and icon
            </h1>
        </div>
        <div className='mx-auto'><p>youre are Role</p></div>
        <div className="my-2 w-full border border-zinc-300"></div>
        <div className="text-neutral-400 text-lg font-normal font-['Roboto'] leading-loose">Workspace Menu</div>
        <ul className="font-medium">
            <li>
                <div className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                    <span className="flex-1 ms-3 whitespace-nowrap">Project List</span>
                </div>
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
            <div className="w-full border border-zinc-300"></div>
            <div className="text-neutral-400 text-base font-medium font-['Roboto'] leading-loose">In project</div>
            <div className='flex items-center '>
                <div className="mx-1 w-[45px] h-[45px] bg-blue-100 rounded-full" />
                <h1 className='text-black text-2xl font-semibold'>
                ProjectName
                </h1>
            </div>
            <span className='text-indigo-600 text-lg font-semibold'>AI name</span>
            <span className='text-indigo-900 text-base font-medium '> | </span>
            <span className='text-indigo-900 text-base font-medium '> ai type </span>
            <div className="my-2 w-full border border-zinc-300"></div>
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