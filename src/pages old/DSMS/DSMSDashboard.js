/* eslint-disable no-unused-vars */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable object-shorthand */
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import jwtDecode from 'jwt-decode';
import { Container, Typography, Card, Paper, Grid, Box, Checkbox } from '@mui/material';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/th';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const headSname = `${localStorage.getItem('sname')} Center`;
const rToken = localStorage.getItem('token');

const today = new Date();
let defaultDate = new Date(today.getFullYear(), today.getMonth(), 1);
let firstTime = false;

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

      response = await fetch(
        `${process.env.REACT_APP_host}${process.env.REACT_APP_dsmsPort}/geteventbypsnid/${
          jwtDecode(token).personnel_id
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        }
      );
      data = await response.json();
      if (data.length === 0) {
        await setOperatorEvent([]);
      } else {
        await setOperatorEvent(data);
      }
      await setFilteredEvent(data);
      // console.log(data);
    };

    fetchData();
  }, []);

  const localizer = momentLocalizer(moment);

  const MyCalendar = (props) => {
    let currentMonth = moment().format('MMMM YYYY');

    const agendaHeaderFormat = (date, culture, localizer) => `ตารางเวรแพทย์ประจำเดือน ${currentMonth}`;

    const eventTimeRangeFormat = ({ start, end }, culture, localizer) => {
      console.log(`start = ${start}`);
      console.log(`end = ${end}`);

      const endTime =
        localizer.format(start, 'HH', culture) === '17' && localizer.format(end, 'HH', culture) === '23'
          ? '08:00'
          : localizer.format(start, 'HH', culture) === '16' && localizer.format(end, 'HH', culture) === '23'
          ? '00:00'
          : localizer.format(end, 'HH:mm', culture);

      return `${localizer.format(start, 'HH:mm', culture)} - ${endTime}`;
    };

    const agendaDateFormat = (date, culture, localizer) => localizer.format(date, 'dd D MMM ');

    const eventTimeFormat = (time, culture, localizer) => '';

    const firstDayOfMonth = moment().startOf('month').toDate();
    const lastDayOfMonth = moment().endOf('month').toDate();

    const allDays = [];

    for (let i = -3; i <= 3; i += 1) {
      const firstDay = moment(firstDayOfMonth).subtract(i, 'months').startOf('month').toDate();
      const lastDay = moment(lastDayOfMonth).subtract(i, 'months').endOf('month').toDate();
      for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
        if (
          filteredEvent.find(
            (o) =>
              new Date(o.start).getDate() === new Date(date).getDate() &&
              new Date(o.start).getMonth() === new Date(date).getMonth() &&
              new Date(o.start).getFullYear() === new Date(date).getFullYear()
          ) === undefined
        ) {
          allDays.push({
            title: '',
            start: new Date(date),
            end: new Date(date),
          });
        }
      }
    }
    const eventsForAllDays = [...filteredEvent, ...allDays];

    const handleNavigate = async (date, view) => {
      // console.log(`sssssss ${moment(new Date(date.getFullYear(), date.getMonth(), 1))}`);

      // if (view === 'agenda') {
      // currentMonth = await moment(date).format('MMMM YYYY');
      currentMonth = await moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('MMMM YYYY');

      // console.log(`currenMonth = ${currentMonth}`);
      // }
      // if (view === 'month') {
      defaultDate = await new Date(date.getFullYear(), date.getMonth(), 1);
      // }
    };

    const isMobile = window.innerWidth < 768;

    const sizeStyle = {
      height: isMobile ? '600px' : '950px',
      // margin: isMobile ? '20px' : '40px',
      fontSize: isMobile ? '9px' : '16px',
    };

    return (
      <div>
        <Calendar
          views={['month', 'agenda']}
          localizer={localizer}
          defaultDate={defaultDate}
          events={eventsForAllDays}
          onNavigate={handleNavigate}
          formats={{
            agendaHeaderFormat: agendaHeaderFormat,
            agendaTimeRangeFormat: eventTimeRangeFormat,
            agendaTimeFormat: eventTimeFormat,
            agendaDateFormat: agendaDateFormat,
          }}
          startAccessor="start"
          endAccessor="end"
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

  if ((allEventsList.length === 0 || allEventsList === null) && !firstTime) {
    console.log('fetch not complete');
    return <div>Loading...</div>;
  }

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
        <title> ระบบจองเวรแพทย์ | {headSname} </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          ระบบจองเวรแพทย์ - Doctor Shift Management Service(DSMS)
        </Typography>

        <Card>
          <Paper sx={{ p: 1 }}>
            <Typography sx={{ flex: '1 1 100%', p: 1 }} variant="h6" id="tableTitle" component="div">
              หน้าหลักระบบจองเวรแพทย์
            </Typography>
            <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ sm: 5, lg: 6 }}>
              <Grid item xs={0} sm={8} md={9} lg={9} />
              <Grid item xs={12} sm={4} md={3} lg={3}>
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
                <MyCalendar />
              </Grid>
            </Grid>
          </Paper>
        </Card>
      </Container>
    </>
  );
}