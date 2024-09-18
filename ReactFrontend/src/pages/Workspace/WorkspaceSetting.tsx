import React, {  useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar";

import { Button, Dialog, DialogActions, DialogTitle, FormControl, FormHelperText, MenuItem, TextField } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Link, redirect, useParams } from 'react-router-dom';
import axios from 'axios';
import { SaveOutlined } from '@ant-design/icons';
interface memberData {
  id:number
  firstName: string;
  lastName: string;
  email:string;
  role:string;
}



const WorkspaceSetting = () => {
  let {workspaceId} = useParams();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/workspaces/${workspaceId}`);
        const { name, description } = response.data;
        setName(name);
        setDescription(description);
        
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Workspace:', error);
      }
    };
  
    fetchWorkspace();
  }, [workspaceId]);


    // ฟังก์ชันจัดการการคลิกปุ่มบันทึก
    const handleSave = async () => {
      try {
        const payload = {
          name,
          description,
        };
  
        // ส่งคำขอ PATCH เพื่ออัปเดต Workspace
        const response = await axios.patch(`http://localhost:3000/workspaces/${workspaceId}`, payload);
        window.location.href = '/workspaces';
        // จัดการเมื่ออัปเดตสำเร็จ
        console.log('อัปเดต Workspace สำเร็จ:', response.data);
        // คุณอาจต้องการนำทางไปยังหน้าต่างๆ หรือแสดงข้อความสำเร็จ
        // navigate(`/workspaces/${workspaceId}`);
  
      } catch (error) {
        // จัดการข้อผิดพลาด
        console.error('เกิดข้อผิดพลาดในการอัปเดต Workspace:', error);
        alert('เกิดข้อผิดพลาดในการอัปเดต Workspace');
      }
    };


    const handleModalDelete=()=>{
      setOpen(true);
    }

  
    const handleClose = () => {
      setOpen(false);
    };
    const handleDelte = async () => {
      try {
        const payload = {
          name,
          description,
        };
  
        // ส่งคำขอ PATCH เพื่ออัปเดต Workspace
        const response = await axios.delete(`http://localhost:3000/workspaces/${workspaceId}`);
        window.location.href = '/workspaces';
        // จัดการเมื่ออัปเดตสำเร็จ
        console.log('ลบ Workspace สำเร็จ:', response.data);
        // คุณอาจต้องการนำทางไปยังหน้าต่างๆ หรือแสดงข้อความสำเร็จ
        // navigate(`/workspaces/${workspaceId}`);
  
      } catch (error) {
        // จัดการข้อผิดพลาด
        console.error('เกิดข้อผิดพลาดในการลบ Workspace:', error);
        alert('เกิดข้อผิดพลาดในการลบ Workspace');
      }
    };

  return (
    <>
      <div className="flex h-full min-h-screen bg-neutral-100">
        {/* side bar */}
        <Sidebar></Sidebar>
        {/* content container */}
        <div className=" w-10/12 ml-auto bg-neutral-100 flex flex-col items-center pb-32  h-full min-h-screen">
          <div className="mt-4 pb-5 h-fit w-[95%] bg-white rounded-[15px] justify-self-center relative px-5 pt-2">
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
                className="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active "
                aria-current="page"
              >
              Edit
              </a>
              </Link>
            </li>
            <li className="me-2">
            <Link to={`/workspaces/${workspaceId}/setting/invitation`}>
              <a
                href="#"
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 "
              >
              Team Member
              </a>
              </Link>
            </li>
            
          </ul>
        </div>



            {/* <div className="w-full h-[0px] border border-zinc-300 mx-auto" /> */}
            <div className=" w-[80%] mx-auto items-center pt-8 pb-10">
              <label className="mx-auto flex-col flex text-black text-2xl mb-2  ">
                Workspace name
              </label>
              <div className='mx-auto flex-col flex text-black text-2xl mb-10'>

              <TextField
                  id="standard-number"
                  placeholder='workspace name'
                  defaultValue={"Workspace Name"}
                  // label="Number"
                  // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
              <label className="mx-auto flex-col flex text-black text-2xl mb-2 ">
                {" "}
                description
                </label>
                <div className='mx-auto flex-col flex text-black text-2xl'>

                <TextField
                  id="standard-number"
                     placeholder='workspace description'
                  multiline
                  rows={4}
                  defaultValue={"รายละเอียด ........"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  // label="Number"
                  // InputLabelProps={{
                  //   shrink: true,
                  // }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className=" pl-[20%] justify-between pr-12 w-full h-[12%]  bg-white border border-zinc-300 fixed bottom-0 right-0 flex items-center">
        <button
                  onClick={handleModalDelete
                  }
                  type="button"
                  className=" bg-red-500  hover:bg-red-600  rounded-lg px-5 py-2.5 me-2 
            focus:outline-none 
            text-center text-white text-xl font-light "
                >
                 Delete Workspace
                </button>
          
          <button
            type="button"
            className=" w-fit  bg-indigo-600 hover:bg-blue-800
            focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2.5 me-2 
            focus:outline-none 
            text-center text-white text-xl font-light"
            onClick={handleSave}
            >
      
            Save
          </button>
          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"Want to delete a Workspace?"}
                            </DialogTitle>
                  
                            <DialogActions>

                              <Button variant="contained" color="error"  onClick={() => {
                              handleDelte();
                               handleClose();
                              }}autoFocus >Delete </Button>
                              <Button  variant="outlined" color="info"onClick={handleClose} >
                                No
                              </Button>
                            </DialogActions>
                          </Dialog>
        </div>
      </div>
    </>
  );
};

export default WorkspaceSetting;
