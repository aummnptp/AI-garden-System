import React from 'react'
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="">
    {/* hero section */}
    <div className="pt-24 grid grid-cols-5 gap-1 h-[100%] relative bg-neutral-100 ">
      <div className="col-span-3 left-item ">
        <div className="m-24">
          <div className="flex">
            <p>welcome to</p>
            <div className="w-[63px] h-[0px] border border-black"></div>
          </div>
          <h1 className="my-4 text-3xl font-medium leading-none tracking-tight text-indigo-900 md:text-4xl dark:text-white">
            AI Garden System
          </h1>
          <p className="my-4 text-black text-xl font-medium font-['Roboto'] leading-loose">
            เว็บไซต์สำหรับทำงานประมวลผลภาพและวิดีโอด้วย AI computer vision
          </p>
          <Link to={`/worksapce`}>
          <button
            type="button"
            className="text-white bg-indigo-700 hover:bg-blue-800 focus:ring-4
             focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
             dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
            เริ่มใช้งาน
          </button>
          </Link>
          <button
            type="button"
            className="text-white bg-indigo-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            เรียนรู้เพิ่มเติม
          </button>
        </div>
      </div>
      <div className=" right-item  p-20 col-span-2">
        <img
          className=" h-[100%] w-[90%] "
          src="https://cdn.discordapp.com/attachments/1013435571747704893/1259148597438451774/AI_Garden_System.jpg?ex=668aa103&is=66894f83&hm=663ff1bd76240df595902c10fdcc995b997f93feb4fd79156595f6730c6d4e0f&"
        />
      </div>
    </div>
    {/* section 4 card */}
    <div className=" h-[5%] bg-gradient-to-b from-indigo-600 to-indigo-800 border border-black ">
      <h1 className="ml-10 mt-8 text-3xl font-medium leading-none tracking-tight text-white md:text-3xl">
        ประเภทของ AI ในระบบ
      </h1>
      <div className="p-10 flex gap-14 ">
        {/* card */}
        <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
          <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-indigo-900 dark:text-white">
            Object detection
          </h5>
          <div className="mt-14 flex justify-center">
            <h5 className="mb-2  text-2xl font-bold tracking-tight text-indigo-900 dark:text-white">
              Icon
            </h5>
          </div>
          <p className="mt-4 mb-14 font-normal text-stone-900 dark:text-gray-400">
            ระบุพื้นที่วาดกรอบรอบสี่เหลี่ยมวัตถุในภาพและวิดีโอ
          </p>
        </div>
        {/* card */}
        <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
          <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-indigo-900 dark:text-white">
            Object detection
          </h5>
          <p className="font-normal text-stone-900 dark:text-gray-400">
            ระบุพื้นที่วาดกรอบรอบสี่เหลี่ยมวัตถุในภาพและวิดีโอ
          </p>
        </div>
        {/* card */}
        <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow "
        >
          <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-indigo-900 dark:text-white">
            Object detection
          </h5>
          <p className="font-normal text-stone-900 dark:text-gray-400">
            ระบุพื้นที่วาดกรอบรอบสี่เหลี่ยมวัตถุในภาพและวิดีโอ
          </p>
        </div>
        {/* card */}
        <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
          <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-indigo-900 dark:text-white">
            Object detection
          </h5>
          <p className="font-normal text-stone-900 dark:text-gray-400">
            ระบุพื้นที่วาดกรอบรอบสี่เหลี่ยมวัตถุในภาพและวิดีโอ
          </p>
        </div>
      </div>
    </div>
    {/* หัวข้ออีกอัน section */}
    <div>
      <h1 className="ml-10 mt-8 text-3xl font-medium leading-none tracking-tight text-black md:text-2xl">
        หัวข้ออีกอัน
      </h1>
    </div>
    {/* developer team section */}
    <div className=" h-[5%] bg-gradient-to-b from-indigo-600 to-indigo-800 border border-black ">
      <h1 className="ml-10 mt-8 text-3xl font-medium leading-none tracking-tight text-white md:text-3xl">
        Developer Team / ทีมผู้พัฒนา
      </h1>
      {/* teacher advisor */}
      <h1 className="ml-10 mt-8 text-3xl font-medium leading-none tracking-tight text-white md:text-2xl">
        Teacher Advisor
      </h1>
      <div className="p-10 flex gap-14 ">
        <div className=" block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow "
        >
          <img
            className="mb-10 w-[167px] h-[166px] rounded-[360px] border"
            src="images/Taravichet-300x300.jpg"
            alt="อาจารย์ Taravichet Image"
          />

          <p className="text-center font-normal text-stone-900 dark:text-gray-400">
            ผศ.ดร. ธราวิเชษฐ์
          </p>
          <p className="text-center font-normal text-stone-900 dark:text-gray-400">
            ธิติจรูญโรจน์
          </p>
        </div>

        <div className="text-center  block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
          <img
            className="mb-10 w-[167px] h-[166px] rounded-[360px] border "
            src="images/Pornsuree-300x300.jpg"
            alt="อาจารย์ Pornsuree Image"
          />

          <p className="font-normal text-stone-900 dark:text-gray-400">
            ผศ.ดร. พรสุรีย์ แจ่มศรี
          </p>
        </div>
      </div>
      <h1 className="ml-10 mt-8 text-3xl font-medium leading-none tracking-tight text-white md:text-2xl">
        Dev
      </h1>

      <div className="p-10 flex gap-14 ">
        <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
          <img
            className="mb-10 w-[167px] h-[166px] rounded-[360px] border "
            src="images/"
            alt="kittinan img"
          />

          <p className="font-normal text-stone-900 dark:text-gray-400">
            นาย กิตตินันท์ เจริญทรง
          </p>
        </div>

        <div className="block max-w-64 p-6 bg-white border border-gray-200 rounded-md shadow ">
          <img
            className="mb-10 w-[167px] h-[166px] rounded-[360px] border "
            src="images/"
            alt="putthipong img"
          />

          <p className="font-normal text-stone-900 dark:text-gray-400">
            นาย พุฒิพงษ์ ชอบงาม
          </p>
        </div>
      </div>
    </div>
    {/* footer */}
    
  </div>
  )
}

export default Home