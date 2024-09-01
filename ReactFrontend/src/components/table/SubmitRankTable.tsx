import React, {  useState } from 'react';import { styled } from '@mui/material/styles';
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



interface UploadPicture {
  img: string;
  title: string;
  author: string;
  rows?: number;
  cols?: number;
  featured?: boolean;
}

interface UploadData {
  dateTime: string;
  uploadPicture: UploadPicture[];
}

interface UserUpload {
  UserRank: number;
  UploadData: UploadData[];
}







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
    '&:hover': {
      backgroundColor: theme.palette.action.selected, 
      cursor: 'pointer',
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


  const [showSubmit,setShowSubmit] = useState(false);
  const [filteredUser, setFilteredUser] = useState<UserUpload | null>(null);
  const handleShowSubmit = (row :number) => {
    const filtered = UploadedImage.filter(user => user.UserRank === row);
    console.log(row)
      setFilteredUser(filtered[0]); 
    setShowSubmit(true); // แสดงข้อมูล
  };



    const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className=" w-full   mx-auto flex">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>อันดับ</StyledTableCell>
              <StyledTableCell>ชื่อ </StyledTableCell>
              <StyledTableCell align="center">
                จำนวนการประมวลผล (ภาพ)
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.rank}     onClick={() => handleShowSubmit(row.rank)}>
                <StyledTableCell component="th" scope="row">
                  <span
                    className={`text-3xl font-bold ${
                      row.rank <= 3 ? "text-indigo-600" : ""
                    }`}
                  >
                    {" "}
                    {row.rank}
                  </span>
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
                      <p className="text-indigo-900 text-lg font-medium">
                        {row.name}
                      </p>
                    </div>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <p className="text-black text-xl font-medium">
                    {row.submitNumber}
                  </p>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
{/*  */}
  {showSubmit && filteredUser && (
    
              
      <ImageList sx={{ width: 500, height: 450 }}>
        <div className="flex items-center w-fit st sticky top-0 bg-white z-10">
                <img
                  className="w-10 h-10 rounded-full  border-2"
                  src={rows[0].avartar}
                />
                <div className="ml-2">
                  <p className="text-indigo-900 text-lg font-medium">
                    {rows[0].name}
                  </p>
                </div>
              </div>
          {filteredUser.UploadData.map((data) => (
            <>
              <ImageListItem key={`subheader-${data.dateTime}`} cols={2}>
                <ListSubheader component="div">{formatDate(new Date(data.dateTime))} </ListSubheader>
                <ListSubheader component="div"> {formatTime(new Date(data.dateTime))}</ListSubheader>
              </ImageListItem>

              {data.uploadPicture.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.title}
                    position="below"
                  />
                </ImageListItem>
              ))}
            </>
          ))
        }
      </ImageList>
   
      )}
    </div>
  );
}
