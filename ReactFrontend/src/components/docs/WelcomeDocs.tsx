import { Link } from "react-router-dom";

const WelcomeDocs = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center p-10">
      <h1 className="text-3xl font-bold text-blue-800">AI Garden Document</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">
        Welcome to Document Page
      </h2>
      <p className="text-gray-600 mt-4 max-w-lg">
        เริ่มต้นเรียนรู้เกี่ยวกับเว็บไซต์ด้วยการเลือกหัวข้อที่สนใจทางแถบซ้ายมือ เช่น ข้อมูลเบื้องต้น คำแนะนำการใช้งาน
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        กลับสู่หน้าหลัก
      </Link>
    </div>
  );
};

export default WelcomeDocs;
