import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface memberData {
  id: number;
  name: string;
  email: string;
  picture:string;
  role: string;
}

interface userData {
  id: number;
  name: string;
  email: string;
  picture:string;
  role: string;
}

const WorkspaceInvitationPage = () => {
  let { workspaceId } = useParams();
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = useState<userData[]>([]);
  const [userDatas, setUserData] = useState<memberData[]>([]);
  const [pendingDatas, setPendingData] = useState<memberData[]>([]); // ข้อมูลuserที่ส่งคำเชิญไป
  const [memberDatas, setMemberData] = useState<memberData[]>([]);
  const [loading, setLoading] = useState(true);


  const [workspaceDetail, setWorkspaceDetail] = useState([]);

  
  
  const [removeMembeIndex, setRemoveMembeIndex] = useState<number | null>(null);
  const handleOpenRemoveMemberDialog = (index: number) => {
    setRemoveMembeIndex(index);  // เก็บค่า index ของสมาชิกที่ต้องการให้เปิด dialog
  };
  
  const handleCloseRemoveMemberDialog= () => {
    setRemoveMembeIndex(null);  // ปิด dialog โดยการรีเซ็ต index
  };

  
  // const handleChange = (event: SelectChangeEvent, index: number) => {
  //   const UpdatedMember = [...memberDatas];
  //   UpdatedMember[index].role = event.target.value;
  //   setMemberData(UpdatedMember);
  // };

  const link = "https://www.invite_example.com";
  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };


  const handleInviteButton = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to invite.");
      return;
    }
    const requestBody = {
      emails: selectedUsers.map((user) => user.email), // ดึง email จาก selectedUsers
    };
   try {
  const response = await axios.post(
    `${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/pending-invite/${workspaceId}`,
    requestBody,
    { withCredentials: true }
  );

  console.log("Response data:", response);

  if (response.status >= 200 && response.status < 300) {
    fetchData();

    // alert("Invitations sent successfully!");
    setSelectedUsers([]);
  } else {
    console.error("Unexpected response:", response);
    alert("Failed to send invitations. Please try again.");
  }
} catch (error) {
  console.error("Error sending invites", error);
  alert("An error occurred while sending invitations.");
}
  };

const handleDeleteMember = async (userId: number) => {
  // alert(userId)
  try {
    await axios.delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/remove-member/${workspaceId}`, {
      data: { userId: userId }, // ใส่ userId ใน data
      withCredentials: true,   // เปิดใช้งาน Credentials (เช่น Cookies หรือ Authorization headers)
    });

    alert("Member removed successfully!");
    fetchData();
  } catch (error) {
    alert(`Error: ${error}`);
    console.error(error);
  }
};

 
 
  const handleCancelPending = async(inviteId: number) => {
    // alert(inviteId)
    try{
      await axios.delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/cancel-invite/${inviteId}`,
      {withCredentials: true,}
      )
      fetchData();
    }catch(error){
      alert(`Error deleting pending invite: ${error}`)
  };
}




