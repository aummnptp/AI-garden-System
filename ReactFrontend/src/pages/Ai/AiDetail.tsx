import React from 'react'
import MiniFooter from '../../components/MiniFooter'
import { ExclamationCircleOutlined, PictureOutlined, ScheduleOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import SummaryCard from '../../components/chart/sumaryCard'
import Barchart from '../../components/chart/BarChart'
import DoughnutChart from '../../components/chart/doughnutChart'
import UsageBarChart from '../../components/chart/UsageBarChart'
import { useParams } from 'react-router-dom'

const AiDetail = () => {
  const { ai_id } = useParams<{ ai_id?: string }>();
  if (typeof ai_id === 'undefined') {
    // Handle the case where workspaceId is undefined
    return <div>No workspace ID provided</div>;
  }
  return (
    <>
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* content container */}
      <div className=" w-full ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
        {/* top card (create sort workspace name) */}
        <div className="mt-10 pb-5 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
          <h1
            className="p-5 ml-5 mb-2 text-3xl font-medium tracking-tight 
          text-indigo-900 "
          >
            รายละเอียด
          </h1>
          <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
        </div>

        {/* detail */}
        <div className="mt-10 p-4 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
          <div className="grid grid-cols-6">
            <img
              className=" col-span-2  h-[100%] object-cover"
              src="/images/ai/Object-detection-Real-world-applications-and-benefits.png"
            />
            <div className="col-span-4 p-6">
              <div>
                <div className="flex items-center">
                  <h1
                    className=" mb-2 text-3xl font-medium tracking-tight 
                text-indigo-900  "
                  >
                    ชื่อ AI
                  </h1>

                  <span className=" ml-3 w-fit bg-indigo-600 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                    Object Detection
                  </span>
                </div>
                <div className=" w-full border border-zinc-300" />
              </div>
              {/* ai creater */}
              <div className="flex items-center my-4">
                <img
                  className="w-10 h-10 rounded-full border-2 bg-red-200 "
                  src="/images/homeImage/puttipong.jpg"
                />
                <div className="ml-2">
                  <p className="text-black text-lg font-normal">
                    putthipong Chobngam
                  </p>
                  <p className="text-indigo-900 text-base font-medium">
                    ผู้สร้าง
                  </p>
                </div>
              </div>
              <p className=" text-neutral-700 text-lg font-normal">
                รายละเอียด
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's{" "}
              </p>
              <div className="mb-2 mt-4">
                <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                  tag1
                </span>
                <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                  tag2
                </span>
                <span className=" w-fit bg-indigo-400 rounded-[5px] me-2 px-2.5 py-0.5   text-white text-lg font-normal">
                  tag3
                </span>
              </div>
            </div>
          </div>

          {/*  */}
          <div className=" mt-6 ml-3 ">
            <ExclamationCircleOutlined style={{ color: "#404040" }} />
            <span className="text-neutral-700 text-lg font-normal">
              เกี่ยวกับรูปภาพและวิดีโอที่จะนำไปประมวลผล
            </span>
          </div>
          <p className="ml-3">
            รูปภาพที่นำมาอัพโหลด ให้ประมวลผลต้องเป็นรูปภาพเกี่ยวกับสัตว์เลี้ยง
            ได้แก่สุนัข แมว นก กระต่าย เต่า เท่านั้น{" "}
          </p>

          {/* เริ่มต้นใช้งาน */}
          <div className="flex items-center my-10">
            <div className="mx-1 w-12 h-12 bg-indigo-900 rounded-[5px] flex items-center justify-center ">
              <UploadOutlined style={{ color: "#fff", fontSize: "2em" }} />
            </div>
            <div className="ml-3 w-full bg-r">
              <h1 className="text-indigo-900 text-2xl font-medium mb-[-10px]">
                การใช้งาน
              </h1>
              <div className="mt-6 w-full border border-zinc-300" />
              <h1 className="text-indigo-900 text-2xl font-medium mb-[-10px]">
                
                ทดลองใช้งาน
              </h1>
              
            </div>
          </div>
        </div>


      </div>
    </div>
    <MiniFooter></MiniFooter>
  </>
  )
}

export default AiDetail