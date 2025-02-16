
import  { useEffect, useState } from "react";
import { ControlOutlined, SearchOutlined, SortAscendingOutlined } from "@ant-design/icons";
import AiCard from "../../components/card/AiCard";
import MiniFooter from "../../components/MiniFooter";

import { useAiData } from "../../hook/ai/useAiData";

import { useSearchFilters } from "../../hook/useSearchFilter";
import { Autocomplete, InputAdornment, Skeleton, TextField } from "@mui/material";
import { AIDataType } from "../../types/Ai";



function AIlist() {
  const AI_TYPES = ["Classification", "Object Detection", "Segmentation"];

  const { searchInput, setSearchInput, typeFilter, setTypeFilter, tagFilter, setTagFilter } = useSearchFilters();
  const { AIData, isLoadingAI, isErrorAI, aiTags, isLoadingaiTags, isErroaiTags, } = useAiData();



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
      {isLoadingAI
        ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="p-4">
              <Skeleton height={200} />
              <Skeleton width={`80%`} />
              <Skeleton width={`60%`} />
            </div>
          ))
        : AIData.map((data:AIDataType) => (
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
      <MiniFooter></MiniFooter>
    </>
  );
}

export default AIlist;
