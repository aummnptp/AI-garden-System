import { FacebookFilled, MailFilled } from '@ant-design/icons'
import React from 'react'


function Footer() {
  return (
    

<footer className="bg-white ">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between ">

          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3  ">
          <div className="flex items-start ">         
              <img 
                        className="h-8 me-3 rounded-full " 
                        src="/images/logo/navlogo.png"
                        />
                  <span className="  text-2xl font-medium ">AI Garden System</span>
             
          </div >
              <div className=""> 
                  <h2 className=" text-2xl font-medium  ">Contact Us</h2>
                
                    <div className='flex gap-6'>
                          <div className=""><a className='text-gray-500  text-3xl hover:text-black  '  href="https://www.facebook.com/ITLadkrabang" ><i className="bi bi-facebook"></i>  </a> </div>
                
                          <div className=""><a className='text-gray-500  text-3xl hover:text-black ' href="mailto:IT@kmitl.ac.th"><i className="bi bi-envelope-fill"></i></a></div>
                 
                          <div className=""><a className='text-gray-500  text-3xl hover:text-black ' href="https://line.me/th/"><i className="bi bi-line"></i></a></div>
                   
                    </div>
                    
                          <div className=""><a className='text-gray-500 '>School of IT building. </a> </div>
                    

                
              </div>
           
              <div>
                <div className='flex col'>
              <img className="w-16 h-16 mr-5" src="../../public/images/logo/KMITL_Logo.png" />
              <img className="w-16 h-16 mr-5" src="../../public/images/logo/ITKMITL_Logo.png" />
                </div>
                  <ul className="text-gray-500  font-medium">
                      <li className="mb-4">
                          <div ><p>School of Information Technology</p>
                          <p>King Mongkut's Institute of Technology Ladkrabang</p> 
                          <p>1 Chalongkrung Road Bangkok Thailand 10520</p>
                          </div>
                      </li>

                  </ul>
              </div>
          </div>
      </div>


      
      <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-center">
          <span className=" text-sm text-gray-500 sm:text-center ">© 2024 IT KMITL AI Garden System V1.
          </span>
      </div>
    </div>
</footer>

  )
}

export default Footer