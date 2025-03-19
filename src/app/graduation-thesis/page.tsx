'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    IconButton,
    CircularProgress,
    Autocomplete,
    FormControl,
    FormHelperText,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Padding
} from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { GraduationThesis } from '@/services/graduation-thesis/@/types/graduation-thesis';
import { getTeachers } from '@/services/teachers/teacherService';
import { createThesis, deleteThesis, getTheses, updateThesis } from '@/services/graduation-thesis/graduationThesisService';
import DialogGraduationThesis from './dialog-graduation-thesis';
import { Student } from '@/services/students/@/types/student';
import { ThesisStatus } from '@/services/graduation-thesis/@/types/thesis-status.enum';


export default function GraduationThesisPage() {
    // Table states
    const [theses, setTheses] = useState<GraduationThesis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedThesis, setSelectedThesis] = useState<GraduationThesis | null>(null);

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [thesisToDelete, setThesisToDelete] = useState<string | null>(null);

    // Teachers for select
    const [teachers, setTeachers] = useState<any[]>([]);

    const getStatusChipProps = (status: string) => {
        const statusConfig = {
            "DaPheDuyet": { color: 'primary', icon: '✓' },
            "DangThucHien": { color: 'info', icon: '🔄' },
            "DeNghiChinhSua": { color: 'warning', icon: '✎' },
            "DaChinhSua": { color: 'success', icon: '✓' },
            "DeNghiGiaHan": { color: 'warning', icon: '⏰' },
            "DaGiaHan": { color: 'info', icon: '⌛' },
            "DaNop": { color: 'success', icon: '📄' },
            "DaKiemTraTrungLap": { color: 'info', icon: '🔍' },
            "DatYeuCauTrungLap": { color: 'success', icon: '✓' },
            "KhongDatYeuCauTrungLap": { color: 'error', icon: '✕' },
            "ChoPhanBien": { color: 'warning', icon: '⏳' },
            "DaPhanBien": { color: 'success', icon: '📝' },
            "GVHDDongYChoBaoVe": { color: 'success', icon: '👍' },
            "ChoBaoVe": { color: 'warning', icon: '⌛' },
            "DaBaoVe": { color: 'info', icon: '🎯' },
            "BaoVeThanhCong": { color: 'success', icon: '🏆' },
            "BaoVeThatBai": { color: 'error', icon: '❌' },
            "DeNghiChinhSuaSauBaoVe": { color: 'warning', icon: '📝' },
            "DaNopBanSua": { color: 'info', icon: '📄' },
            "DaHoanThanh": { color: 'success', icon: '🎉' },
            "BiDinhChi": { color: 'error', icon: '⛔' },
            "RutLui": { color: 'error', icon: '🚫' },
            "ChoBaoVeBoSung": { color: 'warning', icon: '⏳' },
            "DaBaoVeBoSung": { color: 'info', icon: '🎯' },
            "BaoVeBoSungThanhCong": { color: 'success', icon: '🏆' },
            "BaoVeBoSungThatBai": { color: 'error', icon: '❌' },
            "ChoPhucKhao": { color: 'warning', icon: '⏳' },
            "DaPhucKhao": { color: 'info', icon: '✓' },
        } as const;

        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', icon: '❔' };

        return {
            color: config.color,
            icon: config.icon,
            label: status,
        };
    };

    useEffect(() => {
        fetchTheses();
        fetchTeachers();
    }, [page, rowsPerPage]);

    const fetchTeachers = async () => {
        try {
            const result = await getTeachers({ page: 0, pageSize: 1000 });
            setTeachers(result.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setPage(0);
            fetchTheses(query);
        }, 500),
        []
    );


    const fetchTheses = async (search?: string) => {
        try {
            setIsLoading(true);
            const result = await getTheses({
                page,
                pageSize: rowsPerPage,
                search: search || searchQuery
            });
            setTheses(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching theses:', error);
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

    const handleOpenDialog = (mode: 'add' | 'edit', thesis?: GraduationThesis) => {
        setDialogMode(mode);
        setSelectedThesis(thesis || null);
        setOpenDialog(true);
        if (mode === 'add') {
            setSelectedThesis(null);
        }
    };

    const handleSubmitDialog = async (formData: any) => {
        try {
            if (dialogMode === 'add') {
                await createThesis(formData);
            } else if (selectedThesis) {
                await updateThesis(selectedThesis.id, formData);
            }
            setOpenDialog(false);
            fetchTheses();
        } catch (error) {
            console.error('Error saving thesis:', error);
        }
    };

    const handleDeleteClick = (id: string) => {
        setThesisToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!thesisToDelete) return;

        try {
            await deleteThesis(thesisToDelete);
            setDeleteDialogOpen(false);
            fetchTheses();
        } catch (error) {
            console.error('Error deleting thesis:', error);
        }
    };

    const headerCellStyle = {
        backgroundColor: '#22a6b3',
        color: 'white',
        fontWeight: 500,
        padding: '0.75rem 1.5rem',
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Graduation Thesis Management</h1>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('add')}
                >
                    Add New Thesis
                </Button>
            </div>

            <div className="mb-4">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search theses..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '75vh' }}>
                    <Table stickyHeader aria-label="graduation thesis table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={headerCellStyle}>Title</TableCell>
                                <TableCell sx={headerCellStyle}>Description</TableCell>
                                <TableCell sx={headerCellStyle}>Lecturer</TableCell>
                                <TableCell sx={headerCellStyle}>Students</TableCell>
                                <TableCell sx={headerCellStyle}>Created At</TableCell>
                                <TableCell sx={headerCellStyle}>Status</TableCell>
                                <TableCell sx={headerCellStyle}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ height: '400px' }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : theses && theses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ height: '400px' }}>
                                        No theses found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                theses && theses.length > 0 && theses.map((thesis) => (
                                    <TableRow
                                        key={thesis.id}
                                        hover
                                        sx={{
                                            '&:hover': { backgroundColor: 'rgb(249 250 251)' },
                                            '& td': { padding: '0.75rem 1.5rem' }
                                        }}
                                    >
                                        <TableCell>{thesis.title}</TableCell>
                                        <TableCell>{thesis.description}</TableCell>
                                        <TableCell>{thesis.lecturer?.fullName}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                {thesis.students?.map(({ student }, index) => (
                                                    <div key={student.id}
                                                        className={`text-sm p-2 rounded-md ${index % 2 === 0
                                                            ? 'bg-blue-50 border-l-4 border-blue-400'
                                                            : 'bg-green-50 border-l-4 border-green-400'
                                                            }`}
                                                    >
                                                        {student.fullName} - {student.email}
                                                        <div className="text-xs text-gray-500">
                                                            {student.className} - {student.programName}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(thesis.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {thesis.status && (
                                                <Chip
                                                    color={getStatusChipProps(thesis.status).color}
                                                    label={
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            {getStatusChipProps(thesis.status).icon} {ThesisStatus[thesis.status as keyof typeof ThesisStatus]}
                                                        </span>
                                                    }
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenDialog('edit', thesis)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteClick(thesis.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
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

            <DialogGraduationThesis
                open={openDialog}
                mode={dialogMode}
                thesis={selectedThesis}
                teachers={teachers}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleSubmitDialog}
            />
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this thesis? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}