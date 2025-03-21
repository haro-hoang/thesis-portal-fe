'use client';
import { buildFilterQuery } from "@/app/commons/buildFilterQuery";
import { Student } from "@/services/students/@/types/student";
import { getStudents } from "@/services/students/studentService";
import { Paper } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function StudentsPage() {
  const { t } = useTranslation();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [filterQuery, setFilterQuery] = useState<string>('');

  useEffect(() => {
    fetchStudents();
  }, [paginationModel, filterQuery]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const result = await getStudents({
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        search: filterQuery
      });
      setStudents(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    const fetchFilteredStudents = async () => {
      try {
        setIsLoading(true);
        const query = await buildFilterQuery(filterModel);
        setFilterQuery(query);
        console.log('Filter query:', query);
        const result = await getStudents({
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          search: query // Use the query directly instead of filterQuery state
        });
        setStudents(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching filtered students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilteredStudents();
  }, [paginationModel]);

  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: t('students.fullName'),
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'dateOfBirth',
      headerName: t('students.dateOfBirth'),
      flex: 1,
      minWidth: 130,
      // Format the date (assuming ISO string format)
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      field: 'gender',
      headerName: t('students.gender'),
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'phoneNumber',
      headerName: t('students.phone'),
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'email',
      headerName: t('students.email'),
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'className',
      headerName: t('students.class'),
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'programName',
      headerName: t('students.program'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'programCode',
      headerName: 'Program Code',
      flex: 0.8,
      minWidth: 130,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('students.overview')}</h1>
      <Paper sx={{ maxHeight: '75vh', width: '100%', overflow: 'auto' }}>
        <Suspense fallback={<div className="p-4 text-center">{t('common.loading')}</div>}>
          <DataGrid
            rows={students}
            columns={columns}
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50]}
            paginationMode="server"
            loading={isLoading}
            filterMode="server"
            onFilterModelChange={onFilterChange}
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
        </Suspense>
      </Paper>
    </div>
  );
}