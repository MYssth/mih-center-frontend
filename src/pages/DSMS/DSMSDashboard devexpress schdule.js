import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import {
    Container,
    Typography,
    Card,
    Paper,
} from '@mui/material';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    Appointments,
    MonthView,
    Toolbar,
    DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';

const headSname = `${localStorage.getItem('sname')} Center`;

const currentDate = new Date();
const schedulerData = [
    { startDate: '2023-03-05T09:45', endDate: '2023-03-05T11:00', title: 'Meeting' },
    { startDate: '2023-03-05T12:00', endDate: '2023-03-05T13:30', title: 'Go to a gym' },
];

export default function DSMSDashboard(){

    return (
        <>
            <Helmet>
                <title> ระบบจองเวรแพทย์ | {headSname} </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    ระบบจองเวรแพทย์ - Doctor Shift Management Service(DSMS)
                </Typography>

                <Card>
                    <Paper>
                        <Scheduler
                            data={schedulerData}
                        >
                            <ViewState
                                defaultCurrentDate={currentDate}
                            />
                            <MonthView />
                            <Toolbar />
                            <DateNavigator />
                            <Appointments />
                        </Scheduler>
                    </Paper>
                </Card>
            </Container>
        </>
    );
}