import React, { useState } from 'react';
import {
    Table, TableHead, TableBody, TableRow, TableCell, TableSortLabel, Paper, TableContainer,
    Button
} from '@mui/material';

interface Data {
    name: string;
    age: number;
    email: string;
    date: Date;
}

function createData(name: string, age: number, email: string ,date: string,): Data {
    return { name, age, email , date: new Date(date), };
}

const initialRows = [
    createData('John Doe', 25, 'john@example.com', '2023-06-02T11:30:00'),
    createData('Jane Smith', 42, 'jane@example.com', '2023-06-02T11:30:00'),
    createData('Alice Johnson', 30, 'alice@example.com', '2023-06-02T11:30:00'),
];

type Order = 'asc' | 'desc';

const SortableTable: React.FC = () => {
    const [rows, setRows] = useState<Data[]>(initialRows);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('name');

    const handleRequestSort = (property: keyof Data) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleAccept = (index: number) => {
        setRows(prevRows => prevRows.filter((_, i) => i !== index));
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
    

    

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={() => handleRequestSort('name')}
                            >
                                ชื่อผู้ขอใช้งาน
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'age'}
                                direction={orderBy === 'age' ? order : 'asc'}
                                onClick={() => handleRequestSort('age')}
                            >
                                ชื่อ AI
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'email'}
                                direction={orderBy === 'email' ? order : 'asc'}
                                onClick={() => handleRequestSort('email')}
                            >
                                ประเภท AI
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'date'}
                                direction={orderBy === 'date' ? order : 'asc'}
                                onClick={() => handleRequestSort('date')}
                            >
                                ถูกขอใช้งานเมื่อ
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align={'center'}>
                            <TableSortLabel
                                active={orderBy === 'date'}

                                direction={orderBy === 'date' ? order : 'asc'}
                                onClick={() => handleRequestSort('date')}
                            >
                                สถานะ
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.age}</TableCell>
                            <TableCell>{row.email}</TableCell>
                             <TableCell>{row.date.toLocaleString()}</TableCell>
                             <TableCell>  <div className='mx-auto flex justify-center'>
                                
                                <Button onClick={() => handleAccept(index)} variant="contained" color="success"     style={{ marginRight: '8px' }} >ยอมรับ</Button> <Button variant="outlined" color="error">ปฎิเสธ</Button>
                                </div>
                                </TableCell> 
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SortableTable;