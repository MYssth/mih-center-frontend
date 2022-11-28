import { Icon } from '@iconify/react';
import * as React from 'react';
import { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Typography, TextField, Card, Button, Checkbox, Box } from '@mui/material';

export default function dmisnewcase() {
    

    return (
        <>
            <Helmet>
                <title> แจ้งซ่อมอุปกรณ์ | MIH Center </title>
            </Helmet>

            <Container>
            
                <Typography variant="h4" sx={{ mb: 5 }}>
                    แจ้งซ่อมอุปกรณ์
                </Typography>
                <Card>
                    test
                </Card>
            </Container>
        </>
    );
}