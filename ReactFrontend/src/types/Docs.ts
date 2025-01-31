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