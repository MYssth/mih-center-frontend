/* eslint-disable object-shorthand */
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import jwtDecode from "jwt-decode";
import {
    Container,
    Typography,
    Card,
    Paper,
    Grid,
    Box,
    Checkbox,

} from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/th'

const headSname = `${localStorage.getItem('sname')} Center`;

const today = new Date();
let defaultDate = new Date(today.getFullYear(), today.getMonth(), 1);

export default function DSMSDashboard() {

    const [tokenData, setTokenData] = useState([]);

    const [allEventsList, setAllEventsList] = useState([]);
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [operatorEvent, setOperatorEvent] = useState([]);
    const [isOnlyOper, setIsOnlyOper] = useState(false);


    useEffect(() => {

        const token = localStorage.getItem('token');
        setTokenData(jwtDecode(token));

        const fetchData = async () => {
            let response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getevent`);
            let data = await response.json();
            await setAllEventsList(data);
            await setFilteredEvent(data);

            response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/geteventbypsnid/${jwtDecode(token).personnel_id}`)
            data = await response.json();
            if (data.length === 0) {
                await setOperatorEvent([]);
            }
            else {
                await setOperatorEvent(data);
            }
        };

        fetchData();

    }, []);

    const localizer = momentLocalizer(moment);

    const MyCalendar = (props) => {

        const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM YYYY'));

        const agendaHeaderFormat = (date, culture, localizer) => `ตารางเวรแพทย์ประจำเดือน ${currentMonth}`;

        const eventTimeRangeFormat = ({ start, end }, culture, localizer) => {
            console.log(`start = ${localizer.format(start, 'HH', culture) === "17"}`);
            console.log(`end = ${end}`);
            const endTime = localizer.format(start, 'HH', culture) === "17" && localizer.format(end, 'HH', culture) === "23" ? "08:00" :
             localizer.format(start, 'HH', culture) === "16" && localizer.format(end, 'HH', culture) === "23" ? "00:00" : localizer.format(end, 'HH:mm', culture);

           return `${localizer.format(start, 'HH:mm', culture)} - ${endTime}`;
        }


        const agendaDateFormat = (date, culture, localizer) => localizer.format(date, 'dddd D MMMM ');

        const eventTimeFormat = (time, culture, localizer) => {

            // const date = new Date(time);
            // const isStartTime = allEventsList.some((event) => moment(date).isSame(event.start, 'minute'));
            // const isEndTime = allEventsList.some((event) => moment(date).isSame(event.end, 'minute'));
            // const format = 'HH:mm';

            // if (isStartTime && !isEndTime) {
            //     return localizer.format(date, format, culture);
            // }
            return '';

        };

        // const today = new Date();
        // const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth()-1, 1);
        // const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const firstDayOfMonth = moment().startOf('month').toDate();
        const lastDayOfMonth = moment().endOf('month').toDate();

        const allDays = [];
        // ใส่ loop เช็คข้ามวันที่มี event อยู่แล้ว
        for (let date = firstDayOfMonth; date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
            allDays.push({
                title: '',
                start: new Date(date),
                end: new Date(date),
            });
        }
        const eventsForAllDays = [...filteredEvent, ...allDays];

        const handleNavigate = (date, view) => {
            if (view === 'agenda') {
                setCurrentMonth(moment(date).format('MMMM YYYY'));
            }
            if (view === 'month') {
                defaultDate = date;
            }
        };

        // const EventAgenda = ({ event }) => {
        //     if (moment(event.start).isSame(event.end, 'day')) {
        //       return <span>{event.title}</span>; // Return null to hide the event
        //     }
        //     return null; // Render the event normally
        //   };

        return (
            <div>
                <Calendar
                    views={['month', 'agenda']}
                    localizer={localizer}
                    defaultDate={defaultDate}
                    // events={allEventsList}
                    events={eventsForAllDays}
                    onNavigate={handleNavigate}
                    // components={{
                    //     agenda: {
                    //       event: EventAgenda,
                    //     },
                    //   }}
                    formats={{
                        agendaHeaderFormat: agendaHeaderFormat,
                        agendaTimeRangeFormat: eventTimeRangeFormat,
                        agendaTimeFormat: eventTimeFormat,
                        agendaDateFormat: agendaDateFormat,
                    }}
                    min={firstDayOfMonth}
                    max={lastDayOfMonth}
                    // startAccessor="start"
                    // endAccessor="end"
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
                        // if (!event.title) {
                        //     style.display = 'none';
                        // }
                        return {
                            style: style
                        };
                    }}
                />
            </div>
        )
    }

    if (allEventsList.length === 0 || allEventsList === null) {
        console.log("fetch not complete");
        return <div>Loading...</div>;
    }

    const handleOnlySelect = (event) => {
        if (event.target.checked) {
            setIsOnlyOper(true);
            setFilteredEvent(operatorEvent);
        }
        else {
            setIsOnlyOper(false);
            setFilteredEvent(allEventsList);
        }

    }

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
                    <Paper sx={{ p: 1 }}>
                        <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div" >
                            หน้าหลักระบบจองเวรแพทย์
                        </Typography>
                        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ sm: 5, lg: 6 }}>
                            <Grid item xs={0} sm={8} md={9} lg={9} />
                            <Grid item xs={12} sm={4} md={3} lg={3}>
                                <Box sx={{}}>
                                    <Checkbox onChange={handleOnlySelect} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />แสดงเฉพาะตนเอง
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