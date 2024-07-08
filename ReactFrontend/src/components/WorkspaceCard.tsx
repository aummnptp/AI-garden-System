import React from 'react'

const WorkspaceCard: React.FC = () => {
    return (
        <div className="m-10 w-[335px] h-[184px] relative bg-white rounded-[15px] border border-zinc-400 grid grid-cols-12 ">
              
        <div className="w-2.5 h-[184px] bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
          <div className="bg-red-400 col-start-2 col-end-13">
            <h1 className='text-indigo-900 text-lg font-semibold font-['Roboto'] leading-loose">
              Workspace Name
            </h1>
            <p>รายละเอียด</p>
            </div> 
        </div>
    );
  };
  
  export default WorkspaceCard;