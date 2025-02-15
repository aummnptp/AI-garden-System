import React, { useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";



import {
  DeleteOutlined,
  EditOutlined,

  PlusCircleOutlined,
} from "@ant-design/icons";

import { Button,Menu, MenuItem, TextField } from "@mui/material";

import { Link } from "react-router-dom";
import SubDocList from "./subDocList";

import {
  SaveOutlined,
  SwapVertOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import { Docs, SubDocListProps, SubDocs,} from "../../types/Docs";
import { useAuth } from "../../context/AuthContext";



interface DocListProps {
  docs: Docs[];
  onTitleAdd: () => void;
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement>, docId: string) => void;
  onCloseMenu: (docId: string) => void;
  headingOptionModal: { [key: string]: HTMLElement | null };
  renameDocId: string | null;
  setRenameDocId: (docId: string | null) => void;
  onchangeDocTitle: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, docId: string) => void;
  onInputKeyDown: (e: React.KeyboardEvent, docId: string) => void;
  onDeleteDoc: (docId: string) => void;
  onDocsToggleVisibility: (docId: string, currentHiddenState: boolean) => void;
  onSubTitleAdd: (docId: string) => void;
  onDeleteSubDoc: (subDocId: string) => void;
  onChangeSubTitle: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    docId: string,
    subDocId: string,
    isEnterKey?: boolean
  ) => void;
  onReorderSubDocs: (docId: string, newSubDocsOrder: SubDocs[]) => void;
  onSubDocsToggleVisibility: (subDocId: string, currentHiddenState: boolean) => void;
  onReorderMode: boolean;
  onSetReorderMode: (mode: boolean) => void;
  onReorderDocs: (newDocsOrder: Docs[]) => void;
  onSaveReorder: () => void;
  handleDocsTitleUpdate: (docId: string, newTitle: string) => Promise<void>;
  patchSubDocsTitle: (subDocId: string, newTitle: string) => Promise<void>; 
}

