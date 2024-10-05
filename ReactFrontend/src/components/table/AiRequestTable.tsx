import React, { useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
    Button,tableCellClasses ,
} from '@mui/material';


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

const SortableTable: React.FC = () => {
    const [rows, setRows] = useState<Data[]>(initialRows);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Data>('date');

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
                    <TableRow>

                        <StyledTableCell >
                            <TableSortLabel
                                active={orderBy === 'ai'}
                                direction={orderBy === 'ai' ? order : 'asc'}
                                onClick={() => handleRequestSort('ai')}
                            >
                                ชื่อ AI
                            </TableSortLabel>
                        </StyledTableCell >
                        <StyledTableCell  >
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={() => handleRequestSort('name')}
                            >
                              ชื่อผู้ขอใช้งาน
                            </TableSortLabel>
                        </StyledTableCell >
                        {/* <StyledTableCell >
                            <TableSortLabel
                                active={orderBy === 'email'}
                                direction={orderBy === 'email' ? order : 'asc'}
                                onClick={() => handleRequestSort('email')}
                            >
                                อีเมล
                            </TableSortLabel>
                        </StyledTableCell > */}
                        <StyledTableCell >
                            <TableSortLabel
                                active={orderBy === 'date'}
                                direction={orderBy === 'date' ? order : 'asc'}
                                onClick={() => handleRequestSort('date')}
                            >
                                ถูกขอใช้งานเมื่อ
                            </TableSortLabel>
                        </StyledTableCell >
                        <StyledTableCell  align="center">
            สถานะ
        </StyledTableCell >
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                        <TableRow key={index}>
                            <StyledTableCell>
                            <div className="flex items-center my-2 w-fit">
                          <img
                            className="w-14 h-14 rounded-[10px] border-2"
                            src={row.ai_image}
                          />
                          <div className="ml-2">
                            <p className="text-black text-lg font-medium">{row.ai}</p>
                            <p className="text-[#8D9BAE] text-sm font-normal">Classification</p>
                          </div>
                        </div>
                        </StyledTableCell>
                            <StyledTableCell>
                            <div className="flex items-center my-2 w-fit">
                          <img
                            className="w-10 h-10 rounded-full border-2"
                            src="/images/homeImage/profile.webp"
                          />
                          <div className="ml-2">
                            <p className="text-black text-lg font-medium"><i className="bi bi-person-fill"></i>{row.name}</p>
                            <p className="text-[#8D9BAE] text-sm font-normal">{row.email}</p>
                          </div>
                        </div>
                            </StyledTableCell>
                            {/* <StyledTableCell>{row.email}</StyledTableCell> */}
                    
                             <StyledTableCell>
                             <div>

                            <p className="text-black text-lg font-medium"><i className="bi bi-clock-history"></i> {calculateDaysPassed(row.date)}</p>
                          <text className='text-[#8D9BAE]'>
                             เวลา: {formatTime(row.date)}
                             {" "}วันที่: {formatDate(row.date)}
                            </text>
                        
                            </div>
                             </StyledTableCell>
                             <StyledTableCell>  <div className='mx-auto flex justify-center'>
                                
                                <Button onClick={() => handleAccept(index)} variant="contained" color="success"     style={{ marginRight: '8px' }} >ยอมรับ</Button> <Button variant="outlined" color="error">ปฎิเสธ</Button>
                                </div>
                                </StyledTableCell> 
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SortableTable;