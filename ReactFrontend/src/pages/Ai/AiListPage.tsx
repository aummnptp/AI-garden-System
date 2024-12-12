import React, { useEffect, useState } from "react";


import { ControlOutlined, SortAscendingOutlined } from "@ant-design/icons";
import AiCard from "../../components/card/AiCard";
import MiniFooter from "../../components/MiniFooter";
import AiData from "../../data/AiData";
import { Link } from "react-router-dom";
import axios from "axios";


function AIlist() {
  const [AIData, setAIData] = useState([]);
  const fetchAIData = () => {
    axios.get("http://localhost:3000/ai-models/")
      .then(response => {
        setAIData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the workspace data!", error);
      });
  };

  useEffect(() => {
    fetchAIData(); // ดึงข้อมูล workspace เมื่อ component โหลดครั้งแรก
  }, []);



  console.log(AIData)

  return (
    <>
    <div className=" bg-neutral-100  items-center justify-center h-full pb-32 grid grid-cols-1">
      {/* top card (create sort workspace name) */}
      <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
        <h1
          className="p-5 ml-5 text-3xl font-medium tracking-tight 
          text-indigo-900 "
        >
          รายชื่อ AI 
        </h1>
        <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto "></div>
        <div className="m-6 flex justify-start">
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2">
              <a
                href="#"
                className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active "
                aria-current="page"
              >
               AI ทั้งหมด
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
              >
                   AI ที่ได้รับสิทธิ 
              </a>
            </li>
            <li className="me-2">
              <a
                href="#"
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
              >
                AI ที่ยังไม่ได้รับสิทธิ
              </a>
            </li>
            
          </ul>
        </div>
        <div className="m-6 flex justify-start gap-4">
          <input
            type="text"
            id="first_name"
            className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  "
            placeholder="ค้นหา AI"
            required
          />
          <button
            type="button"
            className=" rounded-[15px] bg-white border-2  border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200  text-black text-lg font-normal px-5 py-1.5 mb-2  focus:outline-none "
          >
            ประเภท <SortAscendingOutlined />
          </button>
          <button
            type="button" 
            className="   h-fit rounded-[15px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200  t ext-black text-lg font-normal  px-5 py-1.5 mb-2 focus:outline-none "
          >
            tag <ControlOutlined/>
          </button>
        </div>
      </div>

      {/* card container */}
      <div className="mt-4 h-fit w-11/12 grid grid-cols-3 pb-20 bg-white rounded-[15px] justify-self-center relative ">
        {/* card */}
        {AIData.map((data) => (
    
          <AiCard
            id={data.id}
            name={data.name}
            aiDesc={data.description}
            tags={data.ai_tag}
            img={"/images/ai/healthAi.webp"}
            type={data.ai_type}
            ></AiCard>
     
        ))}
      </div>
    </div>
          <MiniFooter></MiniFooter>
          </>
  );
}

export default AIlist;
