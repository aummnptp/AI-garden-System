import React from 'react'

function Footer() {
  return (
    

<footer className="bg-white dark:bg-gray-900">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <a href="/" className="flex items-center">
              <img 
                        className="h-8 me-3 rounded-full " 
                        src="/images/logo/navlogo.png"
                        />
                  <span className=" self-center text-2xl font-semibold whitespace-nowrap dark:text-white">AI Garden System</span>
              </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 ">
          <div></div>
              <div>
                  <h2 className=" mt-16 mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Contract Us</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <div className=""><p><a  href="https://www.facebook.com/ITLadkrabang" >Facebook  </a> </p></div>
                      </li>
                      <li className="mb-4">
                          <div className=""><p><a href="mailto:IT@kmitl.ac.th">Send email</a></p></div>
                      </li>
                      <li className="mb-4">
                          <div className=""><p><a href="https://line.me/th/">Line</a></p></div>
                      </li>
                      <li className="mb-4">
                          <div className=""><p><a>Faculty of IT building. </a></p> </div>
                      </li>

                  </ul>
              </div>
           
              <div>
                <div className='flex col'>
              <img className="w-16 h-16 mr-5" src="../../public/images/logo/KMITL_Logo.png" />
              <img className="w-16 h-16 mr-5" src="../../public/images/logo/ITKMITL_Logo.png" />
                </div>
                  <h2 className="mt-4 text-sm font-semibold text-gray-900 uppercase dark:text-white">© IT@KMITL</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
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
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-center">
          <span className=" text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 IT KMITL AI Garden System V1.
          </span>
      </div>
    </div>
</footer>

  )
}

export default Footer