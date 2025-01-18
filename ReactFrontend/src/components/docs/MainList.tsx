import React from "react";
import { Reorder } from "framer-motion";
import { DocData } from "./types";
import MainListItem from "./MainListItem";

interface MainListProps {
  docDatas: DocData[];
  setDocDatas: React.Dispatch<React.SetStateAction<DocData[]>>;
}

const MainList: React.FC<MainListProps> = ({ docDatas, setDocDatas }) => {
  return (
    <Reorder.Group axis="y" values={docDatas} onReorder={setDocDatas}>
      {docDatas.map((doc, index) => (
        <MainListItem
          key={doc.id}
          doc={doc}
          index={index}
          docDatas={docDatas}
          setDocDatas={setDocDatas}
        />
      ))}
    </Reorder.Group>
  );
};

export default MainList;
