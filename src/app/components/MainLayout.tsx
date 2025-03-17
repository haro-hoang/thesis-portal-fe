"use client";

import { Box, Link, Toolbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

interface Props {
    children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <Header />
            <Sidebar/>
            <Box component={"main"}
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: isCollapsed ? '2.5rem' : '16rem',
                    marginTop: '4rem',
                }}>
                {/* <Toolbar /> */}
                {children}
            </Box>
        </Box>
    );
}