import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TableContainer,
  Button,
  tableCellClasses,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getImageUrl } from '../../function/util';
import { useUserApprovedAiData } from '../../hook/ai/useUserApprovedAiData';
import { useAiPermissionMutations } from '../../hook/ai-permission/userAiPermissionMutation';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  width: '33.33%', // ทำให้คอลัมน์มีขนาดเท่าๆ กัน
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontSize: 18,
    fontWeight: 'bold',
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
  aiId: string;
  name: string;
  ai: string;
  imagePath: string;
  email: string;
  date: Date;
  ai_type: string;
  ai_tag: string[];
}

interface AiListTableProps {
  userId?: string;
}

type Order = 'asc' | 'desc';

const AiListTable: React.FC<AiListTableProps> = ({ userId }) => {
  // ดึงข้อมูล AI ที่ได้รับอนุมัติ
  const { AIData, refetchAIModels } = useUserApprovedAiData();
  // ใช้งาน mutation สำหรับถอนสิทธิ์ AI
  const { revokePermissionMutation } = useAiPermissionMutations();

  const [rows, setRows] = useState<Data[]>([]);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('date');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAi, setSelectedAi] = useState<{ aiId: string; name: string } | null>(null);
  const [actionSuccess, setActionSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setRows(AIData);
  }, [AIData]);

  const handleOpenDialog = (aiId: string, name: string) => {
    setSelectedAi({ aiId, name });
    setActionSuccess(null);
    setOpenDialog(true);
  };

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  const handleRevokePermission = () => {
    if (!userId || !selectedAi) return;
    
    // เรียก mutation แทนการใช้ axios.delete โดยตรง
    revokePermissionMutation.mutate(
      { userId, aiId: selectedAi.aiId },
      {
        onSuccess: () => {
          // อัปเดตตารางโดยลบข้อมูลที่ถูกถอนสิทธิ์ออก
          setRows((prevRows) => prevRows.filter((row) => row.aiId !== selectedAi.aiId));
          setActionSuccess(true);
          setTimeout(() => {
            setOpenDialog(false);
            refetchAIModels();
          }, 2000);
        },
        onError: () => {
          setActionSuccess(false);
        },
      }
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === 'ai'}
                direction={orderBy === 'ai' ? order : 'asc'}
                onClick={() => handleRequestSort('ai')}
              >
                ชื่อ AI
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">
              <TableSortLabel
                active={orderBy === 'ai'}
                direction={orderBy === 'ai' ? order : 'asc'}
                onClick={() => handleRequestSort('ai')}
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
                    src={getImageUrl(row.imagePath)}
                    alt={row.name}
                  />
                  <div className="ml-2">
                    <p className="text-black text-lg font-medium">{row.name}</p>
                    <p className="text-[#8D9BAE] text-sm font-normal">{row.ai_type}</p>
                  </div>
                </div>
              </StyledTableCell>

              <StyledTableCell align="center">
                <div className="flex flex-wrap gap-2 mt-2">
                  {row.ai_tag?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-sky-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {actionSuccess === null
            ? 'ยืนยันการถอนสิทธิ์'
            : actionSuccess
            ? 'ถอนสิทธิ์สำเร็จ'
            : 'เกิดข้อผิดพลาด'}
        </DialogTitle>
        <DialogContent>
          {actionSuccess === null ? (
            <Typography>
              คุณแน่ใจหรือไม่ว่าต้องการถอนสิทธิ์การเข้าถึง AI <b>{selectedAi?.name}</b>?
            </Typography>
          ) : actionSuccess ? (
            <Typography color="success">
              ถอนสิทธิ์ AI <b>{selectedAi?.name}</b> สำเร็จ! กำลังรีเฟรช...
            </Typography>
          ) : (
            <Typography color="error">
              ไม่สามารถถอนสิทธิ์ AI <b>{selectedAi?.name}</b> ได้ กรุณาลองใหม่
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {actionSuccess === null && (
            <>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                ยกเลิก
              </Button>
              <Button onClick={handleRevokePermission} color="error" variant="contained">
                ถอนสิทธิ์
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default AiListTable;
