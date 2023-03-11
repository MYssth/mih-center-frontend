import { Helmet } from 'react-helmet-async';
import {
    Container,
    Typography,
} from '@mui/material';

export default function DSMSDashboard() {

    return (
        <>
            <Helmet>
                <title> ระบบจองเวรแพทย์ | MIH Center </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    ระบบจองเวรแพทย์ - Doctor Shift Management Service(DSMS)
                </Typography>
            </Container>
        </>
    );
}