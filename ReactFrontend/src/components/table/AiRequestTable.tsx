import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
    Button, tableCellClasses,
} from '@mui/material';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import formatDate from '../../function/formatDate';
import formatTime from '../../function/formatTime';
import { styled } from '@mui/material/styles';

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

type Order = 'asc' | 'desc';

const SortableTable: React.FC = () => {
    const [rows, setRows] = useState<Data[]>([]);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof Data>('updatedAt');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogData, setDialogData] = useState<{
        id: number;
        index: number;
        action: 'accept' | 'reject';
    } | null>(null);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/detail`, {
                withCredentials: true,
            })
            .then((response) => {
                const formattedData = response.data.map((item: any) => ({
                    ...item,
                    updatedAt: new Date(item.updatedAt),
                }));
                setRows(formattedData);
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

    const handleOpenDialog = (id: number, index: number, action: 'accept' | 'reject') => {
        setDialogData({ id, index, action });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogData(null);
    };

    const handleConfirmAction = () => {
        if (!dialogData) return;

        const { id, index, action } = dialogData;

        if (action === 'accept') {
            axios
                .patch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}/approve`, {}, { withCredentials: true })
                .then(() => {
                    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
                })
                .catch((error) => {
                    console.error("Error approving permission:", error);
                });
        } else {
            axios
                .delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/${id}`, { withCredentials: true })
                .then(() => {
                    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
                })
                .catch((error) => {
                    console.error("Error rejecting permission:", error);
                });
        }

        handleCloseDialog();
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
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'aiModel'}
                                    direction={orderBy === 'aiModel' ? order : 'asc'}
                                    onClick={() => handleRequestSort('aiModel')}
                                >
                                    ชื่อ AI
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'user'}
                                    direction={orderBy === 'user' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user')}
                                >
                                    ชื่อผู้ขอใช้งาน
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell>
                                <TableSortLabel
                                    active={orderBy === 'updatedAt'}
                                    direction={orderBy === 'updatedAt' ? order : 'asc'}
                                    onClick={() => handleRequestSort('updatedAt')}
                                >
                                    ถูกขอใช้งานเมื่อ
                                </TableSortLabel>
                            </StyledTableCell>
                            <StyledTableCell align="center">สถานะ</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {rows.length === 0 ? (
        // กรณีไม่มี request
        <TableRow>
            <StyledTableCell colSpan={4} align="center">
                <Typography variant="h6" color="textSecondary">
                    ยังไม่มี request ในตอนนี้
                </Typography>
            </StyledTableCell>
        </TableRow>
    ) : (
        // แสดงรายการ request ตามปกติ
        stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
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
                            <p className="text-[#8D9BAE] text-sm font-normal">
                                {row.aiModel.description || "No description"}
                            </p>
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
                            onClick={() => handleOpenDialog(row.id, index, 'accept')}
                            variant="contained"
                            color="success"
                            style={{ marginRight: "8px" }}
                        >
                            ยอมรับ
                        </Button>

                        {/* Reject Button */}
                        <Button
                            onClick={() => handleOpenDialog(row.id, index, 'reject')}
                            variant="outlined"
                            color="error"
                        >
                            ปฏิเสธ
                        </Button>
                    </div>
                </StyledTableCell>
            </TableRow>
        ))
    )}
</TableBody>
                </Table>
            </TableContainer>

            {/* Dialog Section */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>ยืนยันการดำเนินการ</DialogTitle>
                <DialogContent>
                    <Typography>
                        คุณต้องการ{dialogData?.action === 'accept' ? 'ยอมรับ' : 'ปฏิเสธ'}คำขอนี้ใช่หรือไม่?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        ยกเลิก
                    </Button>
                    <Button onClick={handleConfirmAction} color="primary" variant="contained">
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SortableTable;
