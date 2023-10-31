/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import MainHeader from '../components/MainHeader';
import DSMSSidebar from './components/nav/DSMSSidebar';
import DSMSShiftEditDialg from './components/dialogs/DSMSShiftEditDialg';

let rToken = '';

let selectedDate = [];
let psnRender = [];
let setMonth = moment();
let firstTime = false;

function DSMSShiftEdit() {
  const [open, setOpen] = useState(false);

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

  const { search } = useLocation();

  const isSkip = (value) => value !== '';

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      rToken = localStorage.getItem('token');
      setMonth = new URLSearchParams(search).get('setMonth');

      if (setMonth === null) {
        setMonth = moment();
      }

      const fetchData = async () => {
        let response = await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getevent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        });
        let data = await response.json();
        await setAllEventsList(data);

        if (data.length === 0 || data === null) {
          firstTime = true;
        }

        response = await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getoperator`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        });
        data = await response.json();
        await setOperator(data);

        response = await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getshift`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        });
        data = await response.json();
        await setShift(data);
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    if (isOnlyOper) {
      setFilteredEvent(operatorEvent);
    } else {
      setFilteredEvent(allEventsList);
    }
  }, [operatorEvent]);

  async function getBookData(pId) {
    let response = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getbookdata/${pId}/${moment().format(
        'M'
      )}/${moment().format('YYYY')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    );
    let data = await response.json();
    if (data.length === 0) {
      await setBookData([]);
    } else {
      await setBookData(data);
    }

    response = await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/geteventbypsnid/${pId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    });
    data = await response.json();
    if (data.length === 0) {
      await setOperatorEvent([]);
    } else {
      await setOperatorEvent(data);
    }
  }

  const localizer = momentLocalizer(moment);

  const ColoredDateCellWrapper = ({ children, value }) => {
    let cellStyle = '';
    const valueDay = `${value.getFullYear()}/${value.getMonth()}/${value.getDate()}`;
    if (shiftId === '') {
      cellStyle = React.cloneElement(React.Children.only(children), {
        // className:valueDay === selDay ? "yourclassname rbc-day-bg": "rbc-day-bg",
        style: {
          ...children.style,
          backgroundColor: '#a6a6a6',
        },
      });
    } else {
      cellStyle = React.cloneElement(React.Children.only(children), {
        // className:valueDay === selDay ? "yourclassname rbc-day-bg": "rbc-day-bg",
        style: {
          ...children.style,
          backgroundColor:
            value < moment().toDate()
              ? '#a6a6a6'
              : bookData.find(
                  (o) =>
                    (`${o.year}/${parseInt(o.month) - 1}/${o.day}` === valueDay &&
                      (o.shift_id === shiftId ||
                        (o.shift_id === 1 && shiftId === 4) ||
                        (o.shift_id === 4 && shiftId === 1))) ||
                    (`${o.year}/${parseInt(o.month) - 1}/${parseInt(o.day) + 1}` === valueDay &&
                      o.shift_id === 1 &&
                      shiftId === 2) ||
                    (`${o.year}/${parseInt(o.month) - 1}/${parseInt(o.day) - 1}` === valueDay &&
                      o.shift_id === 2 &&
                      shiftId === 1)
                )
              ? '#f76f6f'
              : selectedDate.find((o) => o === valueDay)
              ? '#5ae85a'
              : '',
        },
      });
    }
    return cellStyle;
  };

  const handleSelectSlot = (slotInfo) => {
    if (operatorId === '') {
      alert('กรุณาระบุแพทย์ที่ต้องการแก้ไขเวร');
    } else if (shiftId === '') {
      alert('กรุณาเลือกเวรก่อนทำการเลือกวัน');
    } else {
      setSelectedSlot(moment(slotInfo.start).toDate());
      const selDate = moment(slotInfo.start).toDate();
      const selDay = `${selDate.getFullYear()}/${selDate.getMonth()}/${selDate.getDate()}`;
      if (
        bookData.find(
          (o) =>
            (`${o.year}/${parseInt(o.month) - 1}/${o.day}` === selDay &&
              (o.shift_id === shiftId || (o.shift_id === 1 && shiftId === 4) || (o.shift_id === 4 && shiftId === 1))) ||
            (`${o.year}/${parseInt(o.month) - 1}/${parseInt(o.day) + 1}` === selDay &&
              o.shift_id === 1 &&
              shiftId === 2) ||
            (`${o.year}/${parseInt(o.month) - 1}/${parseInt(o.day) - 1}` === selDay &&
              o.shift_id === 2 &&
              shiftId === 1)
        )
      ) {
        alert('คุณได้จองเวรที่มีเวลาทับซ้อนกันไปแล้ว');
        return;
      }
      if (selectedDate.find((o) => o === selDay)) {
        selectedDate.splice(selectedDate.indexOf(selDay), 1);
      } else {
        selectedDate.push(selDay);
      }
    }
  };

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
            dateCellWrapper: ColoredDateCellWrapper,
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
              style: style,
            };
          }}
        />
      </div>
    );
  };

  const handleBookBtn = () => {
    const jsonData = {
      selectedDate: selectedDate,
      shift_id: shiftId,
      personnel_id: operatorId,
    };

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/addevent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          window.location.href = `/dsmsedit?setMonth=${setMonth}`;
        } else {
          alert('ไม่สามารถบันทึกเวรได้');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกเวร');
      });
  };

  if ((allEventsList.length === 0 || allEventsList === null) && !firstTime) {
    console.log('fetch not complete');
    return <div>Loading...</div>;
  }

  const handleEventSelection = async (e) => {
    let response = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getpsneventlist/${e.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    );
    psnRender = await response.json();

    response = await fetch(
      `${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/getshiftbyid/${e.shift_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rToken}`,
        },
      }
    );
    const ShiftData = await response.json();
    const temp = {
      id: e.id,
      shift_id: e.shift_id,
      shift_name: ShiftData.name,
      // "psn_data": psnData,
    };

    await setFocusEvent(temp);
    setFocusEventDialogOpen(true);
  };

  const handleOnlySelect = (event) => {
    if (event.target.checked) {
      setIsOnlyOper(false);
      setFilteredEvent(allEventsList);
    } else {
      setIsOnlyOper(true);
      setFilteredEvent(operatorEvent);
    }
  };

  return (
    <>
      <Helmet>
        <title> ระบบจองเวรแพทย์ | MIH Center </title>
      </Helmet>

      <MainHeader onOpenNav={() => setOpen(true)} />
      <DSMSSidebar name="editshift" openNav={open} onCloseNav={() => setOpen(false)} />
      <DSMSShiftEditDialg
        openDialg={focusEventDialogOpen}
        onCloseDialg={() => {
          setFocusEvent('');
          setFocusEventDialogOpen(false);
        }}
        focusEvent={focusEvent}
        psnRender={psnRender}
        setMonth={setMonth}
        rToken={rToken}
      />

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>จัดการสถานะการจองเวร</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item my-2">
                <a href="/intranet">หน้าหลัก</a>
              </li>
              <li className="breadcrumb-item my-2">
                <a href="/dsmsdashboard">หน้าหลักระบบจองเวรแพทย์</a>
              </li>
              <li className="breadcrumb-item my-2">จัดการสถานะการจองเวร</li>
            </ol>
          </nav>
        </div>

        {/* <!-- End Page Title --> */}
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body pt-3">
                  <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 1, sm: 1, lg: 1 }}>
                    <Grid item xs={12} sm={9} md={9} lg={9}>
                      <Autocomplete
                        value={operatorName}
                        onChange={(event, newValue) => {
                          setOperatorName(newValue);
                          selectedDate = [];
                          setShiftId('');
                          setShiftName('');
                          setDisBookBtn(true);
                          if (newValue !== null && newValue !== '') {
                            setOperatorId(
                              operator.find((o) => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue)
                                .personnel_id
                            );
                            setDisShiftOpt(false);

                            getBookData(
                              operator.find((o) => `${o.personnel_firstname} ${o.personnel_lastname}` === newValue)
                                .personnel_id
                            );
                          } else {
                            setOperatorEvent([]);
                            setOperatorId('');
                            setDisShiftOpt(true);
                          }
                        }}
                        id="controllable-states-psn-id"
                        options={Object.values(operator).map(
                          (option) => `${option.personnel_firstname} ${option.personnel_lastname}`
                        )}
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
                          if (newValue !== null && newValue !== '') {
                            setShiftId(shift.find((o) => o.name === newValue).id);
                            setDisBookBtn(false);
                          } else {
                            setShiftId('');
                            setDisBookBtn(true);
                          }
                        }}
                        id="controllable-states-shift-id"
                        options={Object.values(shift)
                          .map((option) => (option.is_active ? option.name : ''))
                          .filter(isSkip)}
                        fullWidth
                        required
                        renderInput={(params) => <TextField {...params} label="กรุณาเลือกเวร" />}
                        sx={{ p: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3}>
                      <Box sx={{}}>
                        <Checkbox onChange={handleOnlySelect} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />
                        แสดงเวรแพทย์ทั้งหมด
                        <Typography>
                          <span
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor: '#ed9d4c',
                              borderRadius: 50,
                              display: 'inline-block',
                              marginRight: 5,
                            }}
                          />{' '}
                          เวร 17.00-08.00
                        </Typography>
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
                      <Box m={1} display="flex" justifyContent="center" alignItems="center">
                        <Button
                          variant="contained"
                          size="large"
                          sx={{ p: 2 }}
                          disabled={disBookBtn}
                          onClick={handleBookBtn}
                        >
                          <Typography variant="h6">บันทึกเวร</Typography>
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <MyCalendar />
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default DSMSShiftEdit;
