export type SubDocs =  {
    subDocsId: string;
    title: string;
    content: string;
    showEdit: boolean;
    editPosition: { top: number; left: number };
    showInput: boolean;
    showDelete: boolean;
    hidden:boolean;
    text: string;
    order: number;



  }
  
  export type  Docs = {
    docsId: string;
    title: string;
    content: string;
    showInput: boolean;
    hidden:boolean;
    order: number;
    subDocuments: SubDocs[];
  }

  export type SubDocListProps = {
    docsId: string;
    subDocuments: SubDocs[];
    onDeleteSubDoc: (subDocsId: string) => void; // ฟังก์ชันลบ
    onAddSubTitle: (docsId: string) => void;
    onChangeSubTitle:any,
    onSubDocsReorder: (newSubDocuments: SubDocs[]) => void;
    onReOrderMode: boolean;
    onSubDocToggleVisibility: (subDocsId: string, currentHiddenState: boolean) => void;
  };


  
  export type DocListProps = {
    headingData:[]
    refetchHeading:()=>void;
  };