/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import {
    Container,
    Typography,
    Card,
    Paper,
    TextField,
    DialogActions,
    Button,
    Grid,
    Box,
    Autocomplete,
} from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'

const headSname = `${localStorage.getItem('sname')} Center`;

export default function DSMSBookShift() {

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [myEventsList, setMyEventsList] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            const response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getevent`);
            const data = await response.json();
            setMyEventsList(data);
        };

        fetchData();

    }, []);

    const localizer = momentLocalizer(moment)

    const MyCalendar = (props) => (
        <div>
            <Calendar
                // views={[Views.MONTH, Views.AGENDA]}
                views={{
                    month: true,
                    agenda: true,
                    // agenda: {
                    //     date: firstDayOfMonth,
                    //     length: 30,
                    // },
                }}
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 950 }}
                eventPropGetter={(event, start, end, isSelected) => {
                    const backgroundColor = event.hexColor;
                    const style = {
                        backgroundColor: backgroundColor,
                        borderRadius: '0px',
                        opacity: 0.8,
                        color: 'black',
                        border: '0px',
                        visibility: 'visible',
                    };
                    return {
                        style: style
                    };
                }
                }
            />
        </div>
    )

    if (myEventsList.length === 0 || myEventsList === null) {
        console.log("fetch not complete");
        return <div>Loading...</div>;
    }

    return (
        <>
            <Helmet>
                <title> ระบบจองเวรแพทย์ | {headSname} </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    จองเวร
                </Typography>

                <Card>
                    <Paper sx={{ p: 1 }}>
                        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ sm: 5, lg: 12 }}>
                            <Grid item xs={6} sm={9} md={9} lg={10} />
                            <Autocomplete />
                            <Grid item xs={6} sm={3} md={3} lg={2}>
                                <Box>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#ed9d4c",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 17.00-08.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#aa4ced",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 00.00-08.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#73bf43",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 08.00-16.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#4c8aed",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 16.00-24.00</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <MyCalendar />
                            </Grid>
                        </Grid>
                    </Paper>
                </Card>
            </Container>
        </>
    );
}