'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getThesisProgressLogs, createProgressLog, updateProgressLog, deleteProgressLog } from '@/services/thesis-progress/thesis-progress.service';
import { ThesisProgressLog } from '@/services/thesis-progress/types';
import { formatDate } from '@/utils/date';

interface ProgressTrackingProps {
  thesisId: string;
}

export default function ProgressTracking({ thesisId }: ProgressTrackingProps) {
  const { t } = useTranslation();
  const [progressLogs, setProgressLogs] = useState<ThesisProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLog, setCurrentLog] = useState<Partial<ThesisProgressLog>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProgressLogs();
  }, [thesisId]);

  const fetchProgressLogs = async () => {
    try {
      setLoading(true);
      const data = await getThesisProgressLogs(thesisId);
      setProgressLogs(data);
    } catch (error) {
      console.error('Error fetching progress logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (log?: ThesisProgressLog) => {
    if (log) {
      setCurrentLog(log);
      setIsEditing(true);
    } else {
      setCurrentLog({ thesisId, weekNumber: 1, workDone: '', checkDate: new Date(), results: '', teacherComment: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentLog({});
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentLog(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setCurrentLog(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (isEditing && currentLog.id) {
        await updateProgressLog(currentLog.id, currentLog);
      } else {
        await createProgressLog(currentLog as Omit<ThesisProgressLog, 'id' | 'createdAt' | 'updatedAt'>);
      }
      handleCloseDialog();
      fetchProgressLogs();
    } catch (error) {
      console.error('Error saving progress log:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('progress.confirmDelete'))) {
      try {
        await deleteProgressLog(id);
        fetchProgressLogs();
      } catch (error) {
        console.error('Error deleting progress log:', error);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('progress.trackingTitle')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('progress.addLog')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('progress.weekNumber')}</TableCell>
              <TableCell>{t('progress.checkDate')}</TableCell>
              <TableCell>{t('progress.workDone')}</TableCell>
              <TableCell>{t('progress.results')}</TableCell>
              <TableCell>{t('progress.teacherComment')}</TableCell>
              <TableCell align="center">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">{t('common.loading')}</TableCell>
              </TableRow>
            ) : progressLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">{t('progress.noLogs')}</TableCell>
              </TableRow>
            ) : (
              progressLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.weekNumber}</TableCell>
                  <TableCell>{formatDate(new Date(log.checkDate))}</TableCell>
                  <TableCell>{log.workDone}</TableCell>
                  <TableCell>{log.results}</TableCell>
                  <TableCell>{log.teacherComment}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(log)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(log.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? t('progress.editLog') : t('progress.addLog')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="week-number-label">{t('progress.weekNumber')}</InputLabel>
              <Select
                labelId="week-number-label"
                name="weekNumber"
                value={currentLog.weekNumber || ''}
                label={t('progress.weekNumber')}
                onChange={handleSelectChange}
              >
                {[...Array(20)].map((_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {t('progress.week')} {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="checkDate"
              label={t('progress.checkDate')}
              type="date"
              value={currentLog.checkDate ? new Date(currentLog.checkDate).toISOString().split('T')[0] : ''}
              onChange={handleTextChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="workDone"
              label={t('progress.workDone')}
              value={currentLog.workDone || ''}
              onChange={handleTextChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              name="results"
              label={t('progress.results')}
              value={currentLog.results || ''}
              onChange={handleTextChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              name="teacherComment"
              label={t('progress.teacherComment')}
              value={currentLog.teacherComment || ''}
              onChange={handleTextChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 