import React, { useRef, useState, } from "react";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined,  PlusCircleOutlined } from "@ant-design/icons";
import { Button, Menu, MenuItem, TextField } from "@mui/material";
import { Reorder } from "framer-motion";
import {  VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import {  SubDocs, } from "../../types/Docs";
import { useAuth } from "../../context/AuthContext";

interface SubDocListProps {
  docsId: string;
  subDocuments: SubDocs[];
  onDeleteSubDoc: (subDocId: string) => void;
  onAddSubTitle: (docsId: string) => void;
  onChangeSubTitle: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    docsId: string,
    subDocId: string,
    isEnterKey?: boolean
  ) => void;
  onSubDocsReorder: (newSubDocsOrder: SubDocs[]) => void;
  onReOrderMode: boolean;
  onSubDocToggleVisibility: (subDocId: string, currentHiddenState: boolean) => void;
}

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
  const { isAdmin } = useAuth();
  const [subDocOptionModal, setSubDocOptionModal] = useState<{ [key: string]: HTMLElement | null }>({});
  const [renameSubDocId, setRenameSubDocId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, subDocId: string) => {
    setSubDocOptionModal(prev => ({ ...prev, [subDocId]: event.currentTarget }));
  };

  const handleClose = (subDocId: string) => {
    setSubDocOptionModal(prev => ({ ...prev, [subDocId]: null }));
  };

  return (
    <>
      <Reorder.Group axis="y" values={subDocuments} onReorder={onSubDocsReorder}>
        {subDocuments.map((subDoc) => {
          const open = Boolean(subDocOptionModal[subDoc.subDocsId]);
          return (
            <div className="flex w-full pl-6 justify-between" key={subDoc.subDocsId}>
              <span className="py-1 flex w-full text-gray-500 justify-between hover:text-blue-600">
                {renameSubDocId === subDoc.subDocsId ? (
                  <div className="w-full h-fit">
                    <TextField
                      required
                      id={`sub-title-${subDoc.subDocsId}`}
                      label="ใส่ชื่อที่ต้องการแก้ไข"
                      inputProps={{ maxLength: 20 }}
                      value={subDoc.title}
                      onChange={(e) => onChangeSubTitle(e, docsId, subDoc.subDocsId)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onChangeSubTitle(e as unknown as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, docsId, subDoc.subDocsId, true);
                          setRenameSubDocId(null);
                        }
                      }}
                      ref={wrapperRef}
                      onBlur={() => {
                        // updateSubDocsTitleMutation.mutate({ subDocId: subDoc.subDocsId, newTitle: subDoc.title });
                        setRenameSubDocId(null);
                      }}
                    />
                  </div>
                ) : onReOrderMode ? (
                  <Reorder.Item key={subDoc.subDocsId} value={subDoc}>
                    <span className="py-1 flex w-full text-gray-500 justify-between cursor-pointer hover:text-blue-600">
                      {subDoc.title}
                    </span>
                  </Reorder.Item>
                ) : (
                  <Link to={`/docs/${docsId}/${subDoc.subDocsId}`}>
                    <span className="py-1 flex w-full text-gray-500 justify-between cursor-pointer hover:text-blue-600">
                      {subDoc.title}
                    </span>
                  </Link>
                )}
              </span>
              <div className="mx-2 flex items-center h-full w-fit">
                {subDoc.hidden && <VisibilityOffOutlined />}
                {isAdmin&& (  <>
                <Button
                  id={`subdoc-button-${subDoc.subDocsId}`}
                  aria-controls={open ? `subdoc-menu-${subDoc.subDocsId}` : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={(e) => handleClick(e, subDoc.subDocsId)}
                  style={{ cursor: "pointer", minWidth: "auto", padding: "4px 8px" }}
                >
                  <i className="bi bi-three-dots text-gray-600" />
                </Button>
                <Menu
                  id={`subdoc-menu-${subDoc.subDocsId}`}
                  anchorEl={subDocOptionModal[subDoc.subDocsId]}
                  open={open}
                  onClose={() => handleClose(subDoc.subDocsId)}
                  MenuListProps={{ "aria-labelledby": `subdoc-button-${subDoc.subDocsId}` }}
                >
                  <MenuItem
                    onClick={() => {
                      setRenameSubDocId(subDoc.subDocsId);
                      handleClose(subDoc.subDocsId);
                    }}
                  >
                    <EditOutlined /> Rename
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onSubDocToggleVisibility(subDoc.subDocsId, subDoc.hidden);
                      handleClose(subDoc.subDocsId);
                    }}
                  >
                    {subDoc.hidden ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                    {subDoc.hidden ? "Show Content" : "Hide Content"}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onDeleteSubDoc(subDoc.subDocsId);
                      handleClose(subDoc.subDocsId);
                    }}
                  >
                    <DeleteOutlined /> Delete
                  </MenuItem>
                </Menu>
                </>
                )}
              </div>
            </div>
          );
        })}
      </Reorder.Group>
      {isAdmin&& ( 
      <div
        onClick={() => onAddSubTitle(docsId)}
        className="py-1 pl-6 flex w-full text-blue-700 whitespace-nowrap hover:bg-gray-100 rounded-lg cursor-pointer px-4 my-2"
      >
        {!onReOrderMode && (
          <span className="text-blue-700">
            <PlusCircleOutlined /> Add Sub Heading
          </span>
        )}
      </div>
      )}
    </>
  );
};

export default SubDocList;