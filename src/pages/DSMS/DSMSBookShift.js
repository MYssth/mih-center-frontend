/* eslint-disable radix */
/* eslint-disable object-shorthand */
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import {
    Container,
    Typography,
    Card,
    Paper,
    TextField,
    Button,
    Grid,
    Box,
    Autocomplete,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    styled,
} from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'

const Item = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
}));

const headSname = `${localStorage.getItem('sname')} Center`;
let selectedDate = [];
let setMonth = moment().add(1, 'month');

export default function DSMSBookShift() {

    const [tokenData, setTokenData] = useState([]);

    const [myBookData, setMyBookData] = useState([]);
    const [shift, setShift] = useState([]);
    const [shiftId, setShiftId] = useState("");
    const [shiftName, setShiftName] = useState("");

    const [selectedSlot, setSelectedSlot] = useState(null);

    const [emptyEvent, setEmptyEvent] = useState(false);
    const [disBookBtn, setDisBookBtn] = useState(true);

    const [focusEvent, setFocusEvent] = useState(null);
    const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);

    const isSkip = (value) => value !== '';

    useEffect(() => {

        const token = localStorage.getItem('token');
        setTokenData(jwtDecode(token));


        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getsetting`)
            .then((response) => response.json())
            .then((data) => {
                if (moment().date() > data.limit_date) {
                    setMonth = moment().add(2, 'month');
                }

                fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getbookdata/${jwtDecode(token).personnel_id}/${setMonth.format('M')}/${setMonth.format('YYYY')}`)
                    .then((response) => response.json())
                    .then((data) => {

                        if (data.length === 0) {
                            setEmptyEvent(true);
                        }
                        else {
                            setMyBookData(data);
                        }

                    })
                    .catch((error) => {
                        if (error.name === "AbortError") {
                            console.log("cancelled")
                        }
                        else {
                            console.error('Error:', error);
                        }
                    })

            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            })
        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getshift`)
            .then((response) => response.json())
            .then((data) => {
                setShift(data);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            })

    }, []);

    const localizer = momentLocalizer(moment);

    const ColoredDateCellWrapper = ({ children, value }) => {
        let cellStyle = "";

        if (shiftId === "") {
            cellStyle = React.cloneElement(React.Children.only(children), {
                // className:valueDay === selDay ? "yourclassname rbc-day-bg": "rbc-day-bg",
                style: {
                    ...children.style,
                    backgroundColor: "#a6a6a6",
                },
            });
        }
        else {
            const valueDay = `${value.getFullYear()}/${value.getMonth()}/${value.getDate()}`;
            cellStyle = React.cloneElement(React.Children.only(children), {
                // className:valueDay === selDay ? "yourclassname rbc-day-bg": "rbc-day-bg",
                style: {
                    ...children.style,
                    backgroundColor: myBookData.find(o => `${o.year}/${(parseInt(o.month) - 1)}/${o.day}` === valueDay &&
                        (o.shift_id === shiftId || o.shift_id === 1 && shiftId === 4 || o.shift_id === 4 && shiftId === 1) ||
                        `${o.year}/${(parseInt(o.month) - 1)}/${parseInt(o.day) + 1}` === valueDay && o.shift_id === 1 && shiftId === 2 ||
                        `${o.year}/${(parseInt(o.month) - 1)}/${parseInt(o.day) - 1}` === valueDay && o.shift_id === 2 && shiftId === 1) ?
                        "#f76f6f" : selectedDate.find(o => o === valueDay) ?
                            "#5ae85a" : "",
                },
            });
        }

        return cellStyle;
    }

    const handleSelectSlot = ((slotInfo) => {
        if (shiftId === "") {
            alert("กรุณาเลือกเวรก่อนทำการเลือกวัน");
        }
        else {
            setSelectedSlot(moment(slotInfo.start).toDate());
            const selDate = moment(slotInfo.start).toDate();
            const selDay = `${selDate.getFullYear()}/${selDate.getMonth()}/${selDate.getDate()}`;
            if (selDate.getMonth() !== parseInt(setMonth.format('M')) - 1) {
                alert("ไม่สามารถเลือกวันดังกล่าวได้");
                return;
            }
            const dayCheck = myBookData.find(o => `${o.year}/${(parseInt(o.month) - 1)}/${o.day}` === selDay &&
                (o.shift_id === shiftId || o.shift_id === 1 && shiftId === 4 || o.shift_id === 4 && shiftId === 1) ||
                `${o.year}/${(parseInt(o.month) - 1)}/${parseInt(o.day) + 1}` === selDay && o.shift_id === 1 && shiftId === 2 ||
                `${o.year}/${(parseInt(o.month) - 1)}/${parseInt(o.day) - 1}` === selDay && o.shift_id === 2 && shiftId === 1 ? o.name : "");
            if (dayCheck !== "" && dayCheck !== null && dayCheck !== undefined) {
                console.log(dayCheck);
                setFocusEvent(dayCheck);
                handleOpenDeleteEventDialog();
                // alert("คุณได้จองเวรที่มีเวลาทับซ้อนกันไปแล้ว");
                return;
            }
            if (selectedDate.find(o => o === selDay)) {
                selectedDate.splice(selectedDate.indexOf(selDay), 1);
            }
            else {
                selectedDate.push(selDay);
            }
        }
    })

    const MyCalendar = (props) => {

        const isMobile = window.innerWidth < 768;

        const sizeStyle = {
            height: isMobile ? '600px' : '950px',
            // margin: isMobile ? '20px' : '40px',
            fontSize: isMobile ? '9px' : '16px',
        };

        return (
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
                    selectable
                    longPressThreshold={50}
                    onSelectSlot={handleSelectSlot}
                    defaultDate={setMonth}
                    toolbar={false}
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                    components={{
                        dateCellWrapper: ColoredDateCellWrapper
                    }}
                    // style={{ height: 950 }}
                    style={sizeStyle}
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
                    }}
                />
            </div>
        )
    }

    const handleBookBtn = () => {
        const jsonData = {
            selectedDate: selectedDate,
            shift_id: shiftId,
            personnel_id: tokenData.personnel_id,
        }

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/addevent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    window.location.reload(false);
                }
                else {
                    alert('ไม่สามารถบันทึกเวรได้');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการบันทึกเวร');
            });
    }

    if ((myBookData.length === 0 || myBookData === null) && !emptyEvent) {
        console.log("fetch not complete");
        return <div>Loading...</div>;
    }

    const handleOpenDeleteEventDialog = () => {
        setDeleteEventDialogOpen(true);
    }

    const handleCloseDeleteEventDialog = () => {
        setFocusEvent("");
        setDeleteEventDialogOpen(false);
    }

    const handleDeletePSN = async () => {
        await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/deleteevent/${focusEvent.id}/${tokenData.personnel_id}`, {
            method: 'DELETE'
        });
        setDeleteEventDialogOpen(false);
        window.location.reload(false);
    }

    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        return date.toLocaleString('th-TH', { month: 'long' });
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
                            จองเวร
                        </Typography>
                        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 1, sm: 5, lg: 1 }}>
                            <Grid item xs={12}>
                                <Typography variant="h7" sx={{ mb: 5, p: 2 }}>
                                    {tokenData.personnel_name}
                                </Typography>
                                <Autocomplete
                                    value={shiftName}
                                    onChange={(event, newValue) => {
                                        setShiftName(newValue);
                                        selectedDate = [];
                                        if (newValue !== null && newValue !== "") {
                                            setShiftId(shift.find(o => o.name === newValue).id);
                                            setDisBookBtn(false);
                                        }
                                        else {
                                            setShiftId("");
                                            setDisBookBtn(true);
                                        }
                                    }}
                                    id="controllable-states-shift-id"
                                    options={Object.values(shift).map((option) => option.is_active ? option.name : "").filter(isSkip)}
                                    fullWidth
                                    required
                                    renderInput={(params) => <TextField {...params} label="กรุณาเลือกเวร" />}
                                    sx={{ p: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    m={1}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Button variant="contained" size="large" sx={{ p: 2 }} disabled={disBookBtn} onClick={handleBookBtn}>
                                        <Typography variant="h6">บันทึกเวร</Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h3" align="center">
                                    {setMonth.format("MMMM")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <MyCalendar />
                            </Grid>
                        </Grid>
                    </Paper>
                </Card>
            </Container>

            {/* ============================ลบเวร======================================= */}
            <Dialog fullWidth maxWidth="md" open={deleteEventDialogOpen} onClose={handleCloseDeleteEventDialog}>
                <DialogTitle>ยืนยันการลบเวร</DialogTitle>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography>
                            ไม่สามารถเลือกวันดังกล่าวได้เนื่องจากมีเวลาจากเวรอื่นทับซ้อนหรือได้ลงเวรในวันนี้ไปแล้ว<br />
                            เวรที่ลงไว้ : วันที่ {focusEvent?.day} {getMonthName(focusEvent?.month)} {focusEvent?.year} เวลา {focusEvent?.name}น.<br />
                            ต้องการยกเลิกเวรที่ลงไว้หรือไม่
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleDeletePSN}>ยกเลิกเวร</Button>
                    <Button onClick={handleCloseDeleteEventDialog}>ปิดหน้าต่าง</Button>
                </DialogActions>
            </Dialog>
            {/* ================================================================================== */}
        </>
    );
}