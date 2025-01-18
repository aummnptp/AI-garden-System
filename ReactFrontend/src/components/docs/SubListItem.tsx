import React from "react";
import { Reorder } from "framer-motion";
import { DocData, SubTitle } from "./types";
import { MoreOutlined } from "@ant-design/icons";

interface SubListItemProps {
  subTitle: SubTitle;
  index: number;
  subIndex: number;
  docDatas: DocData[];
  setDocDatas: React.Dispatch<React.SetStateAction<DocData[]>>;
}

const SubListItem: React.FC<SubListItemProps> = ({
  subTitle,
  index,
  subIndex,
  docDatas,
  setDocDatas,
}) => {
  const handleSubEdit = (newName: string) => {
    const updatedDatas = [...docDatas];
    updatedDatas[index].subTitle[subIndex].name = newName;
    setDocDatas(updatedDatas);
  };

  return (
    <Reorder.Item value={subTitle}>
      <div className="flex justify-between items-center">
        <span
          onClick={() => console.log("Navigate to sub-content")}
          className="py-1 pl-14 flex w-full text-gray-600 cursor-pointer"
        >
          {subTitle.name}
        </span>
        <MoreOutlined
          onClick={() => console.log("Show sub-edit modal", index, subIndex)}
        />
      </div>
    </Reorder.Item>
  );
};

export default SubListItem;
