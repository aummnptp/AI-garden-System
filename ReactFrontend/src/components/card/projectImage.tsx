
import React from 'react'
import stringToColor from '../../function/util';

interface projectImageProps {
    projectName: string;
    className: string;

  }
const projectImage: React.FC<projectImageProps>  = ( {projectName ,className = "" }) => {
    const words = projectName.split(" ");
    let initials = "";
  
    // check condition 1 คำหรือ 2คำขึ้นไป    
    if (words.length > 1) {
        initials = `${words[0][0].toUpperCase() ?? ""}${words[1][0].toUpperCase() ?? ""}`;
      } else {
        initials = `${projectName[0]?.toUpperCase() ?? ""}${projectName[1]?.toUpperCase() ?? ""}`;
      }
    const fullName =`${projectName[0]} ${projectName[1]}`;
    const backgroundColor = stringToColor(fullName);
  
return (
    <div 
    className={className}
    style={{ backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}
  >
    {initials}
  </div>
)
}

export default projectImage

