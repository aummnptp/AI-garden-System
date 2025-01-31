// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";

// // รูปแบบข้อมูลสำหรับ WorkspaceRole
// interface WorkspaceRole {
//   workspaceId: number;
//   role: string;
// }

// // Hook สำหรับดึง role ของ workspace
// export const useWorkspaceRole = (workspaceId: number): string | null => {
//   const authContext = useContext(AuthContext);
//   const user = authContext?.user;

//   if (!user || !user.workspaceRoles) {
//     // ถ้าไม่มีข้อมูลผู้ใช้หรือ workspaceRoles ให้ส่ง null
//     return null;
//   }

//   // ค้นหา role ของ workspace ที่ระบุ
//   const role = user.workspaceRoles.find(
//     (wsRole: WorkspaceRole) => wsRole.workspaceId === workspaceId
//   )?.role;

//   return role || null; // คืนค่า role หรือ null ถ้าไม่พบ
// };
