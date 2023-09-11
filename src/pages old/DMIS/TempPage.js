/* eslint-disable react-hooks/rules-of-hooks */
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography, Card } from '@mui/material';

const headSname = `${localStorage.getItem('sname')} Center`;

export default function dmisnewcase() {

    return (
        <>
            <Helmet>
                <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
            </Helmet>

            <Container>

                <Typography variant="h4" sx={{ mb: 5 }}>
                    ระบบแจ้งปัญหาออนไลน์
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        This is temp page
                    </Stack>
                </Card>

            </Container>
        </>
    );
}