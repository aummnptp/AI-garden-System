export type Member= {
    user: {
      userId: string;
      picture: string;
      name: string;
      email: string;
    };
    role: string;
    memberId: string;
  }


  export type ProjectPermission = {
    user: {
      userId: string;
    };
  }
  
  export type PendingUserData= {
    inviteId: string;
    user: {
      picture: string;
      name: string;
      email: string;
    };
  }
