'use client';

import { useState, useEffect, useCallback } from 'react';
import { CircularProgress, debounce, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { getTeachers } from '@/services/teachers/teacherService';
import { Teacher } from '@/services/teachers/@/types/teacher';
import SearchIcon from '@mui/icons-material/Search';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const headerCellStyle = {
        backgroundColor: '#22a6b3',
        color: 'white',
        fontWeight: 500,
        padding: '0.75rem 1.5rem',
    };
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setPage(0); // Reset to first page when searching
            fetchTeachers(query);
        }, 500),
        []
    );


    useEffect(() => {
        fetchTeachers();
    }, [page, rowsPerPage]);

    const fetchTeachers = async (search?: string) => {
        try {
            setIsLoading(true);
            const result = await getTeachers({
                page: page,
                pageSize: rowsPerPage,
                search: search || searchQuery
            });
            setTeachers(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (

        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Teachers Overview</h1>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <div className="mb-4">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search teachers..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: 'white',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#e2e8f0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#cbd5e1',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#22a6b3',
                                },
                            },
                        }}
                    />
                </div>

                <TableContainer sx={{ maxHeight: '70vh' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {[
                                    'Username',
                                    'Full Name',
                                    'Email',
                                    // 'Phone',
                                    'Department',
                                    'Dept. Code',
                                    // 'Role'
                                ].map((header) => (
                                    <TableCell
                                        key={header}
                                        sx={headerCellStyle}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{ height: '400px' }}
                                    >
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (

                                teachers.map((teacher) => (

                                    <TableRow
                                        key={teacher.id}
                                        hover
                                        sx={
                                            { '&:hover': { backgroundColor: 'rgb(249 250 251)' } }
                                        }
                                    >
                                        <TableCell>{teacher.userName}</TableCell>
                                        <TableCell>{teacher.fullName}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        {/* <TableCell>{teacher.phoneNumber}</TableCell> */}
                                        <TableCell>{teacher.departmentName}</TableCell>
                                        <TableCell>{teacher.departmentCode}</TableCell>
                                        {/* <TableCell>{teacher.roleCode}</TableCell> */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}