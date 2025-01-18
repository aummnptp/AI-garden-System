
export  interface SubTitle {
    subId:number
    name: string;
    contentData:string;
    showEdit: boolean;
    editPosition: { top: number; left: number }; 
    showInput: boolean;
    showDelete: boolean;
    text:string;
  }
  
  export interface DocData {
    id:number
    title: string;
    contentData:string;
    showEditModal: boolean;
    editPosition: { top: number; left: number }; 
    showInput: boolean;
    showDeleteModal:boolean;
    text: string;
    subTitle: SubTitle[];
  }
  