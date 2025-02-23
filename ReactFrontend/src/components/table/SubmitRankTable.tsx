import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TrophyFilled } from '@ant-design/icons';
import { formatDate, formatTime, getImageUrl } from '../../function/util';
import { Avatar, Typography } from '@mui/material';
// ใช้ custom hook สำหรับข้อมูล ranking และ project detail
import { useProjecteData } from '../../hook/projects/useProjectData';
import { useHistoryData } from '../../hook/history/useHistoryData';

export interface RankingData {
  userId: string;
  submitNumber: number;
  name: string;
  picture: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: '#312e81', // text-indigo-900
    fontSize: 22,
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

export default function SubmitRankTable() {
  const { rankingData, projectDetail, isLoadingRanking, errorRanking } = useProjecteData();
  const { projectHistory } = useHistoryData();
  const inputType = projectDetail?.input_type || '';

  if (isLoadingRanking) {
    return <Typography>Loading ranking data...</Typography>;
  }

  if (errorRanking) {
    return <Typography color="error">Error loading ranking data</Typography>;
  }

  return (
    <div className="w-full mx-auto flex gap-6">
      {/* 🏆 ตารางจัดอันดับ */}
      <div className="mx-4 px-4 w-[60%]">
        <TableContainer
          component={Paper}
          sx={{
            width: '100%',
            maxHeight: '500px',
            minHeight: '500px',
            overflowY: 'auto',
          }}
        >
          <Table stickyHeader sx={{ width: '100%' }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{
                    width: '30%',
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                  }}
                >
                  อันดับ
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    width: '40%',
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                  }}
                >
                  ชื่อ
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    width: '30%',
                    textAlign: 'center',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                  }}
                >
                  จำนวน ({inputType === 'วิดีโอ' ? 'วิดีโอ' : 'ภาพ'})
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankingData.map((row: RankingData, index: number) => (
                <StyledTableRow key={row.userId}>
                  <StyledTableCell
                    sx={{ textAlign: 'center', fontSize: '1rem', fontFamily: 'inherit' }}
                  >
                    {index < 3 && (
                      <TrophyFilled
                        style={{
                          fontSize: '1.525rem',
                          color:
                            index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        }}
                      />
                    )}
                    <span
                      className={`text-3xl font-bold ${
                        index < 3 ? 'text-indigo-600' : 'text-indigo-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: '1rem', fontFamily: 'inherit' }}>
                    <div className="flex items-center w-fit">
                      <Avatar className="w-10 h-10 rounded-full border-2" src={row.picture} alt="Avatar" />
                      <div className="ml-2">
                        <p className="text-indigo-900 text-lg font-medium">{row.name}</p>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center', fontSize: '1rem', fontFamily: 'inherit' }}>
                    <p className="text-indigo-600 text-xl font-medium">{row.submitNumber}</p>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* 📁 ประวัติการอัปโหลด */}
      <div
        className="px-6 py-4 w-[40%] border rounded-[10px] shadow-lg bg-white"
        style={{ maxHeight: '500px', minHeight: '500px', overflowY: 'auto' }}
      >
        <h2 className="text-indigo-900 text-2xl font-semibold mb-4 border-b pb-2">
          📂 ประวัติการอัปโหลด
        </h2>

        {projectHistory && projectHistory.length > 0 ? (
          projectHistory.map((item: any) => (
            <div key={item.createdAt} className="mb-4 border-b pb-4">
              <div className="flex items-center mb-2">
                <Avatar className="w-10 h-10 rounded-full border-2" src={item.user.picture} alt={item.user.name} />
                <div className="ml-3">
                  <p className="text-indigo-900 text-lg font-medium">{item.user.name}</p>
                  <p className="text-gray-600 text-sm">
                    {formatDate(item.createdAt)} เวลา: {formatTime(item.createdAt)} น.
                  </p>
                </div>
              </div>
              {inputType === 'วิดีโอ' ? (
                <video
                  className="w-28 h-28 border-2 object-cover rounded-md"
                  src={item.filePath}
                  controls
                />
              ) : (
                <img
                  className="w-28 h-28 border-2 object-cover rounded-md"
                  src={getImageUrl(item.filePath)}
                  alt={item.user.name}
                  loading="lazy"
                />
              )}
            </div>
          ))
        ) : (
          <Typography className="text-center text-gray-600">ไม่มีประวัติการอัปโหลด</Typography>
        )}
      </div>
    </div>
  );
}
