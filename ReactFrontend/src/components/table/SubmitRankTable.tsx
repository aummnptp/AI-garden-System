import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PictureOutlined, TrophyFilled, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { formatDate, formatTime, getImageUrl } from '../../function/util';
import { Avatar, Typography } from '@mui/material';
// ใช้ custom hook สำหรับข้อมูล ranking และ project detail
import { useProjecteData } from '../../hook/projects/useProjectData';
import { useHistoryData } from '../../hook/history/useHistoryData';
import SummaryCard from '../chart/sumaryCard';
import { useParams,Link } from 'react-router-dom';

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
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string; }>();

  const { statisticData, projectDetail, isLoadingStatistic, errorStatistic } = useProjecteData();
  const { projectHistory } = useHistoryData();
  const inputType = projectDetail?.input_type || '';

  if (isLoadingStatistic) {
    return <Typography>Loading ranking data...</Typography>;
  }

  if (errorStatistic) {
    return <Typography color="error">Error loading ranking data</Typography>;
  }

  return (
    <div className="flex flex-col w-full mx-auto gap-2">
      {/* แถวที่ 1: Summary Card */}
      <div className="grid grid-cols-3 gap-2">
        <SummaryCard
          icon={<UserOutlined style={{ color: "#fff", fontSize: "2em" }} />}
          label="จำนวนผู้ใช้ทั้งหมด"
          value={statisticData.userCount}
          valueType="ผู้ใช้"
          disable={false}
        />
        {projectDetail.input_type === "รูปภาพ" ? (
          <SummaryCard
            icon={<PictureOutlined style={{ color: "#fff", fontSize: "2em" }} />}
            label="ประมวลผลด้วยภาพ"
            value={statisticData.imageCount}
            valueType="ภาพ"
            disable={projectDetail.input_type === "วิดีโอ"}
          />
        ) : (
          <SummaryCard
            icon={<VideoCameraOutlined style={{ color: "#fff", fontSize: "2em" }} />}
            label="ประมวลผลด้วยภาพ"
            value=""
            valueType="ภาพ"
            disable={true}
          />
        )}
        {projectDetail.input_type === "วิดีโอ" ? (
          <SummaryCard
            icon={<VideoCameraOutlined style={{ color: "#fff", fontSize: "2em" }} />}
            label="ประมวลผลด้วยวิดีโอ"
            value={statisticData.videoCount}
            valueType="วิดีโอ"
            disable={projectDetail.input_type === "รูปภาพ"}
          />
        ) : (
          <SummaryCard
            icon={<VideoCameraOutlined style={{ color: "#fff", fontSize: "2em" }} />}
            label="ประมวลผลด้วยวิดีโอ"
            value=""
            valueType="วิดีโอ"
            disable={true}
          />
        )}
      </div>

      <div className="flex gap-6 items-start">
        <div className="w-[60%]">
          <TableContainer
            component={Paper}
            sx={{
              width: '100%', // ทำให้มีขนาดเท่ากับ div เดิม
              maxHeight: '500px',
              minHeight: '500px',
              overflowY: 'auto',
              borderRadius: '10px', // ให้ขอบมน
              boxShadow: 3, // ให้เงาเหมือนกล่องเดิม
              borderBottom: '1px solid #E5E7EB',
              backgroundColor: 'white', // พื้นหลังสีขาว
              padding: '24px', // p-6 ของ Tailwind
            }}
          >
            <Table stickyHeader sx={{ width: '100%' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ width: '30%', textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', fontFamily: 'inherit' }}>
                    อันดับ
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '40%', textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', fontFamily: 'inherit' }}>
                    ชื่อ
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: '30%', textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', fontFamily: 'inherit' }}>
                    จำนวน ({inputType === 'วิดีโอ' ? 'วิดีโอ' : 'ภาพ'})
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statisticData.ranking.map((row: RankingData, index: number) => (
                  <StyledTableRow key={row.userId}>
                    <StyledTableCell sx={{ textAlign: 'center', fontSize: '1rem' }}>
                      {index < 3 && (
                        <TrophyFilled
                          style={{ fontSize: '1.525rem', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}
                        />
                      )}
                      <span className="text-3xl font-bold text-indigo-600">
                        {index + 1}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell sx={{ fontSize: '1rem' }}>
                      <div className="flex items-center w-fit">
                        <Avatar className="w-10 h-10 rounded-full border-2" src={getImageUrl(row.picture)} alt="Avatar" />
                        <div className="ml-2">
                          <p className="text-indigo-900 text-lg font-medium">{row.name}</p>
                        </div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell sx={{ textAlign: 'center', fontSize: '1rem' }}>
                      <p className="text-indigo-600 text-xl font-medium">{row.submitNumber}</p>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="px-6 py-4 w-[40%] border rounded-[10px] shadow-lg bg-white" style={{ maxHeight: '500px', minHeight: '500px', overflowY: 'auto' }}>
          <h2 className="text-indigo-900 text-2xl font-semibold mb-4 border-b pb-2">
            📂 ประวัติการอัปโหลด
          </h2>
          {projectHistory && projectHistory.length > 0 ? (
            projectHistory.map((item: any) => (
              <div key={item.createdAt} className="mb-4 border-b pb-4">
                <Link
                  to={`/workspaces/${workspaceId}/project/${projectId}/history/detail/${item.historyId}`}
                  className="block mt-4 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center mb-2">
                    <Avatar className="w-10 h-10 rounded-full border-2" src={getImageUrl(item.user.picture)} alt={item.user.name} />
                    <div className="ml-3">
                      <p className="text-indigo-900 text-lg font-medium">{item.user.name}</p>
                      <p className="text-gray-600 text-sm">
                        {formatDate(item.createdAt)} เวลา: {formatTime(item.createdAt)} น.
                      </p>
                    </div>
                  </div>
                  {inputType === 'วิดีโอ' ? (
                    <video className="w-28 h-28 border-2 object-cover rounded-md" src={item.filePath} controls />
                  ) : (
                    <img className="w-28 h-28 border-2 object-cover rounded-md" src={getImageUrl(item.filePath)} alt={item.user.name} loading="lazy" />
                  )}
                </Link>
              </div>
            ))
          ) : (
            <Typography className="text-center text-gray-600">ไม่มีประวัติการอัปโหลด</Typography>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 px-10 my-4">
        <div className="flex h-full items-center  bg-white shadow rounded-md m-2">
          <div className="w-2 h-full bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
          <div className="ml-4">
            <div className="py-4">
              <p className="text-gray-600">วันที่สร้าง</p>
              <span className="text-indigo-900 text-2xl font-bold">
                {formatDate(projectDetail.created_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="h-full flex items-center bg-white shadow rounded-md  m-2">
          <div className="w-2 h-full bg-indigo-600 rounded-tl-[15px] rounded-bl-[15px]" />
          <div className="ml-4">
            <div className="py-4">
              <p className="text-gray-600">วันที่อัปเดตล่าสุด</p>
              <span className="text-indigo-900 text-2xl font-bold">
                {formatDate(projectDetail.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
