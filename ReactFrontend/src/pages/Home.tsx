import React from 'react'
import { Link } from "react-router-dom";
import {  DotChartOutlined, PieChartOutlined, RadarChartOutlined, SearchOutlined } from '@ant-design/icons';
import Footer from '../components/Footer';
import { Button } from '@mui/material';
import Buttons from '../components/Button';

function Home() {

  const AITypeData = [
    {
      type:'Object Detection',
      desc:'ระบุพื้นที่วาดกรอบรอบสี่เหลี่ยมวัตถุในภาพและวิดีโอ',
      icon: 'SearchOutlined'

    },
    {
      type:'Segmentation',
      desc:'ตรวจจับวัตถุแต่ละอย่างในภาพ และวาดแบ่งกลุ่มสีเฉพาะ เพื่อแสดงถึงขอบเขต',
      icon: 'PieChartOutlined'
    },
    {
      type:'Regression',
      desc:'ทำนายค่าข้อมูลที่เกี่ยวข้องด้วยรูปภาพ',
      icon: 'DotChartOutlined'
    },
    {
      type:'Classification',
      desc:'แยกแยะจัดกลุ่มรูปภาพหรือจัดหมวดหมู่ให้วัตถุในรูปภาพ',
      icon: 'RadarChartOutlined'
    },
  ]
  
  const DevTeamData = {
    teacher: [
      { name: "ผศ.ดร. ธราวิเชษฐ์ ธิติจรูญโรจน์", img: "images/homeImage/Taravichet-300x300.jpg" },
      {
        name: "ผศ.ดร. พรสุรีย์ แจ่มศรี",
        img: "images/homeImage/Pornsuree-300x300.jpg",
      },
    ],
    dev: [
      { name: "นาย กิตตินันท์ เจริญทรง", img: "images/homeImage/kittnan.jpeg" },
      { name: "นาย พุฒิพงษ์ ชอบงาม", img: "images/homeImage/puttipong.jpg" },
    ],
  };


const renderIcon = (iconName: any) => {
  switch (iconName) {
    case 'SearchOutlined':
      return <SearchOutlined style={{ fontSize: "48px" }} />;
    case 'PieChartOutlined':
      return <PieChartOutlined style={{ fontSize: "48px" }} />;
    case 'RadarChartOutlined':
      return <RadarChartOutlined style={{ fontSize: "48px" }} />;
    default:
      return <DotChartOutlined style={{ fontSize: "48px" }} />; 
  }
};
  return (
    <div className="">
      {/* hero section */}
      <div className=" grid grid-cols-7 gap-1 h-[100%] relative bg-neutral">
        <div className="col-span-4 left-item mb-28 pt-24  ">
          <div className="m-24">
            <div className="flex">
              <div className="flex items-center">
                <p>welcome to</p>
                <div className="mx-1 mt-1  w-[100px] h-[0px] border border-black"></div>
              </div>
            </div>
            <h1 className="my-4 text-3xl font-medium leading-none tracking-tight text-indigo-900 md:text-4xl ">
              AI Garden System
            </h1>
            <p className="my-4 text-black text-xl leading-loose  ">
              เว็บไซต์สำหรับทำงานประมวลผลภาพและวิดีโอด้วย AI computer vision
            </p>
            <Link to={`/workspaces`}>
              <Button
                variant="contained"
                size='large'
                sx={{
                  backgroundColor: "#4338ca",
                  "&:hover": {
                    backgroundColor: "#1e40af", // สีที่ต้องการเมื่อ hover
                  },
                }}
              >
              เริ่มใช้งาน
              </Button>
            </Link>
            <Link to={`/docs`}>
            <Button
                variant="contained"
                    size='large'
                sx={{
                  backgroundColor: "#4338ca",
                  "&:hover": {
                    backgroundColor: "#1e40af", // สีที่ต้องการเมื่อ hover
                  },
                }}
              >
              เรียนรู้เพิ่มเติม
              </Button>
            </Link>
          </div>
        </div>
        <div className=" right-item  p-11 col-span-3 mr-10  ">
          <img
            className=" h-[100%] w-[100%]  "
            src="/images/logo/Dr.sloth.png"
          />
        </div>
      </div>
      {/* section 4 card */}
      <div className=" h-[5%] bg-gradient-to-b from-indigo-800 to-indigo-600 border border-black ">
        <h1 className="ml-24 mt-8 text-3xl font-medium leading-none tracking-tight text-white md:text-3xl">
          ประเภทของ AI ในระบบ
        </h1>
        <div className="p-10 flex gap-24 justify-center">
          {/* card */}
          {AITypeData.map((data) => (
            <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
              <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-indigo-900 ">
                {data.type}
              </h5>
              <div className="mt-14 flex justify-center ">
                <h5 className="mb-2  text-2xl font-bold tracking-tight text-indigo-900 ">
                {renderIcon(data.icon)}
                </h5>
              </div>
              <p className="mt-4 mb-14text-stone-900 text-lg  leading-[27px] mx-a">
                {data.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* หัวข้ออีกอัน section */}
      <div className=''>
        <div className='h-full flex justify-end p-10  '>
          <h1 className=" text-indigo-900 text-5xl font-medium leading-none tracking-tight  md:text-3xl ">
            เกี่ยวกับระบบ AI System Garden
          </h1>
        </div>
          <div className=' pb-20  grid grid-cols-12 items-center'>
            <div className='col-span-3 ml-24'>
            <img
                className="w-56"
                src='images/desktop-smartphone-app-development_23-2148683810.avif'
              />
            </div>
            <div className='col-span-7'>
        <h1 className=" text-indigo-900 text-2xl font-medium mb-4">
            การพัฒนาแพลตฟอร์ม AI System Garden
          </h1>
        <p>เป็นการพัฒนาแพลตฟอร์มแอปพลิเคชันเพื่อช่วยสำหรับสนับสนุนการทำงานวิเคราะห์ภาพ
          และวิดีโอด้วยระบบปัญญาประดิษฐ์ประเภท Computer Vision
          โดยที่ปัญญาประดิษฐ์ในแต่ละตัวที่มีในแพลตฟอร์มนี้จะมีการวิเคราะห์ผลลัพธ์จากภาพหรือวิดีโอตามคุณสมบัติ ประเภทและรายละเอียดที่แตกต่างกันออกไปแต่ละตัว</p>
            </div>
        </div>
      </div>
      {/* developer team section */}
      <div className=" pb-10 h-[5%] bg-gradient-to-b from-indigo-800 to-indigo-600 border border-black ">
        <h1 className="ml-10 mt-8 text-3xl font-medium leading-none tracking-tight text-white md:text-3xl">
          Developer Team / ทีมผู้พัฒนา
        </h1>
        {/* teacher advisor */}
        <div className="ml-10 mt-10 flex flex-row items-center space-x-4 p-4">
          <h1 className="text-3xl font-medium leading-none tracking-tight text-white md:text-2xl">
            Teacher Advisor
          </h1>
          <div className="w-9 h-9 bg-white rounded-full" />
          <div className="w-[613px] h-[0px] border-2 border-white" />
        </div>
        <div className="p-10 flex gap-14 ">
          {/* card */}
          {DevTeamData.teacher.map((data) => (
               <div className="block w-64 h-[20em] p-6 bg-white border border-gray-200 rounded-md shadow items-center text-center">
          <div className="flex justify-center mb-10">
              <img
                className=" w-[167px] h-[166px] rounded-[360px] border"
                src={data.img}
              />
              </div>

              <p className="text-center  text-stone-900 text-xl ">
                {data.name}
              </p>
            </div>
          ))}
        </div>

        {/* dev */}
        <div className="ml-10 mt-4 flex flex-row items-center space-x-4 p-4">
          <h1 className=" text-3xl font-medium leading-none tracking-tight text-white md:text-2xl">
            Dev ทีม
          </h1>
          <div className="w-9 h-9 bg-white rounded-full " />
          <div className="w-[613px] h-[0px] border-2 border-white" />
        </div>
        <div className="p-10 flex gap-14 ">
          {/* card */}
          {DevTeamData.dev.map((data) => (
            <div className="block w-64 h-[20em] p-6 bg-white border border-gray-200 rounded-md shadow items-center text-center">
            <div className="flex justify-center mb-10">
              <img
                className="w-[167px] h-[166px] rounded-full border"
                src={data.img}
              />
            </div>
            <p className="text-xl text-stone-900 ">
              {data.name}
            </p>
          </div>
          
          ))}
        </div>
      </div>
      {/* footer */}
      <Footer/>
    </div>
  );
}

export default Home