const handleChangeRole = async(userId: number ,newRole: string) => {
  // alert(inviteId)
  try{
    await axios.patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/change-role/${workspaceId}`,
      {userId:userId, role: newRole },
      {withCredentials: true,}
    )
    alert("Role updated successfully!")
    fetchData();
    //  const UpdatedPending = [...pendingDatas]; 
    //  UpdatedPending.splice(index, 1); 
    //  setPendingData(UpdatedPending); setOpen(false);
  }catch(error){
    alert(`${error}`)
};
}

const fetchData = async () => {
  try {
    // เรียก API หลายตัวพร้อมกัน
    const [
      workspaceResponse,allUserResponse,pendingListResponse,memberDataResponse,
    ] = await Promise.all([
      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/detail/${workspaceId}`, {
        withCredentials: true,
      }),
      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/available-users/${workspaceId}`, {
        withCredentials: true,
      }),
      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/pending-users/${workspaceId}`, {
        withCredentials: true,
      }),
      axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/members-profiles/${workspaceId}`, {
        withCredentials: true,
      }),
    ]);

    // อัปเดตสถานะของข้อมูลหลังจากที่ได้ผลลัพธ์
    setWorkspaceDetail(workspaceResponse.data);
    setUserData(allUserResponse.data);
    setPendingData(pendingListResponse.data);
    setMemberData(memberDataResponse.data);
  } catch (error) {
    console.error("Error fetching data!", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);
if (loading) {
  return <div>Loading...</div>;
}





  

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar workspaceName={workspaceDetail.name} />
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
            <h1
              className="p-5  text-3xl font-medium tracking-tight 
          text-indigo-900 "
            >
                 <i className="bi bi-pencil-fill"></i>  Workspace Setting
            </h1>
            <div className="w-full h-[0px] border border-zinc-300 mx-auto" />
            <div className="flex justify-start  ">
              {/* sticky top-[10%] bg-white w-full z-50 */}
              <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                  <Link to={`/workspaces/${workspaceId}/setting/edit`}>
                    <a
                      className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
                      aria-current="page"
                    >
                      Edit
                    </a>
                  </Link>
                </li>
                <li className="me-2">
                  <Link to={`/workspaces/${workspaceId}/setting/invitation`}>
                    <a className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active ">
                      Team Member
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* <div className="w-full h-[0px] border border-zinc-300 mx-auto" /> */}
            <div className=" w-[90%] mx-auto items-center mt-2">
              <div className=" w-full h-fit mt-4 bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4">
                <h1 className="text-black text-3xl px-10 pb-4">
                  <i className="bi bi-people-fill"></i> Member
                </h1>
                
                {memberDatas
                  .sort((a, b) => {
                    if (a.role === "owner" && b.role === "member")
                      return -1;
                    if (a.role === "member" && b.role === "owner")
                      return 1;
                    return 0;
                  })
                  .map((member, index) => (
                    <>
                      <div className="w-full h-[0px] border border-trueGray-300 mx-auto bg-red" />
                      <div
                        key={index}
                        className="px-10 py-1 flex items-center  justify-between w-full"
                      >
                        <div className="flex items-center ">
                          <img
                            className="w-10 h-10 rounded-full  border-2"
                            src={member.user.picture|| "/images/homeImage/profile.webp"}
                            alt="User"
                            onError={(e) => {
                              e.currentTarget.onerror = null; // ป้องกัน loop error
                              e.currentTarget.src = "/images/homeImage/profile.webp"; // ตั้งค่า fallback รูปภาพเมื่อเกิดข้อผิดพลาด
                            }}
                          />
                          <div className="ml-2">
                            <p className="text-indigo-900 text-xl font-medium">
                            {member.user.name} 
                            </p>
                            <p className="text-gray-400 text-lg ">
                              email: {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FormControl sx={{ m: 1, minWidth: 160 }}>
                            <Select
                              value={member.role}
                              onChange={(event) => handleChangeRole(member.user.userId, event.target.value)} 
                              // onChange={(event) => handleChange(event, index)}
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              disabled={index === 0}
                            >
                              <MenuItem value={"member"}>Member</MenuItem>
                              <MenuItem value={"owner"}>
                                Project owner
                              </MenuItem>
                            </Select>
                          </FormControl>
                          {index !== 0 && member.user?.userId ? (
                            <i
                                onClick={() => handleOpenRemoveMemberDialog(index)}
                              className="bi bi-trash-fill text-2xl text-gray-500 hover:text-red-400 cursor-pointer"
                            ></i>
                          ) : (
                            <i
                              className="bi bi-trash-fill text-2xl "
                              style={{
                                visibility: index === 0 ? "hidden" : "visible",
                              }}
                            ></i>
                          )}
                        </div>
                      
                      </div>

                    <Dialog
                    
                            // open={open}
                            open={removeMembeIndex === index}
                            onClose={handleCloseRemoveMemberDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"ต้องการที่จะลบสมาชิกนี้ออกจาก Workspaceใช่ไหม?"}
                            </DialogTitle>
                  
                            <DialogActions>

                              <Button variant="contained" color="error"  
                                    onClick={() => {
                                      if (member.user?.userId) {
                                        handleDeleteMember(member.user.userId);  // ลบสมาชิกที่เลือก
                                        handleCloseRemoveMemberDialog();  // ปิด dialog
                                      }
                                    }}
                              autoFocus >ลบสมาชิก</Button>
                              <Button  variant="outlined" color="info"onClick={handleCloseRemoveMemberDialog} >
                                ไม่
                              </Button>
                            </DialogActions>
                          </Dialog>
                    </>         
                  ))}
              </div>

              <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4  my-5">
                <h1 className="text-black text-3xl px-10 pb-4">
                  Pending invitation ({pendingDatas.length})
                </h1>
                {pendingDatas.map((member, index) => (
                  <div>
                    <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
                    <div
                      key={index}
                      className="px-10 py-2 flex items-center  justify-between w-full"
                    >
                      <div className="flex items-center ">
                        <img
                          className="w-10 h-10 rounded-full  border-2"
                          src={member.user.picture|| "/images/homeImage/profile.webp"}
                          alt="User"
                          onError={(e) => {
                            e.currentTarget.onerror = null; // ป้องกัน loop error
                            e.currentTarget.src = "/images/homeImage/profile.webp"; // ตั้งค่า fallback รูปภาพเมื่อเกิดข้อผิดพลาด
                          }}
                        />
                        <div className="ml-2">
                          <p className="text-indigo-900 text-xl font-medium">
                            {member.user.name}
                          </p>
                          <p className="text-gray-400 text-lg ">
                            Email: {member.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <i
                          onClick={() => handleCancelPending(member.inviteId)}
                          className="bi bi-x-circle-fill text-2xl text-gray-500 hover:text-red-400 cursor-pointer"
                        ></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-5 my-5">
                <h1 className="text-black text-3xl px-10 pb-5 pt-5">
                  Invitation
                </h1>

                <div className="mx-auto  w-full flex px-10 pb-5 bg-rd ">
                  <Autocomplete
                    multiple
                    options={userDatas}
                    // getOptionLabel={(option) =>`${option.firstName} ${option.lastName} (${option.email})`}
                    getOptionLabel={(option) => `${option.email}`}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <img
                          src={option.picture|| "/images/homeImage/profile.webp"}
                          alt="User"
                          onError={(e) => {
                            e.currentTarget.onerror = null; // ป้องกัน loop error
                            e.currentTarget.src = "/images/homeImage/profile.webp"; // ตั้งค่า fallback รูปภาพเมื่อเกิดข้อผิดพลาด
                          }}
                          alt="profile"
                          style={{
                            width: 30,
                            height: 30,
                            marginRight: 10,
                            borderRadius: "9999px",
                          }}
                        />
                        {`${option.name} (${option.email})`}
                      </li>
                    )}
                    value={selectedUsers}
                    onChange={(event, newValue) => {
                      setSelectedUsers(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Enter email address to invite"
                        variant="outlined"
                      />
                    )}
                    renderTags={(value: memberData[], getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={`${option.name}`}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    sx={{ width: "85%", marginRight: "5px" }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      my: "5px",
                      backgroundColor: "#4f46e5",
                      "&:hover": {
                        backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                      },
                    }}
                    onClick={handleInviteButton}
                  >
                    Send Invites
                  </Button>
                </div>

                <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
                <div className=" w-full h-fit bg-gray-100 mx-auto p-10 my-10 flex  ">
                  <div className="w-[60%] ">
                    <h1 className="text-indigo-900 text-3xl  ">
                      Invite with link or QR code{" "}
                    </h1>
                    <label className="mx-auto flex-col flex text-black text-2xl mb-2 mt-10  ">
                      invite link
                    </label>
                    <div className="flex items-center">
                      <TextField
                        id="standard-number"
                        defaultValue={link}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: "#2890e9", // สีของข้อความในช่อง input
                          },
                          width: "80%",
                          backgroundColor: "white",
                        }}
                      />
                      <span
                        className="cursor-pointer  text-xl ml-2  text-blue-500 hover:to-blue-800 hover:font-medium"
                        onClick={handleCopyClick}
                      >
                        {copied ? (
                          <i className="bi bi-clipboard-check-fill"></i>
                        ) : (
                          <i className="bi bi-clipboard-fill"></i>
                        )}
                        Copy link
                      </span>
                    </div>
                  </div>
                  <div className="w-[30%]  flex flex-col items-center ml-5">
                    <img
                      className="bg-white"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png"
                    />
                    <Button
                      variant="contained"
                      sx={{
                        my: "5px",
                        backgroundColor: "#4f46e5",
                        "&:hover": {
                          backgroundColor: "#3730a3", // สีที่ต้องการเมื่อ hover
                        },
                      }}
                    >
                      download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceInvitationPage;
