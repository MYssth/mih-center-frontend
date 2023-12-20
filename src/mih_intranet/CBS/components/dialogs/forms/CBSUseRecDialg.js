/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  TextField,
  Stack,
  Box,
  Autocomplete,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import thLocale from 'date-fns/locale/th';
import { SubmtComp, SubmtERR, SubmtINC } from '../../../../components/dialogs/response';
import CBSDenyDialg from './CBSDenyDialg';

const moment = require('moment');

moment.locale('en');
let token = '';
let rToken = '';

function CBSUseRecDialg({ openDialg, onCloseDialg, data }) {
  const [submitINC, setSubmitINC] = useState(false);
  const [submitComp, setSubmitComp] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);

  const [openDepTm, setOpenDepTm] = useState(false);
  const [openArrDt, setOpenArrDt] = useState(false);
  const [openArrTm, setOpenArrTm] = useState(false);

  const [id, setId] = useState('');
  const [grpId, setGrpId] = useState('');
  const [depDate, setDepDate] = useState(null);
  const [depTm, setDepTm] = useState(null);
  const [depMi, setDepMi] = useState('');
  const [arrDate, setArrDate] = useState(null);
  const [arrTm, setArrTm] = useState(null);
  const [arrMi, setArrMi] = useState('');

  const [denyDialg, setDenyDialg] = useState(false);

  const [driver, setDriver] = useState([]);
  const [driverId, setDriverId] = useState('');
  const [driverName, setDriverName] = useState('');

  const [carType, setCarType] = useState([]);
  const [carTypeId, setCarTypeId] = useState('');
  const [carTypeName, setCarTypeName] = useState('');

  const [car, setCar] = useState([]);
  const [filteredCar, setFilteredCar] = useState([]);
  const [carId, setCarId] = useState('');
  const [carName, setCarName] = useState('');

  const [duplicate, setDuplicate] = useState('');
  const [dupDept, setDupDept] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      token = jwtDecode(localStorage.getItem('token'));
      rToken = localStorage.getItem('token');

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
    }
  }, []);

  useEffect(() => {
    carFilter(car);
  }, [carTypeId]);

  useEffect(() => {
    const tmpFrDate = `${moment.utc(depDate).format('YYYY-MM-DD')}T${moment.utc(depTm).format('HH:mm')}:00.000Z`;
    const tmpToDate = `${moment.utc(arrDate).format('YYYY-MM-DD')}T${moment.utc(arrTm).format('HH:mm')}:00.000Z`;
    fetchCarData(tmpFrDate, tmpToDate);
  }, [depDate, depTm, arrDate, arrTm]);

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
    await setFilteredCar(tempCar.filter((carData) => carData.type_id === carTypeId));
  }

  let tmpFrDate;
  let tmpToDate;
  let tmpDepDate;
  let tmpArrDate;

  useEffect(() => {
    async function fetchGroupData() {
      if (data.grp_id) {
        console.log('group!!');
        await fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/getschedbygrpid/${data.grp_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${rToken}`,
          },
        })
          .then((response) => response.json())
          .then((resultData) => {
            tmpFrDate = moment.utc(resultData.from_date);
            tmpToDate = moment.utc(resultData.to_date);
            tmpDepDate = moment.utc(resultData.dep_date);
            tmpArrDate = moment.utc(resultData.arr_date);
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              console.log('cancelled');
            } else {
              console.error('Error:', error);
            }
          });
      } else {
        tmpFrDate = moment.utc(data.from_date);
        tmpToDate = moment.utc(data.to_date);
        tmpDepDate = moment.utc(data.dep_date);
        tmpArrDate = moment.utc(data.arr_date);
      }
      setCarTypeId(data.car_type_id);
      setCarTypeName(data.car_type_name);
      setCarId(data.car_id);
      setCarName(`${data.car_reg_no} ${data.car_name}`);
      setDriverId(data.drv_pid);
      setDriverName(data.drv_name);
      setId(data.id);
      setGrpId(data.grp_id);
      setDepDate(data.dep_date ? tmpDepDate : tmpFrDate);
      setDepTm(data.dep_date ? tmpDepDate : tmpFrDate);
      setArrDate(data.arr_date ? tmpArrDate : tmpToDate);
      setArrTm(data.arr_date ? tmpArrDate : tmpToDate);
      setDepMi(data.dep_mi);
      setArrMi(data.arr_mi);
    }

    if (openDialg) {
      fetchGroupData();
    }
  }, [openDialg]);

  const handleUseRec = () => {
    const jsonData = {
      id: id,
      grp_id: grpId,
      rec_pid: token.psn_id,
      dep_date: `${moment.utc(depDate).format('YYYY-MM-DD')}T${moment.utc(depTm).format('HH:mm')}:00.000Z`,
      dep_mi: depMi,
      arr_date: `${moment.utc(arrDate).format('YYYY-MM-DD')}T${moment.utc(arrTm).format('HH:mm')}:00.000Z`,
      arr_mi: arrMi,
      car_type_id: carTypeId,
      car_id: carId,
      drv_pid: driverId,
    };

    if (jsonData.drv_pid === 0 || jsonData.car_type_id === 0 || jsonData.car_id === 0) {
      setSubmitINC(true);
      return;
    }

    fetch(`${process.env.REACT_APP_host}${process.env.REACT_APP_cbsPort}/userecbook`, {
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
  };

  return (
    <>
      <CBSDenyDialg
        openDialg={denyDialg}
        onCloseDialg={() => {
          setDenyDialg(false);
          onCloseDialg();
        }}
        data={data}
      />
      <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
      <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
      <SubmtComp
        openDialg={submitComp}
        onCloseDialg={() => {
          setSubmitComp(false);
          onCloseDialg();
        }}
      />

      <Dialog open={openDialg} onClose={onCloseDialg}>
        <DialogTitle>บันทึกการใช้รถคำขอเลขที่ {data?.id}</DialogTitle>
        <DialogContent>
          <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
            <Grid item md={12}>
              <Stack direction="row">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  แผนก:
                </Typography>
                {data?.dept_name}
              </Stack>
              <Stack direction="row">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  สถานที่:
                </Typography>
                {data?.place}
              </Stack>
              <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }} sx={{ p: 1 }}>
                <Grid item xs={12}>
                  {/* <Typography variant="subtitle1" sx={{ mr: 1 }}>ประเภทรถ:</Typography> */}
                  <Autocomplete
                    value={carTypeName ?? ''}
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
                    renderInput={(params) => <TextField label="ประเภทรถ" {...params} />}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: carTypeId ? 'green' : 'red',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <Typography variant="subtitle1" sx={{ mr: 1 }}>รุ่นทะเบียนรถ:</Typography>{`${data?.car_reg_no} ${data?.car_name}`} */}
                  <Autocomplete
                    value={carName ?? ''}
                    onChange={(event, newValue) => {
                      setCarName(newValue);
                      if (newValue !== null) {
                        setCarId(car.find((o) => `${o.reg_no} ${o.name}` === newValue).id);
                        setDuplicate(car.find((o) => `${o.reg_no} ${o.name}` === newValue).duplicate);
                        setDupDept(car.find((o) => `${o.reg_no} ${o.name}` === newValue).dept_name);
                      } else {
                        setDuplicate(null);
                        setDupDept(null);
                        setCarId(0);
                        setCarName('ไม่ระบุ');
                      }
                    }}
                    disabled={!carTypeId || !depDate || !depTm || !arrDate || !arrTm}
                    id="controllable-states-car-type-id"
                    options={Object.values(filteredCar).map((option) => `${option.reg_no} ${option.name}`)}
                    fullWidth
                    renderInput={(params) => <TextField label="รถที่ให้ใช้" {...params} />}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: carId ? 'green' : 'red',
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/* <Typography variant="subtitle1" sx={{ mr: 1 }}>ผู้ขับรถ:</Typography>{data?.drv_name} */}
                  <Autocomplete
                    value={driverName ?? ''}
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
                    renderInput={(params) => <TextField label="พนักงานขับรถ" {...params} />}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: driverId !== 0 ? 'green' : 'red',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              {duplicate ? (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color={'error.main'}>
                    {' '}
                    รถคันนี้มีการใช้งานซ้ำกับคำขอเลขที่ {duplicate}
                    <br />
                    จาก {dupDept}{' '}
                  </Typography>
                </Grid>
              ) : (
                ''
              )}
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2} sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, borderColor: 'grey.500' }}>
                <Typography variant="subtitle1" textAlign={'center'}>
                  รถออก
                </Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale={thLocale}>
                  <DatePicker
                    fullWidth
                    onAccept={() => {
                      setOpenDepTm(true);
                    }}
                    maxDate={arrDate}
                    label="วันที่รถออก"
                    format="DD/MM/YYYY"
                    value={depDate ?? ''}
                    onChange={(newValue) => {
                      setDepDate(newValue);
                    }}
                  />
                  <TimePicker
                    fullWidth
                    label="เวลารถออก"
                    open={openDepTm}
                    onOpen={() => setOpenDepTm(true)}
                    onClose={() => setOpenDepTm(false)}
                    onAccept={() => {
                      setOpenArrDt(true);
                    }}
                    ampm={false}
                    // minutesStep="15"
                    value={depTm ?? ''}
                    onChange={(newValue) => setDepTm(newValue)}
                  />
                </LocalizationProvider>
                <TextField
                  label="เลขไมล์ตอนรถออก"
                  fullWidth
                  value={depMi ?? ''}
                  onChange={(event) => {
                    setDepMi(event.target.value);
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={2} sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, borderColor: 'grey.500' }}>
                <Typography variant="subtitle1" textAlign={'center'}>
                  รถเข้า
                </Typography>
                <LocalizationProvider dateAdapter={AdapterMoment} locale={thLocale}>
                  <DatePicker
                    fullWidth
                    open={openArrDt}
                    onOpen={() => setOpenArrDt(true)}
                    onClose={() => setOpenArrDt(false)}
                    onAccept={() => {
                      setOpenArrTm(true);
                    }}
                    minDate={depDate}
                    label="วันที่รถเข้า"
                    format="DD/MM/YYYY"
                    value={arrDate ?? ''}
                    onChange={(newValue) => setArrDate(newValue)}
                  />
                  <TimePicker
                    fullWidth
                    open={openArrTm}
                    onOpen={() => setOpenArrTm(true)}
                    onClose={() => setOpenArrTm(false)}
                    label="เวลารถเข้า"
                    ampm={false}
                    timeStep={15}
                    value={arrTm ?? ''}
                    onChange={(newValue) => setArrTm(newValue)}
                  />
                </LocalizationProvider>
                <TextField
                  label="เลขไมล์ตอนรถเข้า"
                  fullWidth
                  value={arrMi ?? ''}
                  onChange={(event) => {
                    setArrMi(event.target.value);
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" textAlign={'center'}>
                รวมระยะทาง {arrMi && depMi ? arrMi - depMi : 0} กิโลเมตร
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box alignItems="flex-start">
            <Button onClick={() => setDenyDialg(true)} className="btn btn-danger">
              ยกเลิกคำขอ
            </Button>
          </Box>
          <div style={{ flex: '1 0 0' }} />
          <Button onClick={handleUseRec} className="btn btn-success">
            บันทึกการใช้รถ
          </Button>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CBSUseRecDialg;
