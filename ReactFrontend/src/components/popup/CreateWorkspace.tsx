import React, { useState } from 'react'

import { Input } from "antd";
import { CloseOutlined } from '@ant-design/icons';
interface CreateWorkspaceProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  
}

const { TextArea } = Input;

export const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({showModal,setShowModal}) => {
  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };


  return (
    <>
      {showModal ? (
        <>
          <div
            className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            onClick={handleCloseModal}
          >
            <div className="relative w-5/12 my-6 mx-auto">
              {/*card */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className=" flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t ">
                  <h1
                    className=" text-3xl font-semibold text-center p-5 ml-5 mb-2 tracking-tight 
              text-indigo-900 dark:text-white"
                  >
                    <span className="mt-5 absolute inset-x-0 top-0 text-center">
                      สร้าง Workspace
                    </span>
                  </h1>
                  <div  onClick={() => setShowModal(false)} className="absolute top-0 right-0 my-6 mr-6 hover:bg-gray-100 rounded-md p-1 ">
                    <CloseOutlined style={{ fontSize: "24px" }} />
                  </div>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <Input
                    placeholder="Workspace Name"
                    variant="filled"
                    className="my-4"
                  />
                  <TextArea
                    rows={4}
                    variant="filled"
                    placeholder="คำอธิบายworkspace"
                  />
                </div>
                {/*footer*/}
                <div className=" mx-auto flex items-center justify-end p-6">
                  <button
                    className="bg-indigo-600 text-white hover:bg-indigo-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
export default CreateWorkspace;