
import React, { useEffect, useState } from 'react'; import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TrophyFilled } from '@ant-design/icons';
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader } from '@mui/material';
import UploadedImage from '../../data/UploadedImage';
import formatDate from '../../function/formatDate';
import formatTime from '../../function/formatTime';
import { useParams } from 'react-router-dom';
import HistoryUploadSection from '../../components/HistoryUploadSection';
import { useFetchQuery } from "../../hook/useFetchQuery";

interface UploadPicture {
  img: string;
  title: string;
  author: string;
  RankingMemberData?: number;
  cols?: number;
  featured?: boolean;
}

interface UploadData {
  createdAt: string;
  uploadPicture: UploadPicture[];
}

interface UserUpload {
  UserRank: number;
  UploadData: UploadData[];
}

export interface RankingData {
  userId: string;
  submitNumber: number;
  name: string;
  picture: string;
}

interface UploadHistory {
  createdAt: string;
  uploader: string;
  avatar: string;
  filePath: string;
  userName: string;   // เพิ่มชื่อผู้ใช้
  userPicture: string;  // เพิ่มรูปโปรไฟล์ของผู้ใช้
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: '#312e81',  // สี text-indigo-900 ใน TailwindCSS
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

) {
  return { rank, name, avartar, submitNumber, };
}

const RankingMemberData = [
  createData(1, 'Frozen yoghurt', "/images/homeImage/puttipong.jpg", 85,),
  createData(2, 'Ice cream sandwich', "/images/homeImage/kittnan.jpeg", 70,),
  createData(3, 'Eclair', "/images/homeImage/profile.webp", 14,),
  createData(4, 'Cupcake', "/images/homeImage/profile.webp", 14,),
  createData(5, 'Gingerbread', "/images/homeImage/profile.webp", 12,),
];


export default function SubmitRankTable() {


  // const [showSubmit,setShowSubmit] = useState(false);

  const [filteredUser, setFilteredUser] = useState<UserUpload | null>(null); // ค่าเริ่มต้นเป็น null
  const [selectedRow, setSelectedRow] = useState<number>(1); // ค่าเริ่มต้นเป็นแถวแรก (row 1)
  const { workspaceId } = useParams<{ workspaceId: string }>();  // ดึง projectId จาก URL
  const { projectId } = useParams<{ projectId: string }>();  // ดึง projectId จาก URL
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/${projectId}/ranking`);
        if (response.ok) {
          const data: RankingData[] = await response.json();
          setRankingData(data);
        } else {
          console.error('Failed to fetch ranking data');
        }
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      }
    };

    fetchRankingData();
  }, [projectId]);

  // ดึงข้อมูลประวัติการอัปโหลด
  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_NEST_BACKEND_API_URL}/workspaces/${workspaceId}/projects/all-history/${projectId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          const mappedData: UploadHistory[] = data.map((item: any) => ({
            createdAt: item.createdAt,
            filePath: item.filePath,
            userName: item.user.name,  // ดึงชื่อผู้ใช้จาก user
            userPicture: item.user.picture,  // ดึงรูปโปรไฟล์จาก user
          }));
          setUploadHistory(mappedData);
        } else {
          console.error('Failed to fetch upload history');
        }
      } catch (error) {
        console.error("Error fetching upload history:", error);
      }
    };

    fetchUploadHistory();
  }, [workspaceId, projectId]);


  return (
    <div className="w-full mx-auto flex">
      <div className='mx-4 px-4 w-[60%]'>
        <TableContainer component={Paper}>
          <Table sx={{ width: '100%' }} aria-label="customized table">
            <TableHead>
              <TableRow >
                <StyledTableCell>อันดับ</StyledTableCell>
                <StyledTableCell>ชื่อ</StyledTableCell>
                <StyledTableCell align="center">
                  จำนวนการประมวลผล (ภาพ)
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankingData.map((row, index) => (
                <StyledTableRow key={row.userId}>
                  <StyledTableCell component="th" scope="row">
                    <span className={`text-3xl font-bold ${index < 3 ? "text-indigo-600" : ""}`}>
                      {index + 1}
                    </span>
                    {index < 3 && (
                      <TrophyFilled
                        style={{
                          fontSize: "1.525rem",
                          color: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                        }}
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex items-center w-fit">
                      <img className="w-10 h-10 rounded-full border-2" src={row.avatar} alt="Avatar" />
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

      {/* ประวัติการอัปโหลดเรียงลงมาเรื่อย ๆ */}
      <div
        className='px-4 border rounded-[5px] w-[40%] overflow-y-auto'
        style={{ maxHeight: '600px' }}
      >
        <h2 className="text-indigo-900 text-2xl font-semibold mb-4">ประวัติการอัปโหลด</h2>

        {uploadHistory.map((data) => (
          <div key={data.createdAt} className="mb-4 border-b pb-4">
            <div className="flex items-center mb-2">
              <img
                className="w-10 h-10 rounded-full border-2"
                src={data.userPicture}
                alt={data.userName}
              />
              <div className="ml-3">
                <p className="text-indigo-900 text-lg font-medium">{data.userName}</p>
                <p className="text-gray-600 text-sm">{formatDate(new Date(data.createdAt))} เวลา: {formatTime(new Date(data.createdAt))} น.</p>
              </div>
            </div>
            <img
              className="w-28 h-28 mr-6 border-2 object-cover"
              src={`${data.filePath}`}
              alt={data.userName}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}