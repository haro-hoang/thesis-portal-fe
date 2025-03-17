'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import { createRole, deleteRole, getRoles, updateRole } from '@/services/roles/roleService';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Paper, Switch, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';

interface Role {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [total, setTotal] = useState(0);

    // declare for handle popup
    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });
    // end handle popup

    useEffect(() => {
        fetchRoles();
    }, [paginationModel]);

    const fetchRoles = async () => {
        try {
            setIsLoading(true);
            const result = await getRoles({
                page: paginationModel.page,
                pageSize: paginationModel.pageSize
            });
            setRoles(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteRole(id);
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateRole(id, { isActive: !currentStatus });
            fetchRoles();
        } catch (error) {
            console.error('Error updating role status:', error);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Role Name',
            flex: 1,
            minWidth: 130
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 200
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
                <button
                    onClick={() => toggleStatus(params.id as string, params.row.isActive as boolean)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${params.row.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                >
                    {params.row.isActive ? 'Active' : 'Inactive'}
                </button>
            ),
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDelete(params.id as string)}
                        className="p-2 text-red-600 hover:text-red-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    // handle popup
    const handleOpen = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description,
                isActive: role.isActive
            });
        } else {
            setEditingRole(null);
            setFormData({
                name: '',
                description: '',
                isActive: true
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRole(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await updateRole(editingRole.id, formData);
            } else {
                await createRole(formData);
            }
            handleClose();
            fetchRoles();
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };
    // end handle popup
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Roles Management</h1>
            </div>
            <div className="flex justify-end mb-2">
                <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                    <Add /><span className='mr-2'>Add New Role</span>
                </Button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                    {isLoading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : (
                        <Paper sx={{ minHeight: 500, width: '100%' }}>
                            <DataGrid
                                rows={roles}
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
                                        backgroundColor: 'rgb(249 250 251)', // bg-gray-50
                                        textTransform: 'uppercase',
                                        '& .MuiDataGrid-columnHeader': {
                                            color: 'white', // text-gray-500
                                            fontSize: '0.75rem', // text-xs
                                            fontWeight: 500, // font-medium
                                            padding: '0.75rem 1.5rem', // px-6 py-3
                                            '& .MuiDataGrid-columnHeaderTitle': {
                                                fontWeight: 500,
                                            },
                                            backgroundColor: '#22a6b3',
                                        }
                                    },
                                    '& .MuiDataGrid-cell': {
                                        paddingLeft: '1.5rem', // px-6 py-3
                                        fontSize: '0.875rem', // text-sm
                                        '&:focus': {
                                            outline: 'none',
                                        }
                                    },
                                    '& .MuiDataGrid-row': {
                                        '&:hover': {
                                            backgroundColor: 'rgb(249 250 251)', // bg-gray-50
                                        }
                                    }
                                }}
                            />
                        </Paper>
                    )}
                </Suspense>
            </div>
            <Dialog open={open} 
                onClose={handleClose} 
                maxWidth="sm" 
                fullWidth 
                disableEscapeKeyDown
                >
                <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Role Name"
                            type="text"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingRole ? 'Save' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}