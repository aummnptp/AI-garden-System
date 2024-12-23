import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { SendOutlined } from '@ant-design/icons';
import AiData from "../../data/AiData";
import AiCard from "../../components/card/AiCard";
import { ControlOutlined, SortAscendingOutlined } from "@ant-design/icons";
import MiniFooter from "../../components/MiniFooter";
import AdminSidebar from "../../components/AdminSidebar";
import AdminAiCard from "../../components/card/AdminAiCard";
import { Button } from "@mui/material";
import axios from 'axios';

function AdminAi() {

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

  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32  min-h-screen ">
        {/* Slidebar placeholder */}
        <AdminSidebar></AdminSidebar>


        {/* Main content */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          {/* Top card (create sort workspace name) */}
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
            <div className="flex justify-between items-center p-5">
              <h1 className="text-3xl font-medium tracking-tight text-indigo-900 ">
                รายชื่อ AI
              </h1>

              <Link to="/admin/createai" >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                    },
                  }}
                >
                  + Create New AI
                </Button>

              </Link>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="m-6 flex justify-between items-center gap-4">
              <input
                type="text"
                id="first_name"
                className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                placeholder="ค้นหาชื่อAI"
                required
              />
              <div>
                <button
                  type="button"
                  className="rounded-[25px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-black text-lg font-normal px-5 py-2.5  focus:outline-none "
                >
                  ประเภท <SortAscendingOutlined />
                </button>
                <button
                  type="button"
                  className="rounded-[25px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-black text-lg font-normal px-5 py-2.5  focus:outline-none "
                >
                  tag <ControlOutlined />
                </button></div>
            </div>
          </div>

          {/* Card container */}
          <div className="mt-4 h-fit  w-[95%] grid grid-cols-3  bg-white rounded-[15px] justify-self-center relative">
            {/* Card */}
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
      </div>
      <MiniFooter />
    </>
  );
}

export default AdminAi;
