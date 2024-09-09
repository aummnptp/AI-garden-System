import React from 'react'
import { ExclamationCircleOutlined, PictureOutlined, ScheduleOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import SummaryCard from '../../components/chart/sumaryCard'
import Barchart from '../../components/chart/BarChart'
import DoughnutChart from '../../components/chart/doughnutChart'
import UsageBarChart from '../../components/chart/UsageBarChart'
import { useParams } from 'react-router-dom'
import MiniFooter from '../../components/MiniFooter'

const AIDemo = () => {
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
            ทดลองใช้
          </h1>
          <div className="w-[95%] h-[0px] border border-zinc-300 mx-auto" />
        </div>

        {/* detail */}
        <div className="mt-10 p-4 h-fit w-11/12 bg-white rounded-[15px] justify-self-center relative ">
        

          {/*  */}
         

          {/* เริ่มต้นใช้งาน */}
       
        </div>


      </div>
    </div>
    <MiniFooter></MiniFooter>
  </>
  )
}

export default AIDemo