import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'; 
import Paper from '@mui/material/Paper';

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

function createData(
  image: string,
  name: string,
  type: string,
  carbs: number,
  protein: number,
) {
  return { image, name, type, carbs, protein };
}

const rows = [
  createData('Pet Care', "Pet Care", "object detection", 24, 4.0),
  createData('Road Detection', "Road Detection", "object detection", 37, 4.3),
  createData('Pet Care',"Pet Care", "object detection", 24, 6.0),
  createData('Road Detection', "Road Detection", "object detection", 67, 4.3),
  createData('Pet Detection', "Pet Detection", "object detection", 49, 3.9),
  createData('Pet Care', "Pet Care", "object detection", 49, 3.9),
];

export default function CustomizedTables() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell  > รูปปก  AI</StyledTableCell>
            <StyledTableCell align="center">ชื่อ AI</StyledTableCell>
            <StyledTableCell align="center">วันที่&nbsp;(เวลา)</StyledTableCell>
            <StyledTableCell align="center">จำนวน&nbsp;(รูป/วิดีโอ)</StyledTableCell>
            <StyledTableCell align="center">ผู้อัปโหลด&nbsp;</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {rows.map((row) => (
            <StyledTableRow  key={row.image}>
              <StyledTableCell component="th" scope="row">
              <img
            className="m-2 w-[186px] h-[168px] rounded-[10px] "
            src="../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png"
            />
              </StyledTableCell>
              <StyledTableCell align="center">{row.name}</StyledTableCell>
              <StyledTableCell align="center">{row.type}</StyledTableCell>
              <StyledTableCell align="center">{row.carbs}</StyledTableCell>
              <StyledTableCell align="center">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}