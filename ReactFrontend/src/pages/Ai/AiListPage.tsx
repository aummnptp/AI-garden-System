import React, { useEffect, useState } from "react";
import { ControlOutlined, SortAscendingOutlined } from "@ant-design/icons";
import AiCard from "../../components/card/AiCard";
import MiniFooter from "../../components/MiniFooter";
import axios from "axios";
import { AIDataType } from "../../types/Ai";

function AIlist() {
  const [AIData, setAIData] = useState<AIDataType[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "approved">("all"); // 🟢 State บันทึก tab ที่เลือก

  const fetchAIData = () => {
    const baseURL = import.meta.env.VITE_NEST_BACKEND_API_URL;
    const url =
      selectedTab === "approved"
        ? `${baseURL}/ai-models/my_approved`
        : `${baseURL}/ai-models/`;

    axios
      .get(url, selectedTab === "approved" ? { withCredentials: true } : {})
      .then((response) => {
        setAIData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the AI data!", error);
      });
  };

  useEffect(() => {
    fetchAIData(); // 🟢 ดึงข้อมูลใหม่เมื่อเปลี่ยน tab
  }, [selectedTab]);

  return (
    <>
      <div className="bg-neutral-100 items-center justify-center h-full pb-32 grid grid-cols-1">
        {/* Top Card */}
        <div className="mt-4 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative">
          <h1 className="p-5 ml-5 text-3xl font-medium tracking-tight text-indigo-900">
            รายชื่อ AI
          </h1>
          <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
          <div className="m-6 flex justify-start">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <button
                  onClick={() => setSelectedTab("all")} // 🟢 เปลี่ยน state
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    selectedTab === "all"
                      ? "text-blue-600 border-blue-600"
                      : "hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  AI ทั้งหมด
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() => setSelectedTab("approved")} // 🟢 เปลี่ยน state
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    selectedTab === "approved"
                      ? "text-blue-600 border-blue-600"
                      : "hover:text-gray-600 hover:border-gray-300"
                  }`}
                >
                  AI ที่ได้รับสิทธิ
                </button>
              </li>
            </ul>
          </div>

          {/* Search & Filter */}
          <div className="m-6 flex justify-start gap-4">
            <input
              type="text"
              className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              placeholder="ค้นหา AI"
              required
            />
            <button
              type="button"
              className="rounded-[15px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-black text-lg font-normal px-5 py-1.5 mb-2 focus:outline-none"
            >
              ประเภท <SortAscendingOutlined />
            </button>
            <button
              type="button"
              className="h-fit rounded-[15px] bg-white border-2 border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-black text-lg font-normal px-5 py-1.5 mb-2 focus:outline-none"
            >
              tag <ControlOutlined />
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="mt-4 h-fit w-11/12 grid grid-cols-3 pb-20 bg-white rounded-[15px] justify-self-center relative">
          {AIData.map((data) => (
            <AiCard
              key={data.aiId}
              id={data.aiId}
              name={data.name}
              aiDesc={data.description}
              tags={data.ai_tag}
              img={data.imagePath}
              type={data.ai_type}
            />
          ))}
        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default AIlist;
