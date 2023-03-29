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
} from '@mui/material';
import { Scheduler } from "@aldabil/react-scheduler";
import type {
    ProcessedEvent,
    SchedulerHelpers
} from "@aldabil/react-scheduler/types";
import { th } from 'date-fns/locale';

const headSname = `${localStorage.getItem('sname')} Center`;

const CustomEditorProps = "";
const scheduler = "";

interface CustomEditorProps {
    scheduler: SchedulerHelpers;
}
const CustomEditor = ({ scheduler }: CustomEditorProps) => {

    return null;
};

export default function DSMSDashboard() {

    const [events, setEvents] = React.useState([]);
    const startd = new Date("2023-03-03T02:30:00.000Z");
    const endd = new Date("2023-03-03T03:30:00.000Z");


    React.useEffect(() => {

        const fetchData = async () => {
            const response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getevent`);
            const data = await response.json();
            for (let i = 0; i < data.length; i += 1) {
                data[i].start = new Date(data[i].start);
                data[i].end = new Date(data[i].end);
            }
            console.log(data);
            setEvents(data);
        };

        fetchData();

    }, []);

    if (events.length === 0 || events === null) {
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
                    ระบบจองเวรแพทย์ - Doctor Shift Management Service(DSMS)
                </Typography>

                <Card>
                    <Paper sx={{ p: 1 }}>
                        <Grid container columnSpacing={{ sm: 5, lg: 12 }}>
                            <Grid item xs={6} sm={9} md={9} lg={10} />
                            <Grid item xs={6} sm={3} md={3} lg={2}>
                                <Box sx={{}}>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#50b500",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 08.00-16.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#0073b5",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 16.00-24.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#7d23cc",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 00.00-08.00</Typography>
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#ed6205",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 17.00-08.00</Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Scheduler
                                    view="month"
                                    editable={false}
                                    deletable={false}
                                    month={{
                                        weekDays: [0, 1, 2, 3, 4, 5, 6],
                                        weekStartOn: 1,
                                        startHour: 1,
                                        endHour: 23,
                                        // cellRenderer?: (props: CellProps) => JSX.Element,
                                        navigation: true,
                                        disableGoToDay: false
                                    }}
                                    week={null}
                                    day={null}
                                    events={events}
                                    height={800}
                                    hourFormat={"24"}
                                    customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                                    // locale={th}
                                    translations={{
                                        navigation: {
                                            month: "Month",
                                            week: "Week",
                                            day: "Day",
                                            today: "กลับไปเดือนปัจจุบัน"
                                        },
                                        form: {
                                            addTitle: "Add Event",
                                            editTitle: "Edit Event",
                                            confirm: "Confirm",
                                            delete: "Delete",
                                            cancel: "Cancel"
                                        },
                                        event: {
                                            title: "Title",
                                            start: "Start",
                                            end: "End",
                                            allDay: "All Day"
                                        },
                                        moreEvents: "More...",
                                        loading: "Loading..."
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {/* <Scheduler
                            view="month"
                            // month={{
                            //     startHour: 0,
                            //     endHour: 0,
                            // }}
                            week={null}
                            day={null}
                            events={[
                                {
                                  event_id: 1,
                                  title: "Event 1",
                                  start: new Date("2021/3/3 09:30"),
                                  end: new Date("2021/3/3 10:30"),
                                },
                                {
                                  event_id: 2,
                                  title: "Event 2",
                                  start: new Date("2021/3/4 10:00"),
                                  end: new Date("2021/3/4 11:00"),
                                },
                              ]}
                            customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                            viewerExtraComponent={(fields, event) => {
                                return (
                                    <div>
                                        <p>Useful to render custom fields...</p>
                                        <p>Description: {event.description || "Nothing..."}</p>
                                    </div>
                                );
                            }}
                            translations={{
                                navigation: {
                                    month: "เดือน",
                                    week: "สัปดาห์",
                                    day: "วัน",
                                    today: "ไปที่วันนี้"
                                },
                                form: {
                                    addTitle: "เพิ่มกิจกรรม",
                                    editTitle: "แก้ไขกิจกรรม",
                                    confirm: "ยืนยัน",
                                    delete: "ลบ",
                                    cancel: "ยกเลิก"
                                },
                                event: {
                                    title: "หัวข้อ",
                                    start: "เริ่ม",
                                    end: "จบ",
                                    allDay: "ทั้งวัน"
                                },
                                moreEvents: "อื่นๆ...",
                                loading: "กำลังโหลด..."
                            }}
                        /> */}
                    </Paper>
                </Card>
            </Container>
        </>
    );
}