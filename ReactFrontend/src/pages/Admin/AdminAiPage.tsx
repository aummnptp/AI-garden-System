import { Link } from "react-router-dom";
import MiniFooter from "../../components/MiniFooter";
import AdminSidebar from "../../components/AdminSidebar";
import AdminAiCard from "../../components/card/AdminAiCard";
import { Autocomplete, Button, InputAdornment, Skeleton, TextField } from "@mui/material";
import { useAiData } from "../../hook/ai/useAiData";
import { useSearchFilters } from "../../hook/useSearchFilter";
import { SearchOutlined } from "@mui/icons-material";
import { AIDataType } from "../../types/Ai";
import { getImageUrl } from "../../function/util";
import AISettingsComponent from "../../components/ai/AISettingsComponent";

function AdminAi() {
  const AI_TYPES = ["Classification", "Object Detection", "Segmentation","Regression"];
  const { searchInput, setSearchInput, typeFilter, setTypeFilter, tagFilter, setTagFilter } = useSearchFilters();
  const { AIData, isLoadingAI,  aiTags, isLoadingaiTags, } = useAiData();

  
  return (
    <>
      <div className="flex bg-neutral-100 h-full pb-32  min-h-screen ">
        <AdminSidebar></AdminSidebar>

        {/* Main content */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          {/* Top card (create sort workspace name) */}
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative">
          <div className="flex justify-between items-center p-5">
          <h1 className="text-3xl font-medium tracking-tight text-indigo-900">
            รายชื่อ AI
              </h1>

              <Link to="/admin/createai">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#3730a3", 
                    },
                  }}
                >
                  + Add New AI
                </Button>
              </Link>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="m-6 flex flex-wrap items-center gap-4">
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
              className="flex-1 min-w-[200px]"
              />
               
               <Autocomplete
          options={AI_TYPES}
          value={typeFilter}
          onChange={(_, newValue) => setTypeFilter(newValue)}
        renderInput={(params) => <TextField {...params} label="ประเภท AI" variant="outlined" />}
        className="flex-1 min-w-[150px]"
        />
           <Autocomplete
              multiple
              options={aiTags || []} 
              value={tagFilter}
              onChange={(_, newValue) => setTagFilter(newValue)}
              renderInput={(params) => <TextField {...params} label="Tag AI" variant="outlined" />}
              className="flex-1 min-w-[150px]"
              />
            <div className="flex-none">
             <AISettingsComponent/>
            </div>
            </div>
          </div>

          {/* Card container */}
          <div
            className="px-10 p-8 mt-4 h-fit w-[95%] 
    grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12
    bg-white rounded-[15px] justify-self-center relative"
          >
            {" "}
            {isLoadingAI||isLoadingaiTags
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="w-full h-full flex">
                    <Skeleton variant="rectangular" height={200} />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </div>
                ))
              : AIData.map((data:AIDataType) => (
                  <AdminAiCard
                    key={data.aiId}
                    id={data.aiId}
                    name={data.name}
                    aiDesc={data.description}
                    tags={data.ai_tag}
                    img={getImageUrl(data.imagePath)}
                    type={data.ai_type}
                  />
                ))}
          </div>
        </div>
      </div>
      <MiniFooter />
    </>
  );
}

export default AdminAi;