const DocList: React.FC<DocListProps> = ({
  docs,
  onTitleAdd,
  onClickMenu,
  onCloseMenu,
  headingOptionModal,
  renameDocId,
  setRenameDocId,
  onchangeDocTitle,
  onInputKeyDown,
  onDeleteDoc,
  onDocsToggleVisibility,
  onSubTitleAdd,
  onDeleteSubDoc,
  onChangeSubTitle,
  onReorderSubDocs,
  onSubDocsToggleVisibility,
  onReorderMode,
  onSetReorderMode,
  onReorderDocs,
  onSaveReorder,
  handleDocsTitleUpdate,
  patchSubDocsTitle,
}) => {
  const { isAdmin } = useAuth();
  return (
    <div className="px-3 pt-6 pb-24 h-full w-[20%] bg-white shadow border fixed z-40 overflow-y-scroll">
      <h1 className="w-[95%] ml-2 text-black text-3xl font-normal">Documentation</h1>
      <div className="flex justify-between pt-4">
      {isAdmin&&(
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#3730a3" },
          }}
          onClick={onTitleAdd}
        >
          <PlusCircleOutlined /> Add New Heading
        </Button>
        )}
        {isAdmin&&(
        <Button
          variant={onReorderMode ? "outlined" : "text"}
          style={{ cursor: "pointer", minWidth: "auto", padding: "4px 8px" }}
          sx={{ color: "#4f46e5" }}
          onClick={() => {
            onSetReorderMode(!onReorderMode);
          }}
        >
          <SwapVertOutlined /> {onReorderMode ? "Sorting" : "Sort"}
        </Button>
        )}
      </div>
      <div className="w-[95%] border border-zinc-300 mx-auto my-2 mb-4" />
      {onReorderMode && (
        <div className="flex justify-end">
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#3730a3" },
            }}
            onClick={onSaveReorder}
          >
            <SaveOutlined /> Save Reorder
          </Button>
        </div>
      )}
      <Reorder.Group
        axis="y"
        values={docs}
        onReorder={onReorderDocs}
        className={`py-2 items-center mt-2 ${
          onReorderMode
            ? "border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
            : ""
        }`}
      >
        {onReorderMode && (
          <span className="py-2 flex-1 pl-3 text-lg text-gray-600">
            <SwapVertOutlined /> drag to reorder heading
          </span>
        )}
        {docs.map((doc) => {
          const open = Boolean(headingOptionModal[doc.docsId]);
          return (
            <div key={doc.docsId} className="w-full">
              <div className="flex w-full justify-between">
                {renameDocId === doc.docsId ? (
                  <div className="w-full h-fit">
                    <TextField
                      required
                      id={`title-${doc.docsId}`}
                      label="ใส่ชื่อที่ต้องการแก้ไข"
                      inputProps={{ maxLength: 20 }}
                      value={doc.title}
                      onChange={(e) => onchangeDocTitle(e, doc.docsId)}
                      onKeyDown={(e) => onInputKeyDown(e, doc.docsId)}
                      onBlur={() => {
                        setRenameDocId(null);
                        handleDocsTitleUpdate(doc.docsId, doc.title); 
                      }}
                    />
                  </div>
                ) : onReorderMode ? (
                  <Reorder.Item key={doc.docsId} value={doc}>
                    <span className="py-2 flex-1 pl-3 text-lg font-medium cursor-pointer hover:text-indigo-800">
                      {doc.title}
                    </span>
                  </Reorder.Item>
                ) : (
                  <Link to={`/docs/${doc.docsId}`}>
                    <span className="py-2 flex-1 pl-3 text-lg font-medium cursor-pointer hover:text-indigo-800">
                      {doc.title}
                    </span>
                  </Link>
                )}
                <div className="mx-2 flex items-center h-full w-fit">
                  {doc.hidden && <VisibilityOffOutlined />}
                  {isAdmin&& (
                  <>
                  <Button
                    className="hover:bg-gray-100 rounded-lg gap-3 cursor-pointer"
                    id={`basic-button-${doc.docsId}`}
                    aria-controls={open ? `basic-menu-${doc.docsId}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={(e) => onClickMenu(e, doc.docsId)}
                    style={{ cursor: "pointer", minWidth: "auto", padding: "4px 8px" }}
                  >
                    <i className="bi bi-three-dots text-gray-600" />
                  </Button>
                
                  <Menu
                    id={`basic-menu-${doc.docsId}`}
                    anchorEl={headingOptionModal[doc.docsId]}
                    open={open}
                    onClose={() => onCloseMenu(doc.docsId)}
                    MenuListProps={{ "aria-labelledby": `basic-button-${doc.docsId}` }}
                  >
                    <MenuItem
                      onClick={() => {
                        setRenameDocId(doc.docsId);
                        onCloseMenu(doc.docsId);
                      }}
                    >
                      <EditOutlined /> Rename
                    </MenuItem>
                    <MenuItem onClick={() => onDocsToggleVisibility(doc.docsId, doc.hidden)}>
                      {doc.hidden ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                      {doc.hidden ? "Show Content" : "Hide Content"}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onDeleteDoc(doc.docsId);
                        onCloseMenu(doc.docsId);
                      }}
                    >
                      <DeleteOutlined /> Delete
                    </MenuItem>
                  </Menu>
                </>)}
                </div>
              </div>
              <SubDocList
                docsId={doc.docsId}
                subDocuments={doc.subDocuments}
                onAddSubTitle={onSubTitleAdd}
                onDeleteSubDoc={onDeleteSubDoc}
                onChangeSubTitle={onChangeSubTitle}
                onSubDocsReorder={(newOrder) => onReorderSubDocs(doc.docsId, newOrder)}
                onReOrderMode={onReorderMode}
                onSubDocToggleVisibility={onSubDocsToggleVisibility}
                patchSubDocsTitle={patchSubDocsTitle}
              />
            </div>
          );
        })}
      </Reorder.Group>
    </div>
  );
};

export default DocList;