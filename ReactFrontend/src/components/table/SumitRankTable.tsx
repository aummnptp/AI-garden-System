import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TrophyFilled } from '@ant-design/icons';

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
rank:number,
  name: string,
  avartar:string,
  submitNumber: number,

) {
  return { rank,name, avartar,submitNumber, };
}

const rows = [
  createData(1,'Frozen yoghurt',"/images/homeImage/puttipong.jpg", 85,),
  createData(2,'Ice cream sandwich',"/images/homeImage/kittnan.jpeg", 70, ),
  createData(3,'Eclair', "/images/homeImage/profile.webp",14, ),
  createData(4,'Cupcake', "/images/homeImage/profile.webp",14, ),
  createData(5,'Gingerbread', "/images/homeImage/profile.webp",12, ),
];

export default function SubmitRankTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>อันดับ</StyledTableCell>
            <StyledTableCell>ชื่อ </StyledTableCell>
            <StyledTableCell align="center">จำนวนการใช้งาน</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
              <span className={`text-3xl font-bold ${row.rank <= 3 ? 'text-indigo-600' : ''}`}> {row.rank}</span>
                {row.rank <= 3 && (
                  <TrophyFilled
                    style={{
                      fontSize: "1.525rem",
                      color:
                        row.rank === 1
                          ? "#FFD700"
                          : row.rank === 2
                          ? "#C0C0C0"
                          : "#CD7F32",
                    }}
                  />
                )}
              </StyledTableCell>
              <StyledTableCell>
                <div className="flex items-center  w-fit">
                  <img
                    className="w-10 h-10 rounded-full border-2"
                    src={row.avartar}
                  />
                  <div className="ml-2">
                    <p className="text-indigo-900 text-lg font-medium">{row.name}</p>
                  </div>
                </div>
              </StyledTableCell>
              <StyledTableCell align="center">
                <p className='text-black text-xl font-medium'>

                {row.submitNumber}
                </p>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
