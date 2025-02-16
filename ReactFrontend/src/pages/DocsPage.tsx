import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import DocList from "../components/docs/DocList";
import ContentViewer from "../components/docs/ContentViewer";
import ContentEditor from "../components/docs/ContentEditor";
import { useParams } from "react-router-dom";
import SaveContentModal from "../components/docs/modal/SaveContentModal";
import DiscardContentModal from "../components/docs/modal/DiscardConentModal";
import {
  addSubtitleService,
  addTitleService,
  changeDocsVisiblityService,
  changeSubDocsVisiblityService,
  deleteSubTitleService,
  deleteTitleService,
  saveDocsOrderService,
  saveSubDocsOrderService,
  updateContentDocumentService,
  updateContentSubDocumentService,
  updateDocsTitleService,
  updateSubDocsTitleService,
} from "../api/services/DocsService";
import { Docs, SubDocs } from "../types/Docs";
import DeleteSubDocModal from "../components/docs/modal/DeleteSubDocModal";
import DeleteDocModal from "../components/docs/modal/DeleteDocModal";
import SaveReorderModal from "../components/docs/modal/SaveReorderModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDocsData } from "../hook/docs/useDocsData";

const DocsPage: React.FC = () => {
  const { docsId, subDocsId } = useParams<Record<string, string | undefined>>();

  // State สำหรับ Content Editor/Viewer
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPageData, setCurrentPageData] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>("");
  const [showTextEditor, setShowTextEditor] = useState<boolean>(false);
  const [saveContentModal, setSaveContentModal] = useState<boolean>(false);
  const [discardContentModal, setDiscardContentModal] =
    useState<boolean>(false);

  // State สำหรับ Docs List
  const [docs, setDocs] = useState<Docs[]>([]);
  const [onReorderMode, setOnReorderMode] = useState<boolean>(false);
  const [reorderModalOpen, setReorderModalOpen] = useState<boolean>(false);
  const [headingOptionModal, setHeadingOptionModal] = useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [renameDocId, setRenameDocId] = useState<string | null>(null);

  // State สำหรับ Modal confirm delete
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteSubModalOpen, setDeleteSubModalOpen] = useState<boolean>(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedSubDocId, setSelectedSubDocId] = useState<string | null>(null);

  const {
    contentData,
    contentLoading,
    contentError,
    refetchContent,

    docsData,
    docsLoading,
    docsError,
    refetchDocs,
  } = useDocsData();

  useEffect(() => {
    if (contentData) {
      setCurrentPageData(contentData.content);
      setEditorValue(contentData.content);
    }
    if (!contentLoading) {
      setLoading(false);
    }
  }, [contentData, contentLoading]);

  useEffect(() => {
    if (docsData && Array.isArray(docsData)) {
      setDocs(docsData);
    }
  }, [docsData]);

  const handleEdit = () => {
    setEditorValue(currentPageData);
    setShowTextEditor(true);
  };

  const handleSave = async () => {
    if (!editorValue.trim()) {
      alert("กรุณากรอกเนื้อหาก่อนบันทึก");
      return;
    }
    try {
      if (subDocsId) {
        await updateContentSubDocumentService(subDocsId, editorValue);
      } else if (docsId) {
        await updateContentDocumentService(docsId, editorValue);
      }
      setCurrentPageData(editorValue);
      setShowTextEditor(false);
    } catch (error) {
      console.error("Error saving content", error);
    } finally {
      setSaveContentModal(false);
    }
  };

  const handleDiscard = () => {
    setShowTextEditor(false);
    setDiscardContentModal(false);
  };

  const onCloseSaveModal = () => setSaveContentModal(false);
  const onOpenSaveModal = () => setSaveContentModal(true);
  const onCloseDiscardModal = () => setDiscardContentModal(false);
  const onOpenDiscardModal = () => setDiscardContentModal(true);

  const handleClickMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    docId: string
  ) => {
    setHeadingOptionModal((prev) => ({
      ...prev,
      [docId]: event.currentTarget,
    }));
  };

  const handleCloseMenu = (docId: string) => {
    setHeadingOptionModal((prev) => ({ ...prev, [docId]: null }));
  };

  const handleDocsTitleUpdate = async (docId: string, newTitle: string) => {
    try {
      await updateDocsTitleService(docId, newTitle);
      refetchDocs();
    } catch (error) {
      console.error("Failed to update document title:", error);
    }
  };

  const handleTitleAdd = async () => {
    try {
      await addTitleService();
      refetchDocs();
    } catch (error) {
      console.error("Failed to add title:", error);
    }
  };

  const handleSubTitleAdd = async (docId: string) => {
    try {
      await addSubtitleService(docId);
      refetchDocs();
    } catch (error) {
      console.error("Failed to add subtitle:", error);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      await deleteTitleService(docId);
      refetchDocs();
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const handleDeleteSubDoc = async (subDocId: string) => {
    try {
      await deleteSubTitleService(subDocId);
      refetchDocs();
    } catch (error) {
      console.error("Failed to delete sub-document:", error);
    }
  };

  const onchangeDocTitle = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      docId: string
    ) => {
    const newTitle = e.target.value;
    setDocs((prevDocs) =>
      prevDocs.map((d) => (d.docsId === docId ? { ...d, title: newTitle } : d))
    );
  };

  const handleInputKeyDown = (e: React.KeyboardEvent, docId: string) => {
    if (e.key === "Enter") {
      setRenameDocId(null);
      const doc = docs.find((d) => d.docsId === docId);
      if (doc) {
        handleDocsTitleUpdate(docId, doc.title);
      }
    }
  };
  
  const onChangeSubTitle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    docId: string,
    subDocId: string,
    isEnterKey: boolean = false
  ) => {
    const newTitle = e.target.value;
    setDocs((prevDocs) =>
      prevDocs.map((d) => {
        if (d.docsId === docId) {
          const updatedSubs = d.subDocuments.map((sub) =>
            sub.subDocsId === subDocId ? { ...sub, title: newTitle } : sub
          );
          return { ...d, subDocuments: updatedSubs };
        }
        return d;
      })
    );
    if (isEnterKey) {
      patchSubDocsTitle(subDocId, newTitle);
    }
  };

  const patchSubDocsTitle = async (subDocId: string, newTitle: string) => {
    try {
      await updateSubDocsTitleService(subDocId, newTitle);
      refetchDocs();
    } catch (error) {
      console.error("Failed to update sub-document title:", error);
    }
  };

  const onReorder = (newDocsOrder: Docs[]) => {
    setDocs(newDocsOrder);
  };

  const onSubDocsReorder = (docId: string, newSubDocsOrder: SubDocs[]) => {
    setDocs((prevDocs) =>
      prevDocs.map((d) =>
        d.docsId === docId ? { ...d, subDocuments: newSubDocsOrder } : d
      )
    );
  };

  const handleSaveReorder = async () => {
    try {
      const docsToSave = docs.map((d, index) => ({
        docsId: d.docsId,
        order: index + 1,
      }));
      const subDocsToSave = docs.flatMap((d) =>
        d.subDocuments.map((sub, index) => ({
          docsId: d.docsId,
          subDocsId: sub.subDocsId,
          order: index + 1,
        }))
      );
      await saveDocsOrderService(docsToSave);
      await saveSubDocsOrderService(subDocsToSave);
      refetchDocs();
      console.log("Order saved successfully for docs and sub-docs");
    } catch (error) {
      console.error("Failed to save reorder:", error);
    }
    setReorderModalOpen(false);
  };

  const handleDocsToggleVisibility = async (
    docId: string,
    currentHiddenState: boolean
  ) => {
    try {
      await changeDocsVisiblityService(docId, !currentHiddenState);
      refetchDocs();
    } catch (error) {
      console.error("Failed to toggle document visibility:", error);
    }
  };

  const handleSubDocsToggleVisibility = async (
    subDocId: string,
    currentHiddenState: boolean
  ) => {
    try {
      await changeSubDocsVisiblityService(subDocId, !currentHiddenState);
      refetchDocs();
    } catch (error) {
      console.error("Failed to toggle sub-document visibility:", error);
    }
  };

  const handleHeadingDelete = () => {
    if (selectedDocId) {
      handleDeleteDoc(selectedDocId);
      setDeleteModalOpen(false);
      setSelectedDocId(null);
      setSelectedSubDocId(null);
    }
  };

  const handleSubHeadingDelete = () => {
    if (selectedSubDocId) {
      handleDeleteSubDoc(selectedSubDocId);
      setDeleteSubModalOpen(false);
      setSelectedDocId(null);
      setSelectedSubDocId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-full min-h-screen bg-neutral-100">
      {/* Modal Confirm Delete สำหรับ Heading */}
      {selectedDocId !== null && (
        <DeleteSubDocModal
          title="Delete this heading?"
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedDocId(null);
            setSelectedSubDocId(null);
          }}
          onDelete={handleHeadingDelete}
        />
      )}
      {/* Modal Confirm Delete สำหรับ Sub Heading */}
      {selectedSubDocId !== null && (
        <DeleteDocModal
          title="Delete this sub heading?"
          open={deleteSubModalOpen}
          onClose={() => {
            setDeleteSubModalOpen(false);
            setSelectedDocId(null);
            setSelectedSubDocId(null);
          }}
          onDelete={handleSubHeadingDelete}
        />
      )}
      {/* Modal Save Reorder */}
      <SaveReorderModal
        open={reorderModalOpen}
        onClose={() => setReorderModalOpen(false)}
        onSave={handleSaveReorder}
      />

      {/* Sidebar: ส่ง props สำหรับ Docs List */}
      <DocList
        docs={docs}
        onTitleAdd={handleTitleAdd}
        onClickMenu={handleClickMenu}
        onCloseMenu={handleCloseMenu}
        headingOptionModal={headingOptionModal}
        renameDocId={renameDocId}
        setRenameDocId={setRenameDocId}
        onchangeDocTitle={onchangeDocTitle}
        onInputKeyDown={handleInputKeyDown}
        // เมื่อกด delete จะเปิด modal confirm delete
        onDeleteDoc={(docId: string) => {
          setSelectedDocId(docId);
          setDeleteModalOpen(true);
        }}
        onDocsToggleVisibility={handleDocsToggleVisibility}
        onSubTitleAdd={handleSubTitleAdd}
        onDeleteSubDoc={(subDocId: string) => {
          setSelectedSubDocId(subDocId);
          setDeleteSubModalOpen(true);
        }}
        onChangeSubTitle={onChangeSubTitle}
        onReorderSubDocs={onSubDocsReorder}
        onSubDocsToggleVisibility={handleSubDocsToggleVisibility}
        onReorderMode={onReorderMode}
        onSetReorderMode={setOnReorderMode}
        onReorderDocs={onReorder}
        onSaveReorder={() => setReorderModalOpen(true)}
        handleDocsTitleUpdate={handleDocsTitleUpdate}
        patchSubDocsTitle={patchSubDocsTitle}
      />

      {/* Content Container */}
      <div className="w-[80%] ml-auto px-2 flex flex-col items-center pb-32 h-full min-h-screen bg-white">
        {showTextEditor ? (
          <div className="w-full h-full flex flex-col items-center bg-white">
            <DiscardContentModal
              open={discardContentModal}
              onClose={onCloseDiscardModal}
              onDiscard={handleDiscard}
            />
            <SaveContentModal
              open={saveContentModal}
              onClose={onCloseSaveModal}
              onSave={handleSave}
            />
            <ContentEditor
              value={editorValue}
              onSave={onOpenSaveModal}
              onDiscard={onOpenDiscardModal}
              onEditorChange={setEditorValue}
              setText={setEditorValue}
            />
          </div>
        ) : (
          <ContentViewer
            currentPageData={currentPageData}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default DocsPage;
