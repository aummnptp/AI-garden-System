

function Footer() {
  return (
    <footer className="bg-white ">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 ">
        <div className="md:flex md:justify-between ">
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3  ">
            
            <div className='flex flex-col justify-between pr-20'>
            <div className="flex items-start">
              <img
                className="h-8 me-3 rounded-full "
                src="/images/logo/IMG_3713.png"
                />
              <span className="  text-2xl font-medium ">AI Garden System</span>
            </div>
              <p className='text-gray-500  font-medium'>แพลตฟอร์มเว็บแอปพลิเคชันเพื่อช่วยสำหรับสนับสนุนการทำงานวิเคราะห์ภาพ และวิดีโอด้วยระบบปัญญาประดิษฐ์ด้วยระบบปัญญาประดิษฐ์ประเภท Computer Vision</p>
            </div>


            <div className="flex-col justify-between grid">
              <h2 className=" text-2xl font-medium  ">Contact Us</h2>

              <div className="flex gap-6">
                <div className="">
                  <a
                    className="text-gray-500  text-2xl hover:text-blue-700  "
                    href="https://www.facebook.com/ITLadkrabang"
                  >
                    <i className="bi bi-facebook"></i>{" "}
                  </a>{" "}
                </div>

                <div className="">
                  <a
                    className="text-gray-500  text-2xl hover:text-blue-700 "
                    href="https://www.youtube.com/user/itkmitl1"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                </div>


                <div className="">
                  <a
                    className="text-gray-500  text-2xl hover:text-blue-700 "
                    href="https://www.it.kmitl.ac.th/th/"
                  >
               <i className="bi bi-globe"></i>
                  </a>
                </div>
              </div>
              <div className='flex items-center'>

              <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
              <text className='mx-2 text-gray-500 '>or</text>
              
              <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
              </div>

              <div className=" flex">
                <text className="text-gray-500 text-center ">IT KMITL building.  </text>{" "}
              </div>
            </div>

            <div>
              <div className="flex flex-col justify-between ">
                <div className='flex'>
                  
                <img
                  className="w-16 h-16 mr-5"
                  src="../../public/images/logo/KMITL_Logo.png"
                  />
                <img
                  className="w-16 h-16 mr-5"
                  src="../../public/images/logo/ITKMITL_Logo.png"
                  />
                </div>
              </div>

         
                  <div className="text-gray-500  font-medium ">
                    <p>School of Information Technology</p>
                    <p>King Mongkut's Institute of Technology Ladkrabang</p>
                    <p>1 Chalongkrung Road Bangkok Thailand 10520</p>
                  </div>

            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-center">
          <span className=" text-sm text-gray-500 sm:text-center ">
            © 2024 IT KMITL AI Garden System V1.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer