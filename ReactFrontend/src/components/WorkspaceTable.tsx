import * as React from 'react';
import { styled } from '@mui/material/styles';
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
  uploader: number;
}

function createData(
  id: number,
  image: string,
  name: string,
  type: string,
  date: string,
  inputNumber: number,
  inputType: string,
  uploader: number,
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
  };
}

const rows = [
  createData(1, 
    "../../public/images/ai/627d124572023b6948b6cdff_60ed9a4e09e2c648f1b8a013_object-detection-cover.png",
    'Pet AI','object detection', '2023-06-02T11:30:00', 6,"รูปภาพ", 4.3),
  createData(2, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Donut','object detection',  '2023-06-02T09:15:00', 12,"รูปภาพ", 4.9),
  createData(3, 
    "../../public/images/ai/627d124572023b6948b6cdff_60ed9a4e09e2c648f1b8a013_object-detection-cover.png",
    'Pet AI','object detection',  '2023-06-03T10:45:00', 1,"วิดีโอ", 6.0),
  createData(4, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Frozen yoghurt', 'object detection', '2023-06-04T11:30:00', 6,"รูปภาพ", 4.0),
  createData(5, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Gingerbread','object detection',  '2023-06-05T12:00:00', 4,"รูปภาพ", 3.9),
  createData(6, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Honeycomb','object detection',  '2023-06-06T13:15:00', 3,"รูปภาพ", 6.5),
  createData(7, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Ice cream sandwich','object detection',  '2023-06-07T14:00:00', 8,"รูปภาพ", 4.3),
  createData(8, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Jelly Bean', 'object detection', '2023-06-08T15:30:00', 8,"รูปภาพ", 0.0),
  createData(9, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'KitKat', 'object detection', '2023-06-09T16:00:00', 12,"รูปภาพ", 7.0),
  createData(10, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Lollipop', 'object detection', '2023-06-10T17:15:00', 14,"รูปภาพ", 0.0),
  createData(11, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Marshmallow', 'object detection', '2023-06-11T18:30:00', 12,"รูปภาพ", 2.0),
  createData(12, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Nougat','object detection',  '2023-06-12T19:00:00', 9,"รูปภาพ", 37.0),
  createData(13, 
    "../../public/images/ai/Object-detection-Real-world-applications-and-benefits.png",
    'Oreo','object detection',  '2023-06-13T20:15:00', 15,"รูปภาพ", 4.0),
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
  sortable: boolean; // Add this line
}

const headCells: readonly HeadCell[] = [
  {
    id: 'image',
    numeric: true,
    disablePadding: false,
    label: 'รูป',
    sortable: false, // Make image column not sortable
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: true,
    label: 'ชื่อ AI',
    sortable: true,
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'วันที่',
    sortable: true,
  },
  {
    id: 'inputNumber',
    numeric: true,
    disablePadding: false,
    label: 'จำนวน',
    sortable: true,
  },
  {
    id: 'uploader',
    numeric: true,
    disablePadding: false,
    label: 'ผู้อัปโหลด',
    sortable: true,
  },
]

interface EnhancedTableProps {
  numSelected: number;
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
        <StyledTableCell padding="checkbox"></StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
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




export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <StyledTableCell padding="checkbox"></StyledTableCell>
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <img
            className="m-2 w-[124px] h-[124px] rounded-[10px] mx-auto "
            src={row.image}
            />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    <div className="mx-auto  my-2 w-fit ">
                      {row.name}
                      </div>
                      {row.type}
                    </StyledTableCell>
                    <StyledTableCell align="center">  
                      <div className="mx-auto  my-2 w-fit ">
                      {formatTime(row.date)} น.
                      </div> 
                      <div className="mx-auto  my-2 w-fit ">
                        {formatDate(row.date)}
                      </div>
                    
    
                      </StyledTableCell>
                    <StyledTableCell align="center">{row.inputNumber} {row.inputType}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="mx-auto flex items-center my-4 w-fit ">
                        <img 
                        className="w-10 h-10 rounded-full border-2 bg-red-200 " 
                        src="/images/homeImage/puttipong.jpg"
                        />
                        <div className="ml-2">
                        <p className="text-black text-lg font-normal">putthipong Chobngam</p>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </Box>
  );
}