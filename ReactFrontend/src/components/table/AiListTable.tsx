import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
    Button,tableCellClasses ,
} from '@mui/material';
import axios from 'axios';

import formatDate from '../../function/formatDate';
import formatTime from '../../function/formatTime';
import { styled } from '@mui/material/styles';
import calculateDaysPassed from '../../function/caculatedDaysPassed';




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
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
interface Data {
    name: string;
    ai: string;
    ai_image:string;
    email: string;
    date: Date;
}
interface AiListTableProps {
  userId?: string;
}

function createData(name: string, ai: string, ai_image: string, email: string ,date: string,): Data {
    return { name, ai,  ai_image,email , date: new Date(date), };
}

const initialRows = [
    createData('John Doe', "Ai","/images/ai/Object-detection-Real-world-applications-and-benefits.png", 'john@example.com', '2021-06-02T11:30:00'),
    createData('Jane Smith', "Pet","/images/ai/627d124572023b6948b6cdff_60ed9a4e09e2c648f1b8a013_object-detection-cover.png", 'jane@example.com', '2024-09-02T12:30:00'),
    createData('Alice Johnson', "Heath","/images/ai/dermpic.jpg", 'alice@example.com', '2024-06-02T13:30:00'),
    createData('Alice Johnson', "Heath","/images/ai/dermpic.jpg", 'alice@example.com', '2024-06-02T13:30:00'),
    createData('Alice Johnson', "Heath","/images/ai/dermpic.jpg", 'alice@example.com', '2023-06-02T13:30:00'),
];

type Order = 'asc' | 'desc';

const AiListTable: React.FC<AiListTableProps> = ({ userId }) => {
  const [rows, setRows] = useState<Data[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("date");

  useEffect(() => {
    if (userId) {
      axios
        .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/approved/${userId}`) // ดึงข้อมูล AI ที่เกี่ยวข้องกับ userId
        .then((response) => {
          setRows(response.data); // response.data ควรเป็น array ของ AI
        })
        .catch((error) => {
          console.error("There was an error fetching the AI data!", error);
        });
    }
  }, [userId]);

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleAccept = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const stableSort = (
    array: Data[],
    comparator: (a: Data, b: Data) => number
  ) => {
    const stabilizedThis = array.map(
      (el, index) => [el, index] as [Data, number]
    );
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order: Order, orderBy: keyof Data) => {
    return order === "desc"
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
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === "ai"}
                direction={orderBy === "ai" ? order : "asc"}
                onClick={() => handleRequestSort("ai")}
              >
                ชื่อ AI
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === "ai"}
                direction={orderBy === "ai" ? order : "asc"}
                onClick={() => handleRequestSort("ai")}
              >
                Tag
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">จัดการ</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                <div className="flex items-center my-2 w-fit mx-auto">
                  <img
                    className="w-14 h-14 rounded-[10px] border-2"
                    src={row.ai_image}
                  />
                  <div className="ml-2">
                    <p className="text-black text-lg font-medium">{row.name}</p>
                    <p className="text-[#8D9BAE] text-sm font-normal">
                      Classification
                    </p>
                  </div>
                </div>
              </StyledTableCell>

              <StyledTableCell  align="center">
                <span className="w-fit  bg-indigo-600 rounded-[10px] me-2 px-2.5 py-1.5  text-white text-sm font-normal">
                 Tags
                </span>
                <span className="w-fit  bg-indigo-600 rounded-[10px] me-2 px-2.5  py-1.5   text-white text-sm font-normal">
                 Tags
                </span>
                <span className="w-fit  bg-indigo-600 rounded-[10px] me-2 px-2.5  py-1.5   text-white text-sm font-normal">
                 Tags
                </span>
              </StyledTableCell>

              <StyledTableCell>
                <div className="mx-auto flex justify-center">
                  <Button variant="outlined" color="error">
                    ถอนสิทธิ์
                  </Button>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AiListTable;