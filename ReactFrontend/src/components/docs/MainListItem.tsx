import React from "react";
import { Reorder } from "framer-motion";
import { DocData } from "./types";
import SubList from "./SubList";
import { MoreOutlined } from "@ant-design/icons";

interface MainListItemProps {
  doc: DocData;
  index: number;
  docDatas: DocData[];
  setDocDatas: React.Dispatch<React.SetStateAction<DocData[]>>;
}

const MainListItem: React.FC<MainListItemProps> = ({
  doc,
  index,
  docDatas,
  setDocDatas,
}) => {
  const handleTitleEdit = (newTitle: string) => {
    const updatedDatas = [...docDatas];
    updatedDatas[index].title = newTitle;
    setDocDatas(updatedDatas);
  };

  return (
    <Reorder.Item value={doc}>
      <div className="flex justify-between items-center mb-2">
        <span
          onClick={() => console.log("Navigate to content", index)}
          className="py-2 flex-1 pl-3 text-lg font-semibold cursor-pointer"
        >
          {doc.title}
        </span>
        <MoreOutlined onClick={() => console.log("Show edit modal")} />
        <SubList
          subTitles={doc.subTitle}
          index={index}
          setDocDatas={setDocDatas}
          docDatas={docDatas}
        />
      </div>
    </Reorder.Item>
  );
};

export default MainListItem;
