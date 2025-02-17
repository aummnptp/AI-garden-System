import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
  Button, tableCellClasses,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@mui/material';
import axios from 'axios';


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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
interface Data {
  name: string;
  ai: string;
  ai_image: string;
  email: string;
  date: Date;
  ai_type: string;
}
interface AiListTableProps {
  userId?: string;
}





type Order = 'asc' | 'desc';

const AiListTable: React.FC<AiListTableProps> = ({ userId }) => {
  const [rows, setRows] = useState<Data[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("date");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAi, setSelectedAi] = useState<{ aiId: string; name: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<boolean | null>(null); // null = ไม่แสดง, true = สำเร็จ, false = ล้มเหลว

  useEffect(() => {
    if (userId) {
      axios
        .get(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-models/approved/${userId}`, {
          withCredentials: true,
        }) // ดึงข้อมูล AI ที่เกี่ยวข้องกับ userId
        .then((response) => {
          setRows(response.data); // response.data ควรเป็น array ของ AI
        })
        .catch((error) => {
          console.error("There was an error fetching the AI data!", error);
        });
    }
  }, [userId]);

  const handleOpenDialog = (aiId: string, name: string) => {
    setSelectedAi({ aiId, name });
    setActionSuccess(null); // รีเซ็ตค่า
    setOpenDialog(true);
  };


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

  const handleRevokePermission = async () => {
    if (!userId || !selectedAi) return;
    try {
        await axios.delete(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/ai-permission/user/${userId}/ai/${selectedAi.aiId}`, {
            withCredentials: true,
        });

        setRows((prevRows) => prevRows.filter((row) => row.aiId !== selectedAi.aiId)); // ลบออกจากตาราง
        setActionSuccess(true); // แสดงข้อความสำเร็จ

        // ✅ ปิด Dialog และ Refresh หน้าเว็บหลังจาก 2 วินาที
        setTimeout(() => {
            setOpenDialog(false);
            window.location.reload();
        }, 2000);
    } catch (error) {
        console.error("❌ ไม่สามารถถอนสิทธิ์ได้:", error);
        setActionSuccess(false); // แสดงข้อความล้มเหลว
    }
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
                <div className="flex items-center my-2 w-fit ml-32">
                  <img
                    className="w-14 h-14 rounded-[10px] border-2"
                    src={row.ai_image}
                  />
                  <div className="ml-2">
                    <p className="text-black text-lg font-medium">{row.name}</p>
                    <p className="text-[#8D9BAE] text-sm font-normal">
                      {row.ai_type}
                    </p>
                  </div>
                </div>
              </StyledTableCell>

              <StyledTableCell align="center">
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
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDialog(row.aiId, row.name)}
                  >
                    ถอนสิทธิ์
                  </Button>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {/* ✅ Dialog ยืนยันการถอนสิทธิ์ */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{actionSuccess === null ? "ยืนยันการถอนสิทธิ์" : actionSuccess ? "ถอนสิทธิ์สำเร็จ" : "เกิดข้อผิดพลาด"}</DialogTitle>
                <DialogContent>
                    {actionSuccess === null ? (
                        <Typography>
                            คุณแน่ใจหรือไม่ว่าต้องการถอนสิทธิ์การเข้าถึง AI <b>{selectedAi?.name}</b>?
                        </Typography>
                    ) : actionSuccess ? (
                        <Typography color="success">
                            ✅ ถอนสิทธิ์ AI <b>{selectedAi?.name}</b> สำเร็จ! กำลังรีเฟรช...
                        </Typography>
                    ) : (
                        <Typography color="error">
                            ❌ ไม่สามารถถอนสิทธิ์ AI <b>{selectedAi?.name}</b> ได้ กรุณาลองใหม่
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    {actionSuccess === null ? (
                        <>
                            <Button onClick={() => setOpenDialog(false)} color="secondary">
                                ยกเลิก
                            </Button>
                            <Button onClick={handleRevokePermission} color="error" variant="contained">
                                ถอนสิทธิ์
                            </Button>
                        </>
                    ) : null}
                </DialogActions>
            </Dialog>

    </TableContainer>

  );
};

export default AiListTable;