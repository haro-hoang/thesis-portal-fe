'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Paper,
    Snackbar,
    Switch,
    TextField,
    Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Close as CloseIcon } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import { createUser, deleteUser, getUsers, updateToggleStatus, updateUser } from '@/services/users/userService';
import { getRoles } from '@/services/roles/roleService';
import { User, Role } from '@/services/users/@/types/user';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [total, setTotal] = useState(0);

    // state for dialog (add/edit)
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        isActive: true,
        roles: [] as Role[]
    });

    // state for delete confirmation
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // available roles for assigning to user
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

    useEffect(() => {
        fetchUsers();
        fetchAvailableRoles();
    }, [paginationModel]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const result = await getUsers({
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
            });
            const transformedUsers = result.data.map((user: any) => ({
                ...user,
                roles: user.roles ? user.roles.map((r: any) => r.role) : [],
            }));
            setUsers(transformedUsers);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableRoles = async () => {
        try {
            const roles = await getRoles({ page: 0, pageSize: 100 });
            setAvailableRoles(roles.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // dialog handlers
    const handleOpen = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                password: '',
                email: user.email,
                fullName: user.fullName,
                isActive: user.isActive,
                roles: user.roles || []
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password: '',
                email: '',
                fullName: '',
                isActive: true,
                roles: []
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser.id, {
                    ...formData,
                    roleIds: formData.roles.map(role => role.id)
                });
            } else {
                await createUser({
                    ...formData,
                    roleIds: formData.roles.map(role => role.id)
                });
            }
            handleClose();
            fetchUsers();
            setSnackbar({
                open: true,
                message: editingUser ? 'User updated successfully' : 'User created successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error saving user:', error);
            setSnackbar({
                open: true,
                message: 'Error saving user',
                severity: 'error'
            });
        }
    };

    // delete confirmation handlers
    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        try {
            await deleteUser(deletingId);
            setSnackbar({
                open: true,
                message: 'User deleted successfully',
                severity: 'success'
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setSnackbar({
                open: true,
                message: 'Error deleting user',
                severity: 'error'
            });
        } finally {
            setDeleteConfirmOpen(false);
            setDeletingId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setDeletingId(null);
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateToggleStatus(id, !currentStatus).then(() => {
                fetchUsers();
            });

        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'username',
            headerName: 'Username',
            flex: 1,
            minWidth: 130
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1.5,
            minWidth: 200
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 1.5,
            minWidth: 200
        },
        {
            field: 'roles',
            headerName: 'Roles',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <div className="flex flex-wrap gap-1 items-center">
                    <div sx={{ display: 'flex', gap: 1 }}>
                        {params.row.roles && params.row.roles.map((role: Role) => (
                            <span key={role.id} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 ml-1">
                                {role.name}
                            </span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={params.row.isActive}
                            onChange={() => toggleStatus(params.id as string, params.row.isActive)}
                            color="primary"
                        />
                    }
                    label={params.row.isActive ? 'Active' : 'Inactive'}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.8,
            minWidth: 100,
            sortable: false,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpen(params.row)}
                        className="p-2 text-amber-600 hover:text-amber-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDeleteClick(params.id as string)}
                        className="p-2 text-red-600 hover:text-red-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Users Management</h1>
            </div>
            <div className="flex justify-end mb-2">
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    <Add /><span className="mr-2">Add New User</span>
                </Button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                    {isLoading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : (
                        <Paper sx={{ minHeight: 500, width: '100%' }}>
                            <DataGrid
                                rows={users}
                                columns={columns}
                                rowCount={total}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[5, 10, 25]}
                                paginationMode="server"
                                loading={isLoading}
                                sx={{
                                    border: 0,
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: 'rgb(249 250 251)',
                                        textTransform: 'uppercase',
                                        '& .MuiDataGrid-columnHeader': {
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            padding: '0.75rem 1.5rem',
                                            '& .MuiDataGrid-columnHeaderTitle': {
                                                fontWeight: 500,
                                            },
                                            backgroundColor: '#22a6b3',
                                        }
                                    },
                                    '& .MuiDataGrid-cell': {
                                        paddingLeft: '1.5rem',
                                        fontSize: '0.875rem',
                                        '&:focus': {
                                            outline: 'none',
                                        }
                                    },
                                    '& .MuiDataGrid-row': {
                                        '&:hover': {
                                            backgroundColor: 'rgb(249 250 251)',
                                        }
                                    }
                                }}
                            />
                        </Paper>
                    )}
                </Suspense>
            </div>

            {/* Dialog for Add/Edit User */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                disableEscapeKeyDown
                onBackdropClick={() => { }}
            >
                <DialogTitle>
                    {editingUser ? 'Edit User' : 'Add New User'}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Username"
                            type="text"
                            fullWidth
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                        {!editingUser && (
                            <TextField
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        )}
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Full Name"
                            type="text"
                            fullWidth
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                            }
                            label="Active"
                        />
                        <Autocomplete
                            multiple
                            options={availableRoles}
                            getOptionLabel={(option) => option.name}
                            value={formData.roles}
                            onChange={(_event, newValue) => setFormData({ ...formData, roles: newValue })}
                            renderInput={(params) => (
                                <TextField {...params} margin="dense" label="Roles" placeholder="Select Roles" />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingUser ? 'Save' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}