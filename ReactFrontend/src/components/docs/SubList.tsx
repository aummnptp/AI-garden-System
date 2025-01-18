import React from "react";
import { Reorder } from "framer-motion";
import { DocData, SubTitle } from "./types";
import SubListItem from "./SubListItem";

interface SubListProps {
  subTitles: SubTitle[];
  index: number;
  docDatas: DocData[];
  setDocDatas: React.Dispatch<React.SetStateAction<DocData[]>>;
}

const SubTitleList: React.FC<SubListProps> = ({
  subTitles,
  index,
  docDatas,
  setDocDatas,
}) => {
  const handleSubTitleReorder = (newSubTitles: SubTitle[]) => {
    const updatedDatas = [...docDatas];
    updatedDatas[index].subTitle = newSubTitles;
    setDocDatas(updatedDatas);
  };

  return (
    <Reorder.Group
      axis="y"
      values={subTitles}
      onReorder={handleSubTitleReorder}
    >
      {subTitles.map((subTitle, subIndex) => (
        <SubListItem
          key={subTitle.subId}
          subTitle={subTitle}
          index={index}
          subIndex={subIndex}
          setDocDatas={setDocDatas}
          docDatas={docDatas}
        />
      ))}
    </Reorder.Group>
  );
};

export default SubTitleList;
