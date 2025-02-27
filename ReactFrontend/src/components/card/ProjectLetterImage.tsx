
// แสดงตัวหนังสือแทนรูปเมื่อไม่มีรูป 
import React from 'react'
import stringToColor from '../../function/util';

interface ProjectImageProps {
    projectName: string;
    className: string;

  }
  const ProjectImage: React.FC<ProjectImageProps>  = ({ projectName = "N/A", className = "" }) => {
    if (!projectName.trim()) projectName = "N/A"; // ถ้า projectName เป็นค่าว่างให้ใช้ "N/A"

    const words = projectName.split(" ");
    let initials = "";

    if (words.length > 1) {
        initials = `${words[0]?.[0]?.toUpperCase() ?? ""}${words[1]?.[0]?.toUpperCase() ?? ""}`;
    } else {
        initials = `${projectName?.[0]?.toUpperCase() ?? ""}${projectName?.[1]?.toUpperCase() ?? ""}`;
    }

    const backgroundColor = stringToColor(projectName);

    return (
        <div 
            className={className}
            style={{ backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}
        >
            {initials || "?"}
        </div>
    );
}


export default ProjectImage

