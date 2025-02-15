


import { Link } from "react-router-dom";
import { ControlOutlined, SortAscendingOutlined } from "@ant-design/icons";
import MiniFooter from "../../components/MiniFooter";
import AdminSidebar from "../../components/AdminSidebar";
import AdminAiCard from "../../components/card/AdminAiCard";
import { Button } from "@mui/material";
import AISettingsComponent from "../../components/ai/AISettingsComponent";
import { AIDataType } from "../../types/Ai";
import { useAiData } from "../../hook/ai/useAiData";


function AdminAi() {


  const { AIData, isLoadingAI, isErrorAI, refetchAIModels } = useAiData();





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
                + Add New AI 

                </Button>

              </Link>
            </div>
            <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto"></div>
            <div className="m-6 flex justify-between items-center gap-4 ">
              <input
                type="text"
                id="first_name"
                className="w-6/12 h-fit bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
                placeholder="Search with AI name"
                required
              />
              <div>

              <Button
                type="button" variant="outlined" color="info"
                
              >
                type filter <SortAscendingOutlined />
              </Button>
              <Button
                type="button" variant="outlined" color="info"
              
              >
                tag filter <ControlOutlined />
              </Button>
     <AISettingsComponent/></div>

            </div>
          </div>

          {/* Card container */}
          <div className="px-20 p-8 mt-4 h-fit w-[95%] grid grid-cols-3 gap-4 bg-white rounded-[15px] justify-self-center relative">
            {/* Card */}

            {AIData.map((data:AIDataType) => (
              <AdminAiCard
              id={data.aiId}
              name={data.name}
              aiDesc={data.description}
              tags={data.ai_tag}
              // img={"/images/ai/healthAi.webp"}
              img={data.imagePath}
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
