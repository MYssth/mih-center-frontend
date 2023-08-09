/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/button-has-type */
/* eslint-disable object-shorthand */
/* eslint-disable jsx-a11y/label-has-associated-control */
// import React from 'react'
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { DataGrid, gridClasses, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Grid, Stack, TextField, Autocomplete, styled, alpha, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import thLocale from 'date-fns/locale/th';
import MainHeader from '../components/MainHeader';
import CBSSidebar from './components/nav/CBSSidebar';
import { SubmtComp, SubmtERR, SubmtINC } from '../components/dialogs/response';
import provinceList from '../utils/ProvinceList';
import { CBSDenyDialg } from './components/dialogs/forms';
import { CBSTaskDetail } from './components/dialogs/taskdetails';

let token = '';
const rToken = localStorage.getItem('token');

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

function CBSBooking() {
  const columns = [
    {
      field: 'action',
      headerName: '',
      sortable: false,
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        const handleDeny = () => {
          setDenyData(params.row);
          setDenyDialg(true);
        };

        return (
          <Stack direction="row" spacing={1}>
            {params.row.status_id === 1 ? (
              <button type="submit" className="btn btn-danger" onClick={handleDeny}>
                ยกเลิก
              </button>
            ) : (
              ''
            )}
          </Stack>
        );
      },
    },
    {
      field: 'id',
      headerName: 'เลขที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'from_date',
      headerName: 'วันที่ไป',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.from_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.from_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.from_date).getUTCFullYear()}`,
    },
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
      field: 'to_date',
      headerName: 'วันที่กลับ',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) =>
        `${String(new Date(params.row.to_date).getUTCDate()).padStart(2, '0')}/${String(
          parseInt(new Date(params.row.to_date).getUTCMonth(), 10) + 1
        ).padStart(2, '0')}/${new Date(params.row.to_date).getUTCFullYear()}`,
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
      field: 'car_type_name',
      headerName: 'ประเภทรถ',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'place',
      headerName: 'สถานที่',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'status_id',
      headerName: 'สถานะ',
      flex: 1,
      minWidth: 100,
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

  function QuickSearchToolbar() {
    return (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Box>
    );
  }

  const navigate = useNavigate();

  const [openFrmTm, setOpenFrmTm] = useState(false);
  const [openToDt, setOpenToDt] = useState(false);
  const [openToTm, setOpenToTm] = useState(false);

  const [open, setOpen] = useState(false);
  const [submitINC, setSubmitINC] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);
  const [submitComp, setSubmitComp] = useState(false);

  const [dept, setDept] = useState([]);
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');

  const [carType, setCarType] = useState([]);
  const [carTypeId, setCarTypeId] = useState(0);
  const [carTypeName, setCarTypeName] = useState('ไม่ระบุ');

  const [driver, setDriver] = useState([]);
  const [driverId, setDriverId] = useState(0);
  const [driverName, setDriverName] = useState('ไม่ระบุ');

  const [fromDate, setFromDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [toTime, setToTime] = useState(null);

  const [place, setPlace] = useState('');
  const [province, setProvince] = useState({ label: 'มุกดาหาร' });
  const [paxAmt, setPaxAmt] = useState('');
  const [telNo, setTelNo] = useState('');
  const [detail, setDetail] = useState('');

  const [car, setCar] = useState([]);
  const [filteredCar, setFilteredCar] = useState([]);
  const [carId, setCarId] = useState(0);
  const [carName, setCarName] = useState('ไม่ระบุ');

  const [sched, setSched] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const [duplicate, setDuplicate] = useState('');
  const [dupDept, setDupDept] = useState('');

  const [denyDialg, setDenyDialg] = useState(false);
  const [denyData, setDenyData] = useState([]);

  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [focusTask, setFocusTask] = useState('');

  useEffect(() => {
    token = jwtDecode(localStorage.getItem('token'));

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_himsPort}/getpsndatabyid/${token.personnel_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDeptId(data.dept_id);
        setDeptName(data.dept_name);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_himsPort}/getalldept`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDept(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getcartype`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCarType(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getdriver`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDriver(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getcar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCar(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });

    refreshTable();
  }, []);

  function refreshTable() {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getschedbyreqid/${token.personnel_id}`, {
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

  useEffect(() => {
    carFilter(car);
  }, [carTypeId]);

  useEffect(() => {
    const tmpFrDate = `${fromDate?.getFullYear()}-${String(parseInt(fromDate?.getMonth(), 10) + 1).padStart(
      2,
      '0'
    )}-${String(fromDate?.getDate()).padStart(2, '0')}T${String(fromTime?.getHours()).padStart(2, '0')}:${String(
      fromTime?.getMinutes()
    ).padStart(2, '0')}:00.000Z`;
    const tmpToDate = `${toDate?.getFullYear()}-${String(parseInt(toDate?.getMonth(), 10) + 1).padStart(
      2,
      '0'
    )}-${String(toDate?.getDate()).padStart(2, '0')}T${String(toTime?.getHours()).padStart(2, '0')}:${String(
      toTime?.getMinutes()
    ).padStart(2, '0')}:00.000Z`;
    fetchCarData(tmpFrDate, tmpToDate);
  }, [fromDate, fromTime, toDate, toTime]);

  async function fetchCarData(fDate, tDate) {
    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getfilteredcar/${fDate}/${tDate}/0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${rToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCar(data);
        carFilter(data);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }

  async function carFilter(tempCar) {
    // await setFilteredCar(Array.isArray(tempCar) ? tempCar.filter(carData => carData.type_id === (carTypeId)) : []);
    await setFilteredCar(tempCar.filter((carData) => carData.type_id === carTypeId));
  }

  function handleSubmit() {
    const jsonData = {
      dept_id: deptId,
      dept_name: deptName,
      from_date: `${fromDate?.getFullYear()}-${String(parseInt(fromDate?.getMonth(), 10) + 1).padStart(
        2,
        '0'
      )}-${String(fromDate?.getDate()).padStart(2, '0')}T${String(fromTime?.getHours()).padStart(2, '0')}:${String(
        fromTime?.getMinutes()
      ).padStart(2, '0')}:00.000Z`,
      to_date: `${toDate?.getFullYear()}-${String(parseInt(toDate?.getMonth(), 10) + 1).padStart(2, '0')}-${String(
        toDate?.getDate()
      ).padStart(2, '0')}T${String(toTime?.getHours()).padStart(2, '0')}:${String(toTime?.getMinutes()).padStart(
        2,
        '0'
      )}:00.000Z`,
      place: place,
      province: province,
      pax_amt: paxAmt && paxAmt !== '-' ? paxAmt : 0,
      tel_no: telNo,
      detail: detail,
      req_pid: token.personnel_id,
      req_name: token.personnel_name,
      drv_pid: driverId,
      drv_name: driverName,
      car_type_id: carTypeId,
      car_type_name: carTypeName,
      car_id: carId,
      car_name: carName,
    };

    if (
      jsonData.from_date === null ||
      jsonData.to_date === null ||
      jsonData.place === '' ||
      jsonData.province === '' ||
      jsonData.pax_amt === '' ||
      jsonData.detail === '' ||
      jsonData.dept_id === ''
    ) {
      setSubmitINC(true);
      return;
    }

    // console.log(jsonData);

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/carbook`, {
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
          setSubmitComp(true);
        } else {
          setSubmitERR(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setSubmitERR(true);
      });
  }

  return (
    <>
      <Helmet>
        <title> ระบบขอใช้รถ | {headSname} </title>
      </Helmet>
      <div>
        <CBSTaskDetail openDialg={openTaskDetail} onCloseDialg={() => setOpenTaskDetail(false)} data={focusTask} />

        <CBSDenyDialg
          openDialg={denyDialg}
          onCloseDialg={() => {
            setDenyDialg(false);
            refreshTable();
          }}
          data={denyData}
        />
        <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
        <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
        <SubmtComp
          openDialg={submitComp}
          onCloseDialg={() => {
            setSubmitComp(false);
            navigate('/cbsdashboard', { replace: true });
          }}
        />

        <MainHeader onOpenNav={() => setOpen(true)} />
        <CBSSidebar name="booking" openNav={open} onCloseNav={() => setOpen(false)} />

        {/* <!-- ======= Main ======= --> */}
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>ขอใช้รถ</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item my-2">
                  <a href="/intranet">หน้าหลัก</a>
                </li>
                <li className="breadcrumb-item my-2">
                  <a href="/cbsdashboard">หน้าหลักระบบขอใช้รถ</a>
                </li>
                <li className="breadcrumb-item my-2">ขอใช้รถ</li>
              </ol>
            </nav>
          </div>
          {/* <!-- End Page Title --> */}
          <section className="section">
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body pt-3">
                    {/* <!-- Bordered Tabs --> */}
                    <ul className="nav nav-tabs nav-tabs-bordered">
                      <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#carbooking-form">
                          ขอใช้รถ
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#carbooking-list">
                          รายการขอใช้รถ
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content pt-3">
                      <div className="tab-pane fade show active profile-overview pt-2" id="carbooking-form">
                        <h5 className="card-title">แบบฟอร์มขอใช้รถ</h5>

                        <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                          <Grid item xs={12} md={4}>
                            <label className="form-label">แผนก</label>
                            <Autocomplete
                              options={Object.values(dept).map((option) => option.dept_name)}
                              fullWidth
                              value={deptName}
                              onChange={(event, newValue) => {
                                setDeptName(newValue);
                                if (newValue !== null) {
                                  setDeptId(dept.find((o) => o.dept_name === newValue).dept_id);
                                } else {
                                  setDeptId('');
                                }
                              }}
                              renderInput={(params) => <TextField label="แผนก" {...params} />}
                              sx={{
                                '& .MuiAutocomplete-inputRoot': {
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: deptId ? 'green' : 'red',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item md={3} xs={12}>
                            <label className="form-label">เบอร์โทรศัพท์ติดต่อ</label>
                            <br />
                            <TextField
                              fullWidth
                              label="เบอร์โทรศัพท์ติดต่อ"
                              value={telNo}
                              onChange={(event) => {
                                setTelNo(event.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item xs={0} md={5} />
                          <Grid item md={4}>
                            <label className="form-label">วันที่-เวลา</label>
                            <br />
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                              <Stack direction="row" spacing={1}>
                                <DatePicker
                                  onAccept={() => setOpenFrmTm(true)}
                                  maxDate={toDate}
                                  label="เลือกวันที่ไป"
                                  format="dd/MM/yyyy"
                                  value={fromDate}
                                  onChange={(newValue) => {
                                    setFromDate(newValue);
                                    setCarId(0);
                                    setCarName('ไม่ระบุ');
                                    setDuplicate(null);
                                    setDupDept(null);
                                  }}
                                  sx={{
                                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                                      borderColor: fromDate ? 'green' : 'red',
                                    },
                                  }}
                                />
                                <TimePicker
                                  label="เลือกเวลาไป"
                                  open={openFrmTm}
                                  onOpen={() => setOpenFrmTm(true)}
                                  onClose={() => setOpenFrmTm(false)}
                                  onAccept={() => setOpenToDt(true)}
                                  ampm={false}
                                  // minutesStep="15"
                                  value={fromTime}
                                  onChange={(newValue) => {
                                    setFromTime(newValue);
                                    setCarId(0);
                                    setCarName('ไม่ระบุ');
                                    setDuplicate(null);
                                    setDupDept(null);
                                  }}
                                  sx={{
                                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                                      borderColor: fromTime ? 'green' : 'red',
                                    },
                                  }}
                                />
                              </Stack>
                            </LocalizationProvider>
                          </Grid>
                          <Grid item md={4}>
                            <label className="form-label">ถึงวันที่-เวลา</label>
                            <br />
                            <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                              <Stack direction="row" spacing={1}>
                                <DatePicker
                                  open={openToDt}
                                  onOpen={() => setOpenToDt(true)}
                                  onClose={() => setOpenToDt(false)}
                                  onAccept={() => setOpenToTm(true)}
                                  minDate={fromDate}
                                  label="เลือกวันที่กลับ"
                                  format="dd/MM/yyyy"
                                  value={toDate}
                                  onChange={(newValue) => {
                                    setToDate(newValue);
                                    setCarId(0);
                                    setCarName('ไม่ระบุ');
                                    setDuplicate(null);
                                    setDupDept(null);
                                  }}
                                  sx={{
                                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                                      borderColor: toDate ? 'green' : 'red',
                                    },
                                  }}
                                />
                                <TimePicker
                                  open={openToTm}
                                  onOpen={() => setOpenToTm(true)}
                                  onClose={() => setOpenToTm(false)}
                                  label="เลือกเวลากลับ"
                                  ampm={false}
                                  timeStep={15}
                                  value={toTime}
                                  onChange={(newValue) => {
                                    setToTime(newValue);
                                    setCarId(0);
                                    setCarName('ไม่ระบุ');
                                    setDuplicate(null);
                                    setDupDept(null);
                                  }}
                                  sx={{
                                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                                      borderColor: toTime ? 'green' : 'red',
                                    },
                                  }}
                                />
                              </Stack>
                            </LocalizationProvider>
                            <div className="invalid-feedback">กรุณาระบุวันที่-เวลา</div>
                          </Grid>
                          <Grid item xs={0} md={4} />
                          <Grid item md={2} xs={12}>
                            <label className="form-label">จำนวนผู้โดยสาร</label>
                            <br />
                            <TextField
                              fullWidth
                              label="จำนวนผู้โดยสาร"
                              value={paxAmt}
                              type="number"
                              onChange={(event) => {
                                setPaxAmt(event.target.value);
                              }}
                              // sx={{
                              //   '& input:valid + fieldset': {
                              //     borderColor: paxAmt ? 'green' : 'red',
                              //   },
                              // }}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <label className="form-label">สถานที่</label>
                            <br />
                            <TextField
                              fullWidth
                              label="สถานที่"
                              value={place}
                              onChange={(event) => {
                                setPlace(event.target.value);
                              }}
                              sx={{
                                '& input:valid + fieldset': {
                                  borderColor: place ? 'green' : 'red',
                                },
                              }}
                            />
                          </Grid>
                          <Grid item md={3} xs={12}>
                            <label className="form-label">จังหวัด</label>
                            <br />
                            <Autocomplete
                              options={provinceList}
                              fullWidth
                              value={province}
                              isOptionEqualToValue={(option, value) => option.label === value.label}
                              onChange={(event, newValue) => {
                                setProvince(newValue);
                              }}
                              renderInput={(params) => <TextField label="จังหวัด" {...params} />}
                              sx={{
                                '& .MuiAutocomplete-inputRoot': {
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: province ? 'green' : 'red',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={0} md={3} />
                          <Grid item md={3} xs={12}>
                            <label className="form-label">ประเภทรถ</label>
                            <Autocomplete
                              value={carTypeName}
                              onChange={(event, newValue) => {
                                setCarTypeName(newValue);
                                if (newValue !== null) {
                                  setCarTypeId(carType.find((o) => o.name === newValue).id);
                                } else {
                                  setCarTypeId(0);
                                  setCarTypeName('ไม่ระบุ');
                                }
                                setCarId(0);
                                setCarName('ไม่ระบุ');
                                setDuplicate(null);
                                setDupDept(null);
                              }}
                              id="controllable-states-car-type-id"
                              options={Object.values(carType).map((option) => option.name)}
                              fullWidth
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <label className="form-label">รถที่ขอใช้</label>
                            <Autocomplete
                              value={carName}
                              onChange={(event, newValue) => {
                                setCarName(newValue);
                                if (newValue !== null) {
                                  setCarId(filteredCar.find((o) => `${o.reg_no} ${o.name}` === newValue).id);
                                  setDuplicate(car.find((o) => `${o.reg_no} ${o.name}` === newValue).duplicate);
                                  setDupDept(car.find((o) => `${o.reg_no} ${o.name}` === newValue).dept_name);
                                } else {
                                  setDuplicate(null);
                                  setDupDept(null);
                                  setCarId(0);
                                  setCarName('ไม่ระบุ');
                                }
                              }}
                              disabled={!carTypeId || !fromDate || !fromTime || !toDate || !toTime}
                              id="controllable-states-car-type-id"
                              options={Object.values(filteredCar).map((option) => `${option.reg_no} ${option.name}`)}
                              fullWidth
                              renderInput={(params) => <TextField label="รถที่ขอใช้" {...params} />}
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <label className="form-label">พนักงานขับรถ</label>
                            <Autocomplete
                              value={driverName}
                              onChange={(event, newValue) => {
                                setDriverName(newValue);
                                if (newValue !== null) {
                                  setDriverId(driver.find((o) => o.name === newValue).id);
                                } else {
                                  setDriverId(0);
                                  setDriverName('ไม่ระบุ');
                                }
                              }}
                              id="controllable-states-driver-id"
                              options={Object.values(driver).map((option) => option.name)}
                              fullWidth
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Grid>
                          <Grid item xs={0} md={1} />
                          <Grid item xs={12}>
                            <label className="form-label">รายละเอียด</label>
                            <TextField
                              label="รายละเอียด"
                              fullWidth
                              value={detail}
                              onChange={(event) => {
                                setDetail(event.target.value);
                              }}
                              sx={{
                                '& input:valid + fieldset': {
                                  borderColor: detail ? 'green' : 'red',
                                },
                              }}
                            />
                          </Grid>
                          {duplicate ? (
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" color={'error.main'}>
                                {' '}
                                รถคันนี้มีการขอใช้งานซ้ำกับคำขอเลขที่ {duplicate}
                                <br />
                                จาก {dupDept}{' '}
                              </Typography>
                            </Grid>
                          ) : (
                            ''
                          )}
                          <Grid item md={12}>
                            <Stack direction="row" spacing={1}>
                              <button onClick={handleSubmit} className="btn btn-success">
                                บันทึก
                              </button>
                              {/* <button type="submit" className="btn btn-success">
                                                            พิมพ์
                                                        </button> */}
                              <button
                                type="submit"
                                className="btn btn-danger"
                                onClick={() => navigate('/cbsdashboard', { replace: true })}
                              >
                                ยกเลิก
                              </button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </div>

                      <div className="tab-pane fade profile-overview pt-2" id="carbooking-list">
                        <h5 className="card-title">รายการขอใช้รถ</h5>
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
                          hideFooterSelectedRowCount
                          // onCellDoubleClick={(params) => { handleOpenFocusTaskDialog(params.row) }}
                          // onCellDoubleClick={(params) => { showDetail(params.row, true) }}
                          onCellDoubleClick={(params) => {
                            setFocusTask(params.row);
                            setOpenTaskDetail(true);
                          }}
                          initialState={{
                            columns: {
                              columnVisibilityModel: {
                                // Hide columns status and traderName, the other columns will remain visible
                                // id: false,
                              },
                            },
                          }}
                          components={{ Toolbar: QuickSearchToolbar }}
                        />
                      </div>
                    </div>
                    {/* <!-- End Bordered Tabs --> */}
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

export default CBSBooking;
