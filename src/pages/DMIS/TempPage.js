/* eslint-disable react-hooks/rules-of-hooks */
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography, Card } from '@mui/material';

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
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        This is temp page
                    </Stack>
                </Card>

            </Container>
        </>
    );
}