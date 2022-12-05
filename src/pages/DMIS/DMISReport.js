/* eslint-disable react-hooks/rules-of-hooks */
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography, Card, Divider, TextField, Button, Autocomplete } from '@mui/material';

export default function dmisnewcase() {

    const [caseTypeId, setCaseTypeId] = useState('');
    const [caseTypeName, setCaseTypeName] = useState('');

    useEffect(() => {

        const token = jwtDecode(localStorage.getItem('token'));

    }, []);

    return (
        <>
            <Helmet>
                <title> รายงาน | MIH Center </title>
            </Helmet>

            <Container>

                <Typography variant="h4" sx={{ mb: 5 }}>
                    รายงาน
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>ค้นหาตามเลขที่ใบงาน</Typography>
                        <Stack direction="row">
                            <TextField id="taskId" name="taskId" sx={{ mr: 1 }} label="เลขที่ใบงาน" />
                            <Autocomplete
                                value={caseTypeName}
                                onChange={(event, newValue) => {
                                    setCaseTypeName(newValue);
                                    console.log(`caseTypeName = ${caseTypeName}`)
                                    if (newValue.label === 'งาน IT') {
                                        setCaseTypeId("DMIS_IT");
                                    }
                                    else if (newValue.label === 'งานช่าง') {
                                        setCaseTypeId("DMIS_MT");
                                    }
                                    else {
                                        setCaseTypeId("");
                                    }
                                }}
                                id="controllable-states-case-type-id"
                                options={[
                                    { label: 'งาน IT' },
                                    { label: 'งานช่าง' }]}
                                sx={{ width: 150, mr: 1 }}
                                renderInput={(params) => <TextField required {...params} label="ประเภทงาน" />}
                            />
                            <Button variant="contained" sx={{ width: 100 }}>ค้นหา</Button>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                    <Typography variant='h5'>ค้นหาตามวันเวลาที่กำหนด</Typography>
                        RESUME HERE
                    </Stack>
                    <Divider />
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                    <Typography variant='h5'>ตารางอยู่ตรงนี้</Typography>
                        THIS IS TABLE
                    </Stack>
                </Card>

            </Container>
        </>
    );
}