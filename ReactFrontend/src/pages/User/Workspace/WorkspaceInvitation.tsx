import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";

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

interface memberData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface userData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}


const WorkspaceInvitation = () => {
  let { workspaceId } = useParams();
  const [memberDatas, setMemberData] = useState<memberData[]>([
    {
      id: 1,
      firstName: "Putthipong",
      lastName: "Chobngam",
      email: "Putthipong@gmail.com",
      role: "Project owner",
    },
    {
      id: 2,
      firstName: "Apple",
      lastName: "Banana",
      email: "Apple@gmail.com",
      role: "Member",
    },
    {
      id: 3,
      firstName: "Kittinan",
      lastName: "Charearnsong",
      email: "Kittinana@gmail.com",
      role: "Project owner",
    },
    {
      id: 1,
      firstName: "Member",
      lastName: "LastName",
      email: "Member@gmail.com",
      role: "Member",
    },
  ]);

  const [pendingDatas, setPendingData] = useState<memberData[]>([
    // {
    //   id: 1,
    //   firstName: "Somchai",
    //   lastName: "Chobngam",
    //   email: "Putthipong@gmail.com",
    //   role: "Project owner",
    // },
    // {
    //   id: 2,
    //   firstName: "JoJo",
    //   lastName: "Banana",
    //   email: "Apple@gmail.com",
    //   role: "Member",
    // },
  ]);

  const [userDatas, setUserData] = useState<memberData[]>([
    {
      id: 1,
      firstName: "Putthipong",
      lastName: "Chobngam",
      email: "Putthipong@gmail.com",
      role: "Project owner",
    },
    {
      id: 2,
      firstName: "Apple",
      lastName: "Banana",
      email: "Apple@gmail.com",
      role: "Member",
    },
    {
      id: 3,
      firstName: "Kittinan",
      lastName: "Charearnsong",
      email: "Kittinana@gmail.com",
      role: "Project owner",
    },
    {
      id: 1,
      firstName: "Member",
      lastName: "LastName",
      email: "Member@gmail.com",
      role: "Member",
    },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<userData[]>([]);
  const handleChange = (event: SelectChangeEvent, index: number) => {
    const UpdatedMember = [...memberDatas];
    UpdatedMember[index].role = event.target.value;
    setMemberData(UpdatedMember);
  };

  const link = "https://www.invite_example.com";
  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {

    navigator.clipboard.writeText(link)
    .then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
  };
  const handleInviteButton = () => {
    
    setPendingData((prevPendingData) => [
      ...prevPendingData,
      ...selectedUsers.filter(
        // เช็คว่าอีเมลของผู้ใช้ไม่ได้อยู่ใน pendingData
        (user) => !prevPendingData.some((pending) => pending.email === user.email)
      ),
    ]);
    setSelectedUsers([]);
    
  }
  const handleDeleteMember = (index:number) => {
    const UpdatedMember = [...memberDatas];
    UpdatedMember.splice(index, 1);
    setMemberData(UpdatedMember)
    // setMemberData()
  };
  const handleDeletePending = (index:number) => {
    const UpdatedPending = [...pendingDatas];
    UpdatedPending.splice(index, 1);
    setPendingData(UpdatedPending)
    // setMemberData()
  };
  const filteredUserDatas = userDatas.filter(
    (user) => !pendingDatas.some((pending) => pending.email === user.email)
  );
  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-5 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
            <h1
              className="p-5  text-3xl font-medium tracking-tight 
          text-indigo-900 "
            >
              Workspace Setting
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
              <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4">
                <h1 className="text-black text-3xl px-10 pb-4"><i className="bi bi-people-fill"></i> Member</h1>
                {memberDatas
                  .sort((a, b) => {
                    if (a.role === "Project owner" && b.role === "Member")
                      return -1;
                    if (a.role === "Member" && b.role === "Project owner")
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
                            className="w-12 h-12 rounded-full  border-2"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png"
                          />
                          <div className="ml-2">
                            <p className="text-indigo-900 text-xl font-medium">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-gray-400 text-lg ">
                              email: {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FormControl sx={{ m: 1, minWidth: 160 }}>
                            <Select
                              value={member.role}
                              onChange={(event) => handleChange(event, index)}
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              disabled={index === 0}
                            >
                              <MenuItem value={"Member"}>Member</MenuItem>
                              <MenuItem value={"Project owner"}>
                                Project owner
                              </MenuItem>
                            </Select>
                          </FormControl>
                          {index !== 0 ? (
                            <i    onClick={() => handleDeleteMember( index)}
                            className="bi bi-trash-fill text-2xl text-gray-500 hover:text-red-400 cursor-pointer"></i>
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
                    </>
                  ))}
              </div>

              <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-4  my-5">
                <h1 className="text-black text-3xl px-10 pb-4">
                  Pending invitation ({pendingDatas.length})
                </h1>
                {pendingDatas.map((member, index) => (
                  <>
                    <div className="w-full h-[0px] border border-trueGray-300 mx-auto " />
                    <div
                      key={index}
                      className="px-10 py-2 flex items-center  justify-between w-full"
                    >
                      <div className="flex items-center ">
                        <img
                          className="w-12 h-12 rounded-full  border-2"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png"
                        />
                        <div className="ml-2">
                          <p className="text-indigo-900 text-xl font-medium">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-gray-400 text-lg ">
                            Email: {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <i  onClick={() => handleDeletePending( index)}
                        className="bi bi-trash-fill text-2xl text-gray-500 hover:text-red-400 cursor-pointer"></i>
                      </div>
                    </div>
                  </>
                ))}
              </div>

              <div className=" w-full h-fit bg-white rounded-[15px] border border-zinc-300 mx-auto pt-5 my-5">
                <h1 className="text-black text-3xl px-10 pb-5 pt-5">
                  Invitation
                </h1>

                <div className="mx-auto  w-full flex px-10 pb-5 bg-rd ">
                  <Autocomplete
                    multiple
                    options={filteredUserDatas}
                    // getOptionLabel={(option) =>`${option.firstName} ${option.lastName} (${option.email})`}
                    getOptionLabel={(option) => `${option.email}`}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/1200px-QR_Code_Example.svg.png"
                          alt="profile"
                          style={{ width: 30, height: 30, marginRight: 10 }}
                        />
                        {`${option.firstName} ${option.lastName} (${option.email})`}
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
                          label={`${option.firstName} ${option.lastName}`}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    sx={{ width: "85%", marginRight: "5px" }}
                  />

                  <Button variant="contained" sx={{ my: "5px" }} onClick={handleInviteButton}>
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
                      <span className="cursor-pointer  text-xl ml-2  text-blue-500 hover:to-blue-800 hover:font-medium" onClick={handleCopyClick}>
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
                    <Button variant="contained" sx={{ my: "5px" }}>
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

export default WorkspaceInvitation;
