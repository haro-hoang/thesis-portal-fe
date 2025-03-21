'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import ProgressTracking from '../progress-tracking';
import { t } from 'i18next';

export default function ProgressPage() {
  const params = useParams();
  const thesisId = params.id as string;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('progress.trackingTitle')}
      </Typography>
      <ProgressTracking thesisId={thesisId} />
    </Box>
  );
}
