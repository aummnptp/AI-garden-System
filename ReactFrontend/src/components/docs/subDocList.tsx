import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuItem, TextField } from "@mui/material";
import { Reorder } from "framer-motion";
import { HideSourceOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { SubDocListProps, SubDocs } from "../../types/Docs";





const SubDocList: React.FC<SubDocListProps> = ({
  docsId,
  subDocuments,
  onDeleteSubDoc,
  onAddSubTitle,
  onChangeSubTitle,
  onSubDocsReorder,
  onReOrderMode,
  onSubDocToggleVisibility,
}) => {
  const [subDocOptionModal, setSubDocOptionModal] = React.useState<{[key:string]:HTMLElement| null}>({});
  const [renameSubDocId, setRenameSubDocId] = React.useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const handleClick= (
    event: React.MouseEvent<HTMLButtonElement>,
    subDocsId:string,
  )=>{
    setSubDocOptionModal((pre)=> ({
      ...pre,
      [subDocsId]:event.currentTarget,
    }));
  };
  const handleClose = (subDocsId: string) => {
    setSubDocOptionModal((prev) => ({
      ...prev,
      [subDocsId]: null,
    }));
  };


  
   return (
     <>
       <Reorder.Group
         axis="y"
         values={subDocuments}
         onReorder={onSubDocsReorder}
       >
         {subDocuments.map((subDoc) => {
           const open = Boolean(subDocOptionModal[subDoc.subDocsId]);
           return (
             <div
               className=" flex w-full pl-6 justify-between"
               key={subDoc.subDocsId}
             >
               <span className="py-1 flex w-full text-gray-500 justify-between hover:text-blue-600">
                 {renameSubDocId === subDoc.subDocsId ? (
                   <div className="w-full h-fit">
                     <TextField
                       required
                       id={`sub-title-${subDoc.subDocsId}`}
                       label="ใส่ชื่อที่ต้องการแก้ไข"
                       inputProps={{ maxLength: 20 }}
                       value={subDoc.title}
                       onChange={(e) =>
                         onChangeSubTitle(e, docsId, subDoc.subDocsId)
                       }
                       onKeyDown={(e) => {
                         if (e.key === "Enter") {
                           onChangeSubTitle(e, docsId, subDoc.subDocsId, true);
                           setRenameSubDocId(null);
                         }
                       }}
                       ref={wrapperRef}
                     />
                   </div>
                 ) : onReOrderMode ? (
                   <Reorder.Item key={subDoc.order} value={subDoc} className="">
                     <span className="py-1 flex w-full text-gray-500 justify-between cursor-pointer hover:text-blue-600">
                     {subDoc.title} 
                     </span>
                   </Reorder.Item>
                 ) : (
                   <Link to={`/docs/${docsId}/${subDoc.subDocsId}`}>
                     <span
                       // onClick={() => onSubDocClick(parentIndex, subIndex)}
                       className="py-1 flex w-full text-gray-500 justify-between cursor-pointer hover:text-blue-600"
                     >
                       {subDoc.title}
                     </span>
                   </Link>
                 )}{" "}
               </span>
               <div className="mx-2 flex items-center h-full w-fit">
                  {subDoc.hidden ? <VisibilityOffOutlined /> : null}
                 <Button
                   id={`subdoc-button-${subDoc.subDocsId}`}
                   aria-controls={
                     open ? `subdoc-menu-${subDoc.subDocsId}` : undefined
                   }
                   aria-haspopup="true"
                   aria-expanded={open ? "true" : undefined}
                   onClick={(e) => handleClick(e, subDoc.subDocsId)}
                   style={{
                     cursor: "pointer",
                     minWidth: "auto",
                     padding: "4px 8px",
                   }}
                 >
                   <i
                     className="bi bi-three-dots  text-gray-600 justify-between hover:bg-gray-100 rounded-lg gap-3 cursor-pointer"
                     style={{ cursor: "pointer" }}
                   />
                 </Button>
                 <Menu
                   id={`subdoc-menu-${subDoc.subDocsId}`}
                   anchorEl={subDocOptionModal[subDoc.subDocsId]}
                   open={open}
                   onClose={() => handleClose(subDoc.subDocsId)}
                   MenuListProps={{
                     "aria-labelledby": `subdoc-button-${subDoc.subDocsId}`,
                   }}
                 >
                   <MenuItem
                     onClick={() => {
                       setRenameSubDocId(subDoc.subDocsId);
                       handleClose(subDoc.subDocsId);
                     }}
                   >
                     <EditOutlined />
                     Rename
                   </MenuItem>
                   <MenuItem
                     onClick={() => {
                       onSubDocToggleVisibility(subDoc.subDocsId, subDoc.hidden); // เรียกฟังก์ชันนี้
                     }}
                   >
                     {subDoc.hidden ? (
                       <VisibilityOutlined />
                     ) : (
                       <VisibilityOffOutlined />
                     )}
                     {subDoc.hidden ? "Show Content" : "Hide Content"}
                   </MenuItem>
                   <MenuItem
                     onClick={() => {
                       // alert("Delete sub-document:", subDoc)
                       onDeleteSubDoc(subDoc.subDocsId); // เรียกฟังก์ชันลบ
                       handleClose(subDoc.subDocsId);
                     }}
                   >
                     <DeleteOutlined />
                     Delete
                   </MenuItem>
                 </Menu>
               </div>
             </div>
           );
         })}
       </Reorder.Group>
       <div
         onClick={() => onAddSubTitle(docsId)}
         className="py-1 pl-6 flex w-full text-blue-700 whitespace-nowrap hover:bg-gray-100 rounded-lg cursor-pointer px-4 my-2"
       >
         {!onReOrderMode && (
           <span className="text-blue-700">
           <PlusCircleOutlined />
           Add Sub Heading
           </span>
         )}
       </div>
     </>
   );
};

export default SubDocList;
