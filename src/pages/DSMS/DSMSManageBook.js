/* eslint-disable radix */
/* eslint-disable object-shorthand */
import { useLocation } from 'react-router-dom';
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
    Dialog,
    DialogTitle,
    DialogContent,
    styled,
    DialogActions,
    Checkbox,
} from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'

const headSname = `${localStorage.getItem('sname')} Center`;

let selectedDate = [];
let psnRender = [];
let setMonth = moment();
let firstTime = false;

export default function DSMSManageBook() {

    const [allEventsList, setAllEventsList] = useState([]);
    const [filteredEvent, setFilteredEvent] = useState([]);

    const [disShiftOpt, setDisShiftOpt] = useState(true);
    const [disBookBtn, setDisBookBtn] = useState(true);

    const [operator, setOperator] = useState([]);
    const [operatorName, setOperatorName] = useState('');
    const [operatorId, setOperatorId] = useState('');
    const [operatorEvent, setOperatorEvent] = useState([]);
    const [isOnlyOper, setIsOnlyOper] = useState(true);

    const [shift, setShift] = useState([]);
    const [shiftName, setShiftName] = useState('');
    const [shiftId, setShiftId] = useState('');

    const [bookData, setBookData] = useState([]);

    const [selectedSlot, setSelectedSlot] = useState(null);

    const [focusEvent, setFocusEvent] = useState([]);
    const [focusEventDialogOpen, setFocusEventDialogOpen] = useState(false);

    const Item = styled('div')(({ theme }) => ({
        padding: theme.spacing(1),
        textAlign: 'left',
    }));

    const { search } = useLocation();

    const isSkip = (value) => value !== '';

    useEffect(() => {

        setMonth = new URLSearchParams(search).get('setMonth');

        if (setMonth === null) {
            setMonth = moment();
        }

        const fetchData = async () => {
            let response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getevent`);
            let data = await response.json();
            await setAllEventsList(data);

            if (data.length === 0 || data === null) {
                firstTime = true;
            }

            response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getoperator`);
            data = await response.json();
            await setOperator(data);

            response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getshift`);
            data = await response.json();
            await setShift(data);

        };

        fetchData();


    }, []);

    useEffect(() => {
        if (isOnlyOper) {
            setFilteredEvent(operatorEvent);
        }
        else {
            setFilteredEvent(allEventsList);
        }
    }, [operatorEvent])

    async function getBookData(pId) {
        let response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getbookdata/${pId}/${moment().format('M')}/${moment().format('YYYY')}`);
        let data = await response.json();
        if (data.length === 0) {
            await setBookData([]);
        }
        else {
            await setBookData(data);
        }

        response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/geteventbypsnid/${pId}`)
        data = await response.json();
        if (data.length === 0) {
            await setOperatorEvent([]);
        }
        else {
            await setOperatorEvent(data);
        }

    }

    const localizer = momentLocalizer(moment);

    const ColoredDateCellWrapper = ({ children, value }) => {
        let cellStyle = "";
        const valueDay = `${value.getFullYear()}/${value.getMonth()}/${value.getDate()}`;
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
            cellStyle = React.cloneElement(React.Children.only(children), {
                // className:valueDay === selDay ? "yourclassname rbc-day-bg": "rbc-day-bg",
                style: {
                    ...children.style,
                    backgroundColor: value < moment().toDate() ? "#a6a6a6" : bookData.find(o => `${o.year}/${(parseInt(o.month) - 1)}/${o.day}` === valueDay &&
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
        if (operatorId === "") {
            alert("กรุณาระบุแพทย์ที่ต้องการแก้ไขเวร");
        }
        else if (shiftId === "") {
            alert("กรุณาเลือกเวรก่อนทำการเลือกวัน");
        }
        else {
            setSelectedSlot(moment(slotInfo.start).toDate());
            const selDate = moment(slotInfo.start).toDate();
            const selDay = `${selDate.getFullYear()}/${selDate.getMonth()}/${selDate.getDate()}`;
            if (bookData.find(o => `${o.year}/${(parseInt(o.month) - 1)}/${o.day}` === selDay &&
                (o.shift_id === shiftId || o.shift_id === 1 && shiftId === 4 || o.shift_id === 4 && shiftId === 1) ||
                `${o.year}/${(parseInt(o.month) - 1)}/${parseInt(o.day) + 1}` === selDay && o.shift_id === 1 && shiftId === 2 ||
                `${o.year}/${(parseInt(o.month) - 1)}/${parseInt(o.day) - 1}` === selDay && o.shift_id === 2 && shiftId === 1)) {
                alert("คุณได้จองเวรที่มีเวลาทับซ้อนกันไปแล้ว");
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

    const handleNavigate = (newDate) => {
        setMonth = newDate;
    };

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
                        // agenda: {
                        //     date: firstDayOfMonth,
                        //     length: 30,
                        // },
                    }}
                    selectable
                    defaultDate={setMonth}
                    longPressThreshold={50}
                    events={filteredEvent}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleEventSelection}
                    onNavigate={handleNavigate}
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
            personnel_id: operatorId,
        }

        // console.log(jsonData);

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
                    window.location.href = `/dsms/dsmsmanagebook?setMonth=${setMonth}`;
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

    if ((allEventsList.length === 0 || allEventsList === null) && !firstTime) {
        console.log("fetch not complete");
        return <div>Loading...</div>;
    }

    const handleEventSelection = async (e) => {
        let response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getpsneventlist/${e.id}`);
        psnRender = await response.json();

        response = await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/getshiftbyid/${e.shift_id}`);
        const ShiftData = await response.json();
        const temp = ({
            "id": e.id,
            "shift_id": e.shift_id,
            "shift_name": ShiftData.name,
            // "psn_data": psnData,
        });

        await setFocusEvent(temp);
        handleOpenFocusEventDialog();
    };

    const handleOpenFocusEventDialog = () => {
        setFocusEventDialogOpen(true);
    }

    const handleCloseFocusEventDialog = () => {
        setFocusEvent("");
        setFocusEventDialogOpen(false);
    }

    const handleDeletePSN = async (id, pid) => {
        await fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dsmsPort}/api/dsms/deleteevent/${id}/${pid}`, {
            method: 'DELETE'
        });
        setFocusEventDialogOpen(false);
        window.location.href = `/dsms/dsmsmanagebook?setMonth=${setMonth}`;
    }

    const handleOnlySelect = (event) => {
        if (event.target.checked) {
            setIsOnlyOper(false);
            setFilteredEvent(allEventsList);
        }
        else {
            setIsOnlyOper(true);
            setFilteredEvent(operatorEvent);
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
                            แก้ไขเวร
                        </Typography>
                        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 1, sm: 1, lg: 1 }}>
                            <Grid item xs={12} sm={9} md={9} lg={9}>
                                <Autocomplete
                                    value={operatorName}
                                    onChange={(event, newValue) => {
                                        setOperatorName(newValue);
                                        selectedDate = [];
                                        setShiftId("");
                                        setShiftName("");
                                        setDisBookBtn(true);
                                        if (newValue !== null && newValue !== "") {
                                            setOperatorId(operator.find(o => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue).personnel_id);
                                            setDisShiftOpt(false);

                                            getBookData(operator.find(o => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue).personnel_id);
                                        }
                                        else {
                                            setOperatorEvent([]);
                                            setOperatorId("");
                                            setDisShiftOpt(true);
                                        }

                                    }}
                                    id="controllable-states-psn-id"
                                    options={Object.values(operator).map((option) => `${option.personnel_firstname} ${option.personnel_lastname}`)}
                                    fullWidth
                                    required
                                    renderInput={(params) => <TextField {...params} label="กรุณาระบุแพทย์ที่ต้องการแก้ไขเวร" />}
                                    sx={{ p: 2 }}
                                />
                                <Autocomplete
                                    value={shiftName}
                                    disabled={disShiftOpt}
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
                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                <Box sx={{}}>
                                    <Checkbox onChange={handleOnlySelect} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />แสดงเวรแพทย์ทั้งหมด
                                    <Typography><span style={{
                                        height: 20,
                                        width: 20,
                                        backgroundColor: "#ed9d4c",
                                        borderRadius: 50,
                                        display: 'inline-block',
                                        marginRight: 5,
                                    }} /> เวร 17.00-08.00</Typography>
                                    {/* <Typography><span style={{
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
                                    }} /> เวร 16.00-24.00</Typography> */}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    m={1}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Button variant="contained" size="large" sx={{ p: 2 }} disabled={disBookBtn} onClick={handleBookBtn} >
                                        <Typography variant="h6">บันทึกเวร</Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <MyCalendar />
                            </Grid>
                        </Grid>
                    </Paper>
                </Card>
            </Container>

            {/* ============================รายละเอียดของเวรแพทย์======================================= */}
            <Dialog fullWidth maxWidth="md" open={focusEventDialogOpen} onClose={handleCloseFocusEventDialog}>
                <DialogTitle>รายละเอียดของเวรแพทย์</DialogTitle>
                <DialogContent>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <Item sx={{ textAlign: 'right' }}>เวลา:</Item>
                            </Grid>
                            <Grid item xs={8}>
                                <Item>{focusEvent.shift_name}</Item>
                            </Grid>

                            {
                                psnRender.map((psn) => (
                                    <>
                                        <Grid item xs={4}>
                                            <Item sx={{ textAlign: 'right' }}>แพทย์ผู้เข้าเวร:</Item>
                                        </Grid>
                                        <Grid item xs={5} sm={3}>
                                            <Item>{psn.personnel_firstname} {psn.personnel_lastname}</Item>
                                        </Grid>
                                        <Grid item xs={3} sm={5}>
                                            <Item><Button variant="contained" color="error" onClick={() => handleDeletePSN(focusEvent.id, psn.personnel_id)}>ลบ</Button></Item>
                                        </Grid>
                                    </>
                                ))
                            }


                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFocusEventDialog}>ปิดหน้าต่าง</Button>
                </DialogActions>
            </Dialog>
            {/* ================================================================================== */}
        </>
    );
}