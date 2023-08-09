/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable object-shorthand */
/* eslint-disable import/extensions */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { styled, alpha, Stack, Grid, ButtonGroup, Button, Typography } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import 'moment/locale/th';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './css/index.css';

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}`]: {
    // backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY + theme.palette.action.selectedOpacity),
        },
      },
    },
  },
}));

const headSname = `${localStorage.getItem('sname')} Center`;
const rToken = localStorage.getItem('token');

export default function CBSDashboard() {
  const columns = [
    {
      field: 'from_time',
      headerName: 'เวลาไป',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.from_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'to_time',
      headerName: 'เวลากลับ',
      flex: 1,
      minWidth: 60,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCHours()).padStart(2, '0')}:${String(
          new Date(params.row.to_date).getUTCMinutes()
        ).padStart(2, '0')}`,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'car_reg_no',
      headerName: 'ทะเบียนรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'status_id',
      headerName: 'สถานะ',
      flex: 1,
      minWidth: 70,
      renderCell: (params) =>
        params.row.status_id === 1 ? (
          <span className="badge rounded-pill bg-danger">ขอใช้รถ</span>
        ) : params.row.status_id === 2 ? (
          <span className="badge rounded-pill bg-warning">รออนุมัติ</span>
        ) : params.row.status_id === 3 ? (
          <span className="badge rounded-pill bg-success">อนุมัติ</span>
        ) : params.row.status_id === 4 ? (
          <span className="badge rounded-pill bg-primary">เสร็จสิ้น</span>
        ) : (
          <span className="badge rounded-pill bg-secondary">ยกเลิก</span>
        ),
    },
  ];

  const localizer = momentLocalizer(moment);

  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [sched, setSched] = useState([]);
  const [statCntr, setStatCntr] = useState({});

  const [USRLv, setUSRLv] = useState('');
  const [version, setVersion] = useState('');

  const [events, setEvents] = useState([]);

  const [showDate, setShowDate] = useState('Today');

  useEffect(() => {
    const token = jwtDecode(localStorage.getItem('token'));
    // setTokenData(token);

    setUSRLv(token.level_list.find((o) => o.mihapp_id === 'CBS').level_id);

    fetchSched(0);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getstatcntr`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStatCntr(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getversion`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setVersion(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getcalendarcntr`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const result = [];
        for (let i = 0; i < data.length; i += 1) {
          result.push({
            id: i,
            title: '',
            start: new Date(data[i].date),
            end: new Date(data[i].date),
            data: {
              request: data[i].request,
              permitRep: data[i].permitRep,
              permit: data[i].permit,
              complete: data[i].complete,
            },
          });
        }
        setEvents(result);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }, []);

  function fetchSched(date) {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getschedbydate/${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSched(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }

  const components = {
    event: (props) => {
      const isMobile = window.innerWidth < 768;
      return (
        <>
          <Stack direction={'row'} spacing={0.5} justifyContent="flex-end">
            {isMobile ? (
              <div style={{ background: 'blue', color: 'white', borderRadius: 5, textAlign: 'center', width: '100%' }}>
                {parseInt(props?.event?.data?.request, 10) +
                  parseInt(props?.event?.data?.permitRep, 10) +
                  parseInt(props?.event?.data?.permit, 10) +
                  parseInt(props?.event?.data?.complete, 10)}
              </div>
            ) : (
              <>
                {props?.event?.data?.request ? (
                  <div className="circle" style={{ background: 'red', color: 'white' }}>
                    {props?.event?.data?.request}
                  </div>
                ) : (
                  ''
                )}
                {props?.event?.data?.permitRep ? (
                  <div className="circle" style={{ background: 'orange', color: 'white' }}>
                    {props?.event?.data?.permitRep}
                  </div>
                ) : (
                  ''
                )}
                {props?.event?.data?.permit ? (
                  <div className="circle" style={{ background: 'green', color: 'white' }}>
                    {props?.event?.data?.permit}
                  </div>
                ) : (
                  ''
                )}
                {props?.event?.data?.complete ? (
                  <div className="circle" style={{ background: '#4154f1', color: 'white' }}>
                    {props?.event?.data?.complete}
                  </div>
                ) : (
                  ''
                )}
              </>
            )}
          </Stack>
        </>
      );
    },
    toolbar: (toolbar) => {
      const goToBack = () => {
        toolbar.date.setMonth(toolbar.date.getMonth() - 1);
        toolbar.onNavigate('prev');
      };

      const goToNext = () => {
        toolbar.date.setMonth(toolbar.date.getMonth() + 1);
        toolbar.onNavigate('next');
      };

      const goToCurrent = () => {
        const now = new Date();
        toolbar.date.setMonth(now.getMonth());
        toolbar.date.setYear(now.getFullYear());
        toolbar.onNavigate('current');
      };

      const date = () => {
        const date = moment(toolbar.date);
        return (
          <span>
            <b>{date.format('MMMM')}</b>
            <span> {date.format('YYYY')}</span>
          </span>
        );
      };

      return (
        <Grid container sx={{ mb: 1 }}>
          <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button onClick={goToBack} sx={{ borderColor: 'gray', color: 'black' }}>
                Back
              </Button>
              <Button onClick={goToCurrent} sx={{ borderColor: 'gray', color: 'black' }}>
                Today
              </Button>
              <Button onClick={goToNext} sx={{ borderColor: 'gray', color: 'black' }}>
                Next
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sm={4} className="center" sx={{ mb: 1 }}>
            <Typography variant="h5">{date()}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} className="right">
            <Stack direction={'row'} sx={{ mb: 0.5, display: { xs: 'none', sm: 'flex' } }}>
              <div className="circle" style={{ background: 'red' }} />
              &nbsp;ขอใช้รถ&nbsp;
              <div className="circle" style={{ background: 'orange' }} />
              &nbsp;รออนุมัติ
            </Stack>
            <Stack direction={'row'} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <div className="circle" style={{ background: 'green' }} />
              &nbsp;อนุมัติ&nbsp;
              <div className="circle" style={{ background: '#4154f1' }} />
              &nbsp;เสร็จสิ้น
            </Stack>
          </Grid>
        </Grid>
      );
    },
  };

  const MyCalendar = (props) => {
    const handleOnSelectEvent = (selEvent) => {
      setShowDate(
        selEvent.start.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      fetchSched(moment(selEvent.start).format('YYYY-MM-DD'));
    };

    return (
      <div>
        <Calendar
          views={['month']}
          // views={['month', 'agenda']}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          components={components}
          onSelectEvent={handleOnSelectEvent}
          style={{ height: 500 }}
        />
      </div>
    );
  };

  if (events.length === 0 || events === null) {
    console.log('fetch not complete');
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title> ระบบขอใช้รถ | {headSname} </title>
      </Helmet>

      <div>
        <MainHeader onOpenNav={() => setOpen(true)} />
        <CBSSidebar name="dashboard" openNav={open} onCloseNav={() => setOpen(false)} />
        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>หน้าหลักระบบขอใช้รถ - Car Booking Service (CBS) version: {version}</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item my-2">
                  <a href="../mih-intranet.html">หน้าหลัก</a>
                </li>
                <li className="breadcrumb-item my-2">หน้าหลักระบบขอใช้รถ</li>
              </ol>
            </nav>
          </div>
          {/* <!-- End Page Title --> */}
          <section className="section dashboard">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-xxl-3 col-md-6">
                    <a
                      className="nav-link collapsed"
                      href={
                        USRLv === 'CBS_ADMIN' || USRLv === 'CBS_MGR' || USRLv === 'CBS_RCV' || USRLv === 'CBS_DRV'
                          ? '/cbspermitreq'
                          : '#'
                      }
                    >
                      <div className="card info-card request-card">
                        <div className="card-body">
                          <h2 className="card-title">ขอใช้รถ | Request</h2>

                          <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                              <i className="bi bi-chat-left-text" />
                            </div>
                            <div className="d-flex align-items-end justify-content-end" style={{ width: '100%' }}>
                              <h1>{statCntr.request}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-xxl-3 col-md-6">
                    <a
                      className="nav-link collapsed"
                      href={USRLv === 'CBS_ADMIN' || USRLv === 'CBS_MGR' ? '/cbspermit' : '#'}
                    >
                      <div className="card info-card waitapprov-card">
                        <div className="card-body">
                          <h2 className="card-title">รออนุมัติ | Wait Approve</h2>

                          <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                              <i className="bi bi-journal-text" />
                            </div>
                            <div className="d-flex align-items-end justify-content-end" style={{ width: '100%' }}>
                              <h1>{statCntr.permitRep}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-xxl-3 col-md-6">
                    <a className="nav-link collapsed" href="/cbsuserec">
                      <div className="card info-card approv-card">
                        <div className="card-body">
                          <h2 className="card-title">อนุมัติ | Approve</h2>

                          <div className="d-flex align-items-center">
                            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                              <i className="bi bi-journal-check" />
                            </div>
                            <div className="d-flex align-items-end justify-content-end" style={{ width: '100%' }}>
                              <h1>{statCntr.permit}</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-xxl-3 col-md-6">
                    <div className="card info-card total-card">
                      <div className="card-body">
                        <h2 className="card-title">เสร็จสิ้น | Complete</h2>

                        <div className="d-flex align-items-center">
                          <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                            <i className="bi bi-check2-circle" />
                          </div>
                          <div className="d-flex align-items-end justify-content-end" style={{ width: '100%' }}>
                            <h1>{statCntr.complete}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8">
                <div className="card">
                  <div className="carlendar">
                    <div>
                      {/* <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                      /> */}
                      <MyCalendar />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">รายการขอใช้รถ | {showDate}</h5>

                    {/* <!-- Table with hoverable rows --> */}

                    <StripedDataGrid
                      autoHeight
                      getRowHeight={() => 'auto'}
                      sx={{
                        [`& .${gridClasses.cell}`]: {
                          py: 1,
                        },
                      }}
                      columns={columns}
                      rows={sched}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      rowsPerPageOptions={[10, 25, 100]}
                      hideFooterPagination
                      hideFooterSelectedRowCount
                      // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                      // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                      initialState={{
                        columns: {
                          columnVisibilityModel: {
                            // Hide columns status and traderName, the other columns will remain visible
                            // id: false,
                          },
                        },
                      }}
                      // components={{ Toolbar: QuickSearchToolbar }}
                    />
                    {/* <!-- End Table with hoverable rows --> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
