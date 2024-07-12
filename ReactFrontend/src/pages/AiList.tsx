import React from "react";

function AIlist() {
  return (
    <div className=" bg-neutral-100  items-center justify-center h-full pb-32 grid grid-cols-1">
      {/* top card (create sort workspace name) */}
      <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
        <h1
          className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
          text-indigo-900 dark:text-white "
        >
          AI List
        </h1>
        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
        <div className="m-6 flex justify-start">
          <div>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              ชื่อsort
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              ประเภท filter
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
              dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              ประเภท filter
            </button>
          </div>
        </div>
        <div className="m-6 flex justify-start gap-4">
          <input
            type="text"
            id="first_name"
            className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาชื่อโปรเจค"
            required
          />
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800
                focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            ประเภท
          </button>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800
                focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
                dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            + Add Tag filter
          </button>
        </div>
      </div>

      {/* card container */}
      <div className="mt-16 h-fit w-11/12 grid grid-cols-3 bg-white rounded-[15px] justify-self-center relative ">
        {/* card */}
        <div className="m-10 w-8/12 bg-white rounded-[10px] shadow border items-center ">
          <img
            className=" w-full h-3/6   
            object-cover"
            src="../../public/images/homeImage/puttipong.jpg"
            />

          <h1 className="mb-2 text-black text-[25px] font-semibold">
            Project Name
          </h1>
       
          <span className="mb-2 w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">
            AI Type
          </span>
          <p>
            Lorem Ipsum is simply dummy text of the printi ng and typesetting
            industry. Lorem Ipsum has been the ...
          </p>
          <div className='mb-2'>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">Default</span>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">Default</span>
              <span className="w-fit bg-indigo-600 rounded-[10px] me-2 px-2.5 py-0.5  dark:bg-blue-900 dark:text-blue-300 text-white text-xs font-normal">Default</span>
            </div>
        </div>

        <div className="m-10 w-10/12 bg-white rounded-[10px] border border-zinc-400 items-center flex p-2"></div>
        <div className="m-10 w-10/12 bg-white rounded-[10px] border border-zinc-400 items-center flex p-2"></div>
      </div>
    </div>
  );
}

export default AIlist;
