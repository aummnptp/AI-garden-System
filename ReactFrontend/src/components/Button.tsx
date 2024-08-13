import React from 'react'



interface ButtonProps {
  name:string;
  startIcon?: React.ElementType;
  endIcon?: React.ElementType;

  }
const Buttons  :React.FC<ButtonProps> = (props) => {
    const { name, startIcon: StartIcon, endIcon: EndIcon } = props;

  return (
    <button
    type="button"
    className="text-white bg-indigo-700 hover:bg-blue-800 focus:ring-4
 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
  focus:outline-none "
  >
       {StartIcon && <StartIcon />} {name}  {EndIcon && <EndIcon />}
  </button>
  )
}

export default Buttons