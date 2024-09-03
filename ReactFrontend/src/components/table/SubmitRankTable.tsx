import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TrophyFilled } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SelectedUserData {
  UserRank: number;
  submitData: number[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
}));

function createData(
  rank: number,
  name: string,
  avartar: string,
  submitNumber: number,
  submitData: number[],
) {
  return { rank, name, avartar, submitNumber, submitData };
}

const rows = [
  createData(1, 'Frozen yoghurt', '/images/homeImage/puttipong.jpg', 121, [8  ,0, 35, 5, 10, 76, 3, 15,5,5,6,0,0]),
  createData(2, 'Ice cream sandwich', '/images/homeImage/kittnan.jpeg', 85, [20, 13, 15,0,0,0,0,0,0,0,0,0]),
  createData(3, 'Eclair', '/images/homeImage/profile.webp', 85, [35, 13, 15,0,0,0,0,0,0,0,0,0]),
  createData(4, 'Cupcake', '/images/homeImage/profile.webp', 85, [20, 3, 15,0,0,0,0,0,0,0,0,0]),
  createData(5, 'Gingerbread', '/images/homeImage/profile.webp', 85, [10, 5, 15,0,0,0,0,0,0,0,0,0]),
];

export default function SubmitRankTable() {
  const [selectedUser, setSelectedUser] = useState<SelectedUserData | null>(null);

  const handleShowSubmit = (row: any) => {
    const filtered = rows.find((user) => user.rank === row);
    if (filtered) {
      setSelectedUser({ UserRank: filtered.rank, submitData: filtered.submitData });
    }
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'],
    datasets: [
      {
        label: 'จำนวนการประมวลผลรายเดือน',
        data: selectedUser?.submitData || [],
        fill: false,
        backgroundColor: 'rgba(138,43,226,0.6)',
        borderColor: 'rgba(138,43,226,1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full  flex ">
      <div className='w-[100%]'>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>อันดับ</StyledTableCell>
              <StyledTableCell>ชื่อ</StyledTableCell>
              <StyledTableCell align="center">จำนวนการประมวลผล (ภาพ)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.rank} onClick={() => handleShowSubmit(row.rank)}>
                <StyledTableCell component="th" scope="row">
                  <span
                    className={`text-3xl font-bold ${row.rank <= 3 ? 'text-indigo-600' : ''}`}
                  >
                    {row.rank}
                  </span>
                  {row.rank <= 3 && (
                    <TrophyFilled
                      style={{
                        fontSize: '1.525rem',
                        color:
                          row.rank === 1
                            ? '#FFD700'
                            : row.rank === 2
                            ? '#C0C0C0'
                            : '#CD7F32',
                      }}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell>
                  <div className="flex items-center w-fit">
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
                  <p className="text-black text-xl font-medium">{row.submitNumber}</p>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      {selectedUser && (
        <div className="my-auto  w-[1000px] ">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
