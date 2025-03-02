import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import DocList from "../components/docs/DocList";
import ContentViewer from "../components/docs/ContentViewer";
import ContentEditor from "../components/docs/ContentEditor";
import { useParams } from "react-router-dom";
import SaveContentModal from "../components/docs/modal/SaveContentModal";
import DiscardContentModal from "../components/docs/modal/DiscardConentModal";
import { Docs, SubDocs } from "../types/Docs";
import DeleteSubDocModal from "../components/docs/modal/DeleteSubDocModal";
import DeleteDocModal from "../components/docs/modal/DeleteDocModal";
import SaveReorderModal from "../components/docs/modal/SaveReorderModal";
import { useDocsData } from "../hook/docs/useDocsData";
import WelcomeDocs from "../components/docs/WelcomeDocs";
import SkeletonLayout from "../components/SkeletonPageLayout";
import { useDocsMutations } from "../hook/docs/useDocsMutations";
import { useUpdateContent } from "../hook/docs/useUpdateContentMutation";

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
  const [initialDocs, setInitialDocs] = useState<Docs[]>([]);
  const [onReorderMode, setOnReorderMode] = useState<boolean>(false);
  const [reorderModalOpen, setReorderModalOpen] = useState<boolean>(false);
  const [headingOptionModal, setHeadingOptionModal] = useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteSubModalOpen, setDeleteSubModalOpen] = useState<boolean>(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedSubDocId, setSelectedSubDocId] = useState<string | null>(null);
  const onCloseSaveModal = () => setSaveContentModal(false);
  const onOpenSaveModal = () => setSaveContentModal(true);
  const onCloseDiscardModal = () => setDiscardContentModal(false);
  const onOpenDiscardModal = () => setDiscardContentModal(true);


  const {
    contentData,
    contentLoading,

    docsData,
    docsLoading,
  } = useDocsData();

  const {
    addTitleMutation,
    addSubTitleMutation,
    deleteTitleMutation,
    deleteSubTitleMutation,
    updateDocsTitleMutation,
    updateSubDocsTitleMutation,
    saveOrderMutation,
    toggleVisibilityMutation,
    toggleSubDocVisibilityMutation,
} = useDocsMutations();

const updateContentMutation = useUpdateContent();

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


  const handleDiscard = () => {
    setShowTextEditor(false);
    setDiscardContentModal(false);
  };



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
  

  const handleSaveContent = () => {
    updateContentMutation.mutate({
      docsId,
      subDocsId,
      editorValue,
      onSuccessCallback: () => {
        setCurrentPageData(editorValue);
        setShowTextEditor(false);
      },
    });

    setSaveContentModal(false);
  };

  const handleTitleAdd = () => {
    addTitleMutation.mutate();
  };

  const handleSubTitleAdd = (docId: string) => {
    addSubTitleMutation.mutate(docId);
  };

  const handleDeleteDoc = (docId: string) => {
    deleteTitleMutation.mutate(docId);
  };

  const handleDeleteSubDoc = (subDocId: string) => {
    deleteSubTitleMutation.mutate(subDocId);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent, docId: string) => {
    if (e.key === "Enter") {
      setRenameDocId(null);
      const doc = docs.find((d) => d.docsId === docId);
      if (doc) {
        updateDocsTitleMutation.mutate({ docId, newTitle: doc.title });
      }
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
        updateSubDocsTitleMutation.mutate({ subDocId, newTitle });
    }
};
const handleEnterReorderMode = () => {
  setInitialDocs([...docs]); 
  setOnReorderMode(true);
};

const handleCancelReorder = () => {
  setDocs(initialDocs); 
  setOnReorderMode(false);
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

  const handleSaveReorder = () => {
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
    saveOrderMutation.mutate({ docsToSave, subDocsToSave });
    setReorderModalOpen(false);
    setOnReorderMode(false);
  };


  const handleDocsToggleVisibility = (docId: string, currentHiddenState: boolean) => {
    toggleVisibilityMutation.mutate({ docId, newState: !currentHiddenState });
  };

  const handleSubDocsToggleVisibility = (subDocId: string, currentHiddenState: boolean) => {
    toggleSubDocVisibilityMutation.mutate({ subDocId, newState: !currentHiddenState });
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

  if (loading||docsLoading||contentLoading) {
    return <SkeletonLayout />;
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
        onSetReorderMode={handleEnterReorderMode}
        onReorderDocs={onReorder}
        onSaveReorder={() => setReorderModalOpen(true)}
        onCancelReorder={handleCancelReorder}

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
        onSave={handleSaveContent}
      />
      <ContentEditor
        value={editorValue}
        onSave={onOpenSaveModal}
        onDiscard={onOpenDiscardModal}
        onEditorChange={setEditorValue}
        setText={setEditorValue}
      />
    </div>
  ) : !docsId && !subDocsId ? (
    <WelcomeDocs />
  ) : (
    <ContentViewer currentPageData={currentPageData} onEdit={handleEdit} />
  )}
      </div>
    </div>
  );
};

export default DocsPage;
