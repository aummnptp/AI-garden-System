import  { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
  Button, tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface Data {
  userId: number;
  name: string;
  email: string;
  picture: string,
  approvedCount: number; // จำนวน AI ที่ใช้งานได้
  workspaceCount: number; // จำนวน Workspace ที่สร้าง
}

type Order = 'asc' | 'desc';

const UserListTable = ({ searchQuery }: { searchQuery: string }) => {
  const [rows, setRows] = useState<Data[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/users`, { withCredentials: true });
      const users = response.data;

      const usersWithCounts = await Promise.all(
        users.map(async (user: any) => {
          const { data: approvedData } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/count-approved/${user.userId}`, { withCredentials: true });
          const { data: workspaceData } = await axios.get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/count/${user.userId}`, { withCredentials: true });

          return {
            ...user,
            approvedCount: approvedData.approvedCount,
            workspaceCount: workspaceData.workspaceCount,
          };
        })
      );

      setRows(usersWithCounts);
    } catch (error) {
      console.error("❌ There was an error fetching the user data!", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const stableSort = (array: Data[], comparator: (a: Data, b: Data) => number) => {
    return [...array].sort(comparator);
  };

  const getComparator = (order: Order, orderBy: keyof Data) => {
    return order === 'desc'
      ? (a: Data, b: Data) => descendingComparator(a, b, orderBy)
      : (a: Data, b: Data) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };


  const filteredRows = rows.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Sort ตาม ชื่อผู้ใช้ */}
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}
              >
                ชื่อผู้ใช้
              </TableSortLabel>
            </StyledTableCell>

            {/* Sort ตาม จำนวน AI ที่ใช้งานได้ */}
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === "approvedCount"}
                direction={orderBy === "approvedCount" ? order : "asc"}
                onClick={() => handleRequestSort("approvedCount")}
              >
                จำนวน AI ที่ใช้งานได้
              </TableSortLabel>
            </StyledTableCell>

            {/* Sort ตาม จำนวน Workspace ที่สร้าง */}
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === "workspaceCount"}
                direction={orderBy === "workspaceCount" ? order : "asc"}
                onClick={() => handleRequestSort("workspaceCount")}
              >
                Workspace ที่สร้าง
              </TableSortLabel>
            </StyledTableCell>

            <StyledTableCell align="center">จัดการ</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(filteredRows, getComparator(order, orderBy)).map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                <div className="flex items-center my-2 w-fit">
                  <img className="w-10 h-10 rounded-full border-2" src={row.picture} />
                  <div className="ml-2">
                    <p className="text-black text-lg font-medium">{row.name}</p>
                    <p className="text-[#8D9BAE] text-sm font-normal">{row.email}</p>
                  </div>
                </div>
              </StyledTableCell>

              <StyledTableCell align="center">
                <PsychologyOutlined />
                <span className='text-black text-lg font-medium'> มีสิทธิ์ </span>
                <span className='text-indigo-800 text-xl font-medium'>
                  {row.approvedCount}
                </span>
              </StyledTableCell>

              <StyledTableCell align="center">
                <Desk />
                <span className='text-black text-lg font-medium'>ทั้งหมด </span>
                <span className='text-indigo-800 text-xl font-medium'>
                  {row.workspaceCount}
                </span>
              </StyledTableCell>

              <StyledTableCell>
                <div className="mx-auto flex justify-center">
                  <Link key={row.userId} to={`/admin/user/${row.userId}`}>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "indigo",
                        borderColor: "indigo",
                        "&:hover": {
                          backgroundColor: "indigo",
                          color: "white",
                        },
                      }}
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

export default UserListTable;
