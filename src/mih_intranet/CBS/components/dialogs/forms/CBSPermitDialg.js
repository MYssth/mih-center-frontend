/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Autocomplete,
  Stack,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import thLocale from 'date-fns/locale/th';
import { SubmtComp, SubmtERR, SubmtINC } from '../../../../components/dialogs/response';
import provinceList from '../../../../utils/ProvinceList';

let token = '';

function CBSPermitDialg({ openDialg, onCloseDialg, data }) {
  const [openFrmTm, setOpenFrmTm] = useState(false);
  const [openToDt, setOpenToDt] = useState(false);
  const [openToTm, setOpenToTm] = useState(false);

  const [reqName, setReqName] = useState('');

  const [id, setId] = useState('');
  const [grpId, setGrpId] = useState('');
  const [carType, setCarType] = useState([]);
  const [carTypeId, setCarTypeId] = useState('');
  const [carTypeName, setCarTypeName] = useState('');
  const [driver, setDriver] = useState([]);
  const [driverId, setDriverId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [place, setPlace] = useState('');
  const [province, setProvince] = useState('');
  const [paxAmt, setPaxAmt] = useState('');
  const [telNo, setTelNo] = useState('');
  const [detail, setDetail] = useState('');

  const [dept, setDept] = useState([]);
  const [deptId, setDeptId] = useState('');
  const [deptName, setDeptName] = useState('');

  const [car, setCar] = useState([]);
  const [filteredCar, setFilteredCar] = useState([]);
  const [carId, setCarId] = useState('');
  const [carName, setCarName] = useState('');

  const [duplicate, setDuplicate] = useState('');
  const [dupDept, setDupDept] = useState('');

  const [submitINC, setSubmitINC] = useState(false);
  const [submitERR, setSubmitERR] = useState(false);
  const [submitComp, setSubmitComp] = useState(false);

  useEffect(() => {
    token = jwtDecode(localStorage.getItem('token'));

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_himsPort}/api/hims/getalldept`)
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

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getcartype`)
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

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getdriver`)
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
  }, []);

  useEffect(() => {
    if (openDialg) {
      fetchCarData(data.from_date, data.to_date, data.car_type_id);

      const tmpFrDate = new Date(
        `${parseInt(new Date(data.from_date).getUTCMonth(), 10) + 1} ${new Date(
          data.from_date
        ).getUTCDate()} ${new Date(data.from_date).getUTCFullYear()} ${new Date(
          data.from_date
        ).getUTCHours()}:${new Date(data.from_date).getUTCMinutes()}:00 GMT+0700 (เวลาอินโดจีน)`
      );
      const tmpToDate = new Date(
        `${parseInt(new Date(data.to_date).getUTCMonth(), 10) + 1} ${new Date(data.to_date).getUTCDate()} ${new Date(
          data.to_date
        ).getUTCFullYear()} ${new Date(data.to_date).getUTCHours()}:${new Date(
          data.to_date
        ).getUTCMinutes()}:00 GMT+0700 (เวลาอินโดจีน)`
      );
      setFromDate(tmpFrDate);
      setFromTime(tmpFrDate);
      setToDate(tmpToDate);
      setToTime(tmpToDate);
      setId(data.id);
      setGrpId(data.grp_id);
      setPaxAmt(data.pax_amt);
      setTelNo(data.tel_no);
      setPlace(data.place);
      setProvince(data.province);
      setCarTypeId(data.car_type_id);
      setCarTypeName(data.car_type_name);
      setDriverId(data.drv_pid);
      setDriverName(data.drv_name);
      setDetail(data.detail);
      setCarId(data.car_id);
      setCarName(data.car_id ? `${data.car_reg_no} ${data.car_name}` : 'ไม่ระบุ');
      setDeptId(data.dept_id);
      setDeptName(data.dept_name);

      setReqName(data.req_name);
    }
  }, [openDialg]);

  useEffect(() => {
    carFilter(car, carTypeId);
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
    fetchCarData(tmpFrDate, tmpToDate, carTypeId);
  }, [fromDate, fromTime, toDate, toTime]);

  async function fetchCarData(fDate, tDate, typeId) {
    fetch(
      `http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/getfilteredcar/${fDate}/${tDate}/${data.id}`
    )
      .then((response) => response.json())
      .then((result) => {
        setCar(result);
        carFilter(result, typeId);
        setDuplicate(result.find((o) => o.type_id === data.car_type_id).duplicate);
        setDupDept(result.find((o) => o.type_id === data.car_type_id).dept_name);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('cancelled');
        } else {
          console.error('Error:', error);
        }
      });
  }

  async function carFilter(tempCar, typeId) {
    await setFilteredCar(
      Array.isArray(tempCar) ? tempCar.filter((carData) => carData.type_id === (typeId ?? data.car_type_id)) : []
    );
  }

  const handlePermit = () => {
    const jsonData = {
      id: id,
      grp_id: grpId,
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
      pax_amt: paxAmt,
      tel_no: telNo,
      detail: detail,
      permit_pid: token.personnel_id,
      permit_name: token.personnel_name,
      drv_pid: driverId,
      drv_name: driverName,
      car_type_id: carTypeId,
      car_type_name: carTypeName,
      car_id: carId,
      car_name: carName,
      dept_id: deptId,
      dept_name: deptName,
      req_name: reqName,
    };

    if (
      jsonData.from_date === null ||
      jsonData.to_date === null ||
      jsonData.place === '' ||
      jsonData.province === '' ||
      jsonData.pax_amt === '' ||
      jsonData.detail === '' ||
      jsonData.drv_pid === '0' ||
      jsonData.car_type_id === 0 ||
      jsonData.car_id === 0 ||
      jsonData.dept_id === ''
    ) {
      setSubmitINC(true);
      return;
    }
    console.log(jsonData);

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/permitbook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  const handleSavChg = () => {
    const jsonData = {
      id: id,
      grp_id: grpId,
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
      pax_amt: paxAmt,
      tel_no: telNo,
      detail: detail,
      drv_pid: driverId,
      drv_name: driverName,
      car_type_id: carTypeId,
      car_type_name: carTypeName,
      car_id: carId,
      car_name: carName,
      dept_id: deptId,
      dept_name: deptName,
    };

    if (
      jsonData.from_date === null ||
      jsonData.to_date === null ||
      jsonData.place === '' ||
      jsonData.province === '' ||
      jsonData.pax_amt === '' ||
      jsonData.detail === '' ||
      jsonData.drv_pid === '0' ||
      jsonData.car_type_id === 0 ||
      jsonData.car_id === 0 ||
      jsonData.dept_id === ''
    ) {
      setSubmitINC(true);
      return;
    }

    fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/savchgsched`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        <DialogTitle>อนุมัติคำขอเลขที่ {data?.id}</DialogTitle>
        <DialogContent>
          <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
            <Grid item md={12}>
              <Typography variant="h6">ผู้ขอใช้รถ: {data?.req_name}</Typography>
            </Grid>
            <Grid item md={12}>
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
            <Grid item md={12}>
              <label className="form-label">วันที่-เวลา</label>
              <br />
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                <Stack direction="row" spacing={1}>
                  <DatePicker
                    onAccept={() => {
                      setOpenFrmTm(true);
                      setCarId(0);
                      setCarName('ไม่ระบุ');
                      setDuplicate(null);
                      setDupDept(null);
                    }}
                    disabled={grpId}
                    maxDate={toDate}
                    label="เลือกวันที่ไป"
                    format="dd/MM/yyyy"
                    value={fromDate ?? ''}
                    onChange={(newValue) => setFromDate(newValue)}
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
                    onAccept={() => {
                      setOpenToDt(true);
                      setCarId(0);
                      setCarName('ไม่ระบุ');
                      setDuplicate(null);
                      setDupDept(null);
                    }}
                    disabled={grpId}
                    ampm={false}
                    // minutesStep="15"
                    value={fromTime ?? ''}
                    onChange={(newValue) => setFromTime(newValue)}
                    sx={{
                      '& fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: fromTime ? 'green' : 'red',
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item md={12}>
              <label className="form-label">ถึงวันที่-เวลา</label>
              <br />
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                <Stack direction="row" spacing={1}>
                  <DatePicker
                    open={openToDt}
                    onOpen={() => setOpenToDt(true)}
                    onClose={() => setOpenToDt(false)}
                    onAccept={() => {
                      setOpenToTm(true);
                      setCarId(0);
                      setCarName('ไม่ระบุ');
                      setDuplicate(null);
                      setDupDept(null);
                    }}
                    disabled={grpId}
                    minDate={fromDate}
                    label="เลือกวันที่กลับ"
                    format="dd/MM/yyyy"
                    value={toDate ?? ''}
                    onChange={(newValue) => setToDate(newValue)}
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
                    onAccept={() => {
                      setCarId(0);
                      setCarName('ไม่ระบุ');
                      setDuplicate(null);
                      setDupDept(null);
                    }}
                    label="เลือกเวลากลับ"
                    disabled={grpId}
                    ampm={false}
                    timeStep={15}
                    value={toTime ?? ''}
                    onChange={(newValue) => setToTime(newValue)}
                    sx={{
                      '& fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: toTime ? 'green' : 'red',
                      },
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} xs={12}>
              <label className="form-label">จำนวนผู้โดยสาร</label>
              <br />
              <TextField
                fullWidth
                label="จำนวนผู้โดยสาร"
                value={paxAmt ?? ''}
                onChange={(event) => {
                  setPaxAmt(event.target.value);
                }}
                sx={{
                  '& input:valid + fieldset': {
                    borderColor: paxAmt ? 'green' : 'red',
                  },
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <label className="form-label">เบอร์โทรศัพท์ติดต่อ</label>
              <br />
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์ติดต่อ"
                value={telNo ?? ''}
                onChange={(event) => {
                  setTelNo(event.target.value);
                }}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <label className="form-label">สถานที่</label>
              <br />
              <TextField
                fullWidth
                label="สถานที่"
                disabled={grpId}
                value={place ?? ''}
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
            <Grid item md={6} xs={12}>
              <label className="form-label">จังหวัด</label>
              <br />
              <Autocomplete
                options={provinceList}
                fullWidth
                disabled={grpId}
                value={province ?? ''}
                isOptionEqualToValue={(option, value) => option.label === value}
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
            <Grid item md={6} xs={12}>
              <label className="form-label">พนักงานขับรถ</label>
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
                      borderColor: driverId !== '0' ? 'green' : 'red',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <label className="form-label">ประเภทรถ</label>
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
            <Grid item md={6} xs={12}>
              <label className="form-label">รถที่ให้ใช้</label>
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
                disabled={!carTypeId || !fromDate || !fromTime || !toDate || !toTime}
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
            {duplicate && duplicate !== id && !grpId ? (
              <Grid item xs={12}>
                <Typography variant="subtitle1" color={'error.main'} textAlign={'center'}>
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
              <label className="form-label">รายละเอียด</label>
              <TextField
                label="รายละเอียด"
                fullWidth
                value={detail ?? ''}
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box alignItems="flex-start">
            <Button variant="contained" onClick={() => handleSavChg()}>
              บันทึกข้อมูล
            </Button>
          </Box>
          <div style={{ flex: '1 0 0' }} />
          <Button onClick={handlePermit} disabled={duplicate && duplicate !== id && !grpId} className="btn btn-success">
            อนุมัติคำขอใช้รถ
          </Button>
          <Button onClick={onCloseDialg}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CBSPermitDialg;
