import * as React from 'react';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import ProjectImage from '../card/ProjectLetterImage';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import { CameraOutlined, PictureOutlined, PlaySquareOutlined } from '@ant-design/icons';


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
  id: number;
  name: string;
  type: string;
  inputNumber: number;
  inputType: string;
  date: Date;
  image: string;
  uploader:string;
  avartar:string;
}

function createData(
  id: number,

  name: string,
  type: string,
  date: string,
  inputNumber: number,
  inputType: string,
  uploader: string,
  avartar:string,
  image: string,
): Data {
  return {
    id,
    image,
    name,
    type,
    date: new Date(date),
    inputNumber,
    inputType,
    uploader,
    avartar,
  };
}

const rows = [
  createData(1, 
    'IT 67 Project','Segmentation', '2023-06-02T11:30:00', 6,"รูปภาพ", "Kittinan Chalearnsong","/images/homeImage/kittnan.jpeg"
  ,  "",
  ),
  createData(2, 
    'Object Oriented 67','Segmentation',  '2023-06-02T09:15:00', 12,"รูปภาพ","Putthipong Chobngam","/images/homeImage/puttipong.jpg"
  ,  "",
  ),
  createData(3, 
    'Pet Detection','Object Detection',  '2023-06-03T10:45:00', 1,"วิดีโอ", "Putthipong Chobngam","/images/homeImage/puttipong.jpg"
  ,  "../../public/images/ai/627d124572023b6948b6cdff_60ed9a4e09e2c648f1b8a013_object-detection-cover.png",
  ),
  createData(4, 
    'Road Detection', 'Object Detection', '2023-06-04T11:30:00', 6,"รูปภาพ", "Putthipong Chobngam","/images/homeImage/puttipong.jpg"
  ,  "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
  createData(5, 
    'Road Detection','Object Detection',  '2023-06-05T12:00:00', 4,"รูปภาพ", "Kittinan Chalearnsong","/images/homeImage/kittnan.jpeg"
  ,  "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
  createData(6, 
    'Road Segmentation','Object Detection',  '2023-06-06T13:15:00', 3,"รูปภาพ","Putthipong Chobngam","/images/homeImage/puttipong.jpg"
  ,  "../../public/images/ai/images.jpg",
  ),
  createData(7, 
    'Road Detection','Object Detection',  '2023-06-07T14:00:00', 8,"รูปภาพ", "Kittinan Chalearnsong","/images/homeImage/kittnan.jpeg"
  ,  "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
  createData(8, 
    'Road Detection', 'Object Detection', '2023-06-08T15:30:00', 8,"รูปภาพ", "Kittinan Chalearnsong","/images/homeImage/kittnan.jpeg"
  ,  "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
  createData(9, 
    'Road Detection', 'Object Detection', '2023-06-09T16:00:00', 12,"รูปภาพ", "Kittinan Chalearnsong","/images/homeImage/kittnan.jpeg"
  ,  "",
  ),
  createData(10, 
    'Pet Detection', 'Object Detection', '2023-06-10T17:15:00', 14,"รูปภาพ", "Putthipong Chobngam","/images/homeImage/puttipong.jpg"
  ,  "../../public/images/ai/627d124572023b6948b6cdff_60ed9a4e09e2c648f1b8a013_object-detection-cover.png",
  ),
  createData(11, 
    'Road Detection', 'Object Detection', '2023-06-11T18:30:00', 12,"รูปภาพ", "Putthipong Chobngam","/images/homeImage/puttipong.jpg"
   , "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
  createData(12, 
    'Road Detection','Object Detection',  '2023-06-12T19:00:00', 9,"รูปภาพ", "Kittinan Chalearnsong","/images/homeImage/kittnan.jpeg"
  ,  "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
  createData(13, 
    'Road Detection','Object Detection',  '2023-06-13T20:15:00', 15,"รูปภาพ", "Putthipong Chobngam","/images/homeImage/puttipong.jpg"
   , "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
  ),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  sortable: boolean;
  colspan: number;
}

const headCells: readonly HeadCell[] = [
  // {
  //   id: 'image',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'รูป',
  //   sortable: false, // Make image column not sortable
  // },
  {
    id: 'name',
    numeric: true,
    disablePadding: true,
    label: 'ชื่อ Project',
    sortable: true,
    colspan:2,
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'วันที่',
    sortable: true,
    colspan:1,
  },
  {
    id: 'inputNumber',
    numeric: true,
    disablePadding: false,
    label: 'จำนวน',
    sortable: true,
    colspan:1,
  },
  {
    id: 'uploader',
    numeric: true,
    disablePadding: false,
    label: 'ผู้อัปโหลด',
    sortable: true,
    colspan:1,
  },
]

interface EnhancedTableProps {

  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <StyledTableRow>
        <StyledTableCell padding="checkbox" ></StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell 
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            colSpan={headCell.colspan}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}



interface EnhancedTableToolbarProps {
  searchItem: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterType: string;
  handleChangeFilterType: (e: SelectChangeEvent<string>) => void;
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  searchItem,
  handleInputChange,
  filterType,
  handleChangeFilterType
}) => {
  return (
    <Toolbar>
      <div className="grid grid-cols-3 w-full">
        <div className='col-span-2'>
        <TextField  sx={{width:'80%'}}id="outlined-basic" label="ค้นหาด้วยชื่อโปรเจค" variant="outlined"   value={searchItem}
          onChange={handleInputChange}/>
          </div>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter by Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterType}
            label="Filter by Type"
            onChange={handleChangeFilterType}
          >
            <MenuItem value="All">ทั้งหมด</MenuItem>
            <MenuItem value="Object Detection">Object Detection</MenuItem>
            <MenuItem value="Segmentation">Segmentation</MenuItem>
            <MenuItem value="Regression">Regression</MenuItem>
            <MenuItem value="Classification">Classification</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Toolbar>
  );
};


export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchItem, setSearchItem] = React.useState('');
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [filterType, setFilterType] = React.useState('All');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    applyFilters(searchTerm, filterType);
  };

  const handleChangeFilterType = (e: SelectChangeEvent<string>) => {
    const type = e.target.value;
    setFilterType(type);
    applyFilters(searchItem, type);
  };

  const applyFilters = (searchTerm: string, type: string) => {
    let filteredItems = rows;

    if (type !== 'All') {
      filteredItems = filteredItems.filter(row => row.type === type);
    }

    filteredItems = filteredItems.filter(row =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRows(filteredItems);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

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
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          searchItem={searchItem}
          handleInputChange={handleInputChange}
          filterType={filterType}
          handleChangeFilterType={handleChangeFilterType}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}  >

                      <StyledTableCell padding="checkbox"></StyledTableCell>
                      <StyledTableCell component="th" id={labelId} scope="row" padding="none">
                        {row.image ? (
                          <img
                            className="m-2 w-[124px] h-[124px] rounded-[10px] mx-auto"
                            src={row.image}
                          />
                        ) : (
                          <ProjectImage
                            projectName={row.name}
                            className="m-2 w-[124px] h-[124px] rounded-[10px] mx-auto border-2 flex items-center justify-center text-white font-medium text-xl"
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="mx-auto my-2 w-fit">
                          <p className="text-indigo-900 text-lg font-medium">{row.name}</p>
                        </div>
                        {row.type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="mx-auto my-2 w-fit">
                          <p className="text-black text-lg font-medium">
                            {formatTime(row.date)} น.
                          </p>
                        </div>
                        <div className="mx-auto w-fit">
                          <p className="text-black font-normal"> {formatDate(row.date)}</p>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="left" >
                          {/* <div className='bg-red-100'> */}
                          {row.inputType === "วิดีโอ"  ? ( <PlaySquareOutlined style={{ color: "black", fontSize: "1.525rem" , }}/>
                        ):(<CameraOutlined style={{ color: "black", fontSize: "1.525rem" ,}}/>)}
                        <span className='text-black text-lg font-medium'>{" "}{row.inputNumber}</span>
                        <span className='font-normal text'> {row.inputType}</span>
                          {/* </div> */}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="mx-auto flex items-center my-4 w-fit">
                          <img
                            className="w-10 h-10 rounded-full border-2"
                            src={row.avartar}
                          />
                          <div className="ml-2">
                            <p className="text-black text-lg font-normal">{row.uploader}</p>
                          </div>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <StyledTableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <StyledTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}