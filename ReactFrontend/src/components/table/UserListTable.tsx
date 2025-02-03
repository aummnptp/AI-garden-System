import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
    Button,tableCellClasses ,
} from '@mui/material';


import formatDate from '../../function/formatDate';
import formatTime from '../../function/formatTime';
import { styled } from '@mui/material/styles';
import calculateDaysPassed from '../../function/caculatedDaysPassed';
import { Link } from 'react-router-dom';
import { Desk, PsychologyOutlined } from '@mui/icons-material';
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontSize: 18,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // huserIde last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
interface Data {
  userId:number;
  name: string;
  email: string;
  ai:number;
  workspace:number;
  date: Date;
}




type Order = 'asc' | 'desc';

const UserListTable = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('date');

  const fetchUserData = () => {
    axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users`, {
      withCredentials: true, 
    })
      .then(response => {
        setRows(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  

  const handleRequestSort = (property: keyof Data) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
  };
  const handleAccept = (index: number) => {
      setRows(prevRows => prevRows.filter((_, i) => i !== index));
  };

  const stableSort = (array: Data[], comparator: (a: Data, b: Data) => number) => {
      const stabilizedThis = array.map((el, index) => [el, index] as [Data, number]);
      stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order: Order, orderBy: keyof Data) => {
      return order === 'desc'
          ? (a: Data, b: Data) => descendingComparator(a, b, orderBy)
          : (a: Data, b: Data) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
      if (b[orderBy] < a[orderBy]) {
          return -1;
      }
      if (b[orderBy] > a[orderBy]) {
          return 1;
      }
      return 0;
  };
  
  



  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}
              >
                ชื่อผู้ใช้
              </TableSortLabel>
            </StyledTableCell>
            {/* <StyledTableCell >
                          <TableSortLabel
                              active={orderBy === 'email'}
                              direction={orderBy === 'email' ? order : 'asc'}
                              onClick={() => handleRequestSort('email')}
                          >
                              อีเมล
                          </TableSortLabel>
                      </StyledTableCell > */}
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === "date"}
                direction={orderBy === "date" ? order : "asc"}
                onClick={() => handleRequestSort("ai")}
              >
                จำนวน AI ที่ใช้งานได้
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === "date"}
                direction={orderBy === "date" ? order : "asc"}
                onClick={() => handleRequestSort("workspace")}
              >
                Workspaceที่สร้าง
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">จัดการ</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                <div className="flex items-center my-2 w-fit">
                  <img
                    className="w-10 h-10 rounded-full border-2"
                    src="/images/homeImage/profile.webp"
                  />
                  <div className="ml-2">
                    <p className="text-black text-lg font-medium">
                      <i className="bi bi-person-fill"></i>
                      {row.name}
                    </p>
                    <p className="text-[#8D9BAE] text-sm font-normal">
                      {row.email}
                    </p>
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">
                {" "}
                <PsychologyOutlined /> 
                <span className='text-black text-lg font-medium'> มีสิทธิ์ 
                </span>
                <span className='text-indigo-800 text-xl font-medium'> 
                  0
                   </span>
                  
              </StyledTableCell>

              <StyledTableCell align="center">     
           
                <Desk /> 
                <span className='text-black text-lg font-medium'>ทั้งหมด</span>
                <span className='text-indigo-800 text-xl font-medium'> 
                0
                </span>
                </StyledTableCell>
              <StyledTableCell>
                {" "}
                <div className="mx-auto flex justify-center">
                  <Link key={row.userId} to={`/admin/user/${row.userId}`}>
                    <Button
                      variant="contained"
                      color="info"
                      style={{ marginRight: "8px" }}
                    >
                      รายละเอียด
                    </Button>
                  </Link>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserListTable