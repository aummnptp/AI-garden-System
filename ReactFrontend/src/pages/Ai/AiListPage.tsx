
import {  useState } from "react";
import { SearchOutlined,  } from "@ant-design/icons";
import AiCard from "../../components/card/AiCard";
import MiniFooter from "../../components/MiniFooter";

import { useAiData } from "../../hook/ai/useAiData";

import { useSearchFilters } from "../../hook/useSearchFilter";
import { Autocomplete, InputAdornment,  TextField } from "@mui/material";
import { AIDataType } from "../../types/Ai";

import { useApprovedAiData } from "../../hook/ai/useApprovedAiData";
import { getImageUrl } from "../../function/util";



function AIlist() {
  const AI_TYPES = ["Classification", "Object Detection", "Segmentation","Regression"];

  const { searchInput, setSearchInput, typeFilter, setTypeFilter, tagFilter, setTagFilter } = useSearchFilters();
  const [selectedTab, setSelectedTab] = useState<"all" | "approved">("all"); 
  const approvedAiData = useApprovedAiData();
  const allAiData = useAiData();

  const { AIData = [], isLoadingAI,  aiTags = [] } =
    selectedTab === "approved" ? approvedAiData : allAiData;

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
                  onClick={() => setSelectedTab("all")} 
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${selectedTab === "all"
                    ? "text-blue-600 border-blue-600"
                    : "hover:text-gray-600 hover:border-gray-300"
                    }`}
                >
                  AI ทั้งหมด
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() => setSelectedTab("approved")} 
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${selectedTab === "approved"
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
            <TextField
              fullWidth
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ค้นหา AI"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
              className="w-1/2"
            />

            <Autocomplete
              options={AI_TYPES}
              value={typeFilter}
              onChange={(_, newValue) => setTypeFilter(newValue)}
              renderInput={(params) => <TextField {...params} label="ประเภท AI" variant="outlined" />}
              className="w-1/4"
            />
            <Autocomplete
              multiple
              options={aiTags || []}
              value={tagFilter}
              onChange={(_, newValue) => setTagFilter(newValue)}
              renderInput={(params) => <TextField {...params} label="Tag AI" variant="outlined" />}
              className="w-1/4"
            />
          </div>
        </div>


        {/* card container */}
        <div className="px-10 p-8 mt-4 h-fit w-11/12 
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
    bg-white rounded-[15px] justify-self-center relative">
          {!isLoadingAI && AIData.length === 0 ? (
            <p className="text-center text-gray-500">ไม่พบข้อมูล AI</p>
          ) : (
            AIData.map((data: AIDataType) => (
              <AiCard
                key={data.aiId}
                id={data.aiId}
                name={data.name}
                aiDesc={data.description}
                tags={data.ai_tag}
                img={getImageUrl(data.imagePath)}
                type={data.ai_type}
              />
            ))
          )}

        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default AIlist;
