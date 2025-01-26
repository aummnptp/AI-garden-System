import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
    Button, tableCellClasses,
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
    id: number;
    updatedAt: Date;
    user: {
        email: string;
        name: string;
        picture: string;
    };
    aiModel: {
        name: string;
        description: string;
        ai_type: string;
        ai_tag: string[];
        imagePath: string | null;
    };
}



// function createData(name: string, ai: string, ai_image: string, email: string, date: string,): Data {
//     return { name, ai, ai_image, email, date: new Date(date), };
// }

// const initialRows = [
//     createData('John Doe', "Ai","/images/ai/Object-detection-Real-world-applications-and-benefits.png", 'john@example.com', '2021-06-02T11:30:00'),
//     createData('Jane Smith', "Pet","/images/ai/627d124572023b6948b6cdff_60ed9a4e09e2c648f1b8a013_object-detection-cover.png", 'jane@example.com', '2024-09-02T12:30:00'),
//     createData('Alice Johnson', "Heath","/images/ai/dermpic.jpg", 'alice@example.com', '2024-06-02T13:30:00'),
//     createData('Alice Johnson', "Heath","/images/ai/dermpic.jpg", 'alice@example.com', '2024-06-02T13:30:00'),
//     createData('Alice Johnson', "Heath","/images/ai/dermpic.jpg", 'alice@example.com', '2023-06-02T13:30:00'),
// ];

type Order = 'asc' | 'desc';

const SortableTable: React.FC = () => {
    const [rows, setRows] = useState<Data[]>([]);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Data>('updatedAt');

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/detail`, {
                withCredentials: true,
            })
            .then((response) => {
                const formattedData = response.data.map((item: any) => ({
                    ...item,
                    updatedAt: new Date(item.updatedAt),
                    aiModel: {
                        ...item.aiModel,
                        createdAt: new Date(item.aiModel.createdAt),
                        updatedAt: new Date(item.aiModel.updatedAt),
                    },
                }));
                setRows(formattedData); // ตั้งค่า `rows` ด้วยข้อมูลที่จัดรูปแบบแล้ว
            })
            .catch((error) => {
                console.error("There was an error fetching the AI data!", error);
            });
    }, []);

    const handleRequestSort = (property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleAccept = (id: number, index: number) => {
        axios
            .patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}/approve`, {}, { withCredentials: true })
            .then(() => {
                setRows(prevRows => prevRows.filter((_, i) => i !== index));
            })
            .catch(error => {
                console.error("Error approving permission:", error);
            });
    };

    const handleReject = (id: number, index: number) => {
        axios
            .delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}`, { withCredentials: true })
            .then(() => {
                setRows(prevRows => prevRows.filter((_, i) => i !== index));
            })
            .catch(error => {
                console.error("Error rejecting permission:", error);
            });
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
                                active={orderBy === 'aiModel'}
                                direction={orderBy === 'aiModel' ? order : 'asc'}
                                onClick={() => handleRequestSort('aiModel')}
                            >
                                ชื่อ AI
                            </TableSortLabel>
                        </StyledTableCell >
                        <StyledTableCell  >
                            <TableSortLabel
                                active={orderBy === 'user'}
                                direction={orderBy === 'user' ? order : 'asc'}
                                onClick={() => handleRequestSort('user')}
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
                                active={orderBy === 'updatedAt'}
                                direction={orderBy === 'updatedAt' ? order : 'asc'}
                                onClick={() => handleRequestSort('updatedAt')}
                            >
                                ถูกขอใช้งานเมื่อ
                            </TableSortLabel>
                        </StyledTableCell >
                        <StyledTableCell align="center">
                            สถานะ
                        </StyledTableCell >
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                        <TableRow key={row.id}>
                            {/* AI Model Information */}
                            <StyledTableCell>
                                <div className="flex items-center my-2 w-fit">
                                    <img
                                        className="w-14 h-14 rounded-[10px] border-2"
                                        src={row.aiModel.imagePath || "/images/default-ai.png"}
                                        alt={row.aiModel.name || "AI Model"}
                                    />
                                    <div className="ml-2">
                                        <p className="text-black text-lg font-medium">{row.aiModel.name}</p>
                                        <p className="text-[#8D9BAE] text-sm font-normal">{row.aiModel.description || "No description"}</p>
                                    </div>
                                </div>
                            </StyledTableCell>

                            {/* User Information */}
                            <StyledTableCell>
                                <div className="flex items-center my-2 w-fit">
                                    <img
                                        className="w-10 h-10 rounded-full border-2"
                                        src={row.user.picture}
                                        alt={row.user.name}
                                    />
                                    <div className="ml-2">
                                        <p className="text-black text-lg font-medium">{row.user.name}</p>
                                        <p className="text-[#8D9BAE] text-sm font-normal">{row.user.email}</p>
                                    </div>
                                </div>
                            </StyledTableCell>

                            {/* Date Updated */}
                            <StyledTableCell>
                                <p className="text-black text-lg font-medium">
                                    {row.updatedAt.toLocaleDateString()} {row.updatedAt.toLocaleTimeString()}
                                </p>
                            </StyledTableCell>

                            {/* Actions */}
                            <StyledTableCell>
                                <div className="mx-auto flex justify-center">
                                    {/* Approve Button */}
                                    <Button
                                        onClick={() => handleAccept(row.id, index)}
                                        variant="contained"
                                        color="success"
                                        style={{ marginRight: "8px" }}
                                    >
                                        ยอมรับ
                                    </Button>

                                    {/* Reject Button */}
                                    <Button
                                        onClick={() => handleReject(row.id, index)}
                                        variant="outlined"
                                        color="error"
                                    >
                                        ปฏิเสธ
                                    </Button>
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