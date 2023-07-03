/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react';
import jwtDecode from "jwt-decode";
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
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import thLocale from "date-fns/locale/th";
import {
    SubmtComp,
    SubmtERR,
    SubmtINC,
} from '../../../../components/dialogs/response';
import CBSDenyDialg from './CBSDenyDialg';

let token = "";

function CBSUseRecDialg({ openDialg, onCloseDialg, data }) {

    const [submitINC, setSubmitINC] = useState(false);
    const [submitComp, setSubmitComp] = useState(false);
    const [submitERR, setSubmitERR] = useState(false);

    const [openDepTm, setOpenDepTm] = useState(false);
    const [openArrDt, setOpenArrDt] = useState(false);
    const [openArrTm, setOpenArrTm] = useState(false);

    const [id, setId] = useState('');
    const [depDate, setDepDate] = useState('');
    const [depTm, setDepTm] = useState('');
    const [depMi, setDepMi] = useState('');
    const [arrDate, setArrDate] = useState('');
    const [arrTm, setArrTm] = useState('');
    const [arrMi, setArrMi] = useState('');

    const [denyDialg, setDenyDialg] = useState(false);


    useEffect(() => {

        token = jwtDecode(localStorage.getItem('token'));

    }, []);

    useEffect(() => {
        if (openDialg) {
            const tmpFrDate = new Date(`${parseInt(new Date(data.from_date).getUTCMonth(), 10) + 1} ${new Date(data.from_date).getUTCDate()} ${new Date(data.from_date).getUTCFullYear()} ${new Date(data.from_date).getUTCHours()}:${new Date(data.from_date).getUTCMinutes()}:00 GMT+0700 (เวลาอินโดจีน)`);
            const tmpToDate = new Date(`${parseInt(new Date(data.to_date).getUTCMonth(), 10) + 1} ${new Date(data.to_date).getUTCDate()} ${new Date(data.to_date).getUTCFullYear()} ${new Date(data.to_date).getUTCHours()}:${new Date(data.to_date).getUTCMinutes()}:00 GMT+0700 (เวลาอินโดจีน)`);
            const tmpDepDate = new Date(`${parseInt(new Date(data.dep_date).getUTCMonth(), 10) + 1} ${new Date(data.dep_date).getUTCDate()} ${new Date(data.dep_date).getUTCFullYear()} ${new Date(data.dep_date).getUTCHours()}:${new Date(data.dep_date).getUTCMinutes()}:00 GMT+0700 (เวลาอินโดจีน)`);
            const tmpArrDate = new Date(`${parseInt(new Date(data.arr_date).getUTCMonth(), 10) + 1} ${new Date(data.arr_date).getUTCDate()} ${new Date(data.arr_date).getUTCFullYear()} ${new Date(data.arr_date).getUTCHours()}:${new Date(data.arr_date).getUTCMinutes()}:00 GMT+0700 (เวลาอินโดจีน)`);
            setId(data.id);
            setDepDate(data.dep_date ? tmpDepDate : tmpFrDate);
            setDepTm(data.dep_date ? tmpDepDate : tmpFrDate)
            setArrDate(data.arr_date ? tmpArrDate : tmpToDate);
            setArrTm(data.arr_date ? tmpArrDate : tmpToDate);
            setDepMi(data.dep_mi);
            setArrMi(data.arr_mi);
        }

    }, [openDialg]);

    const handleUseRec = () => {
        const jsonData = {
            id: id,
            rec_pid: token.personnel_id,
            dep_date: `${depDate?.getFullYear()}-${String(parseInt(depDate?.getMonth(), 10) + 1).padStart(2, '0')}-${String(depDate?.getDate()).padStart(2, '0')}T${String(depDate?.getHours()).padStart(2, '0')}:${String(depDate?.getMinutes()).padStart(2, '0')}:00.000Z`,
            dep_mi: depMi,
            arr_date: `${arrDate?.getFullYear()}-${String(parseInt(arrDate?.getMonth(), 10) + 1).padStart(2, '0')}-${String(arrDate?.getDate()).padStart(2, '0')}T${String(arrDate?.getHours()).padStart(2, '0')}:${String(arrDate?.getMinutes()).padStart(2, '0')}:00.000Z`,
            arr_mi: arrMi,
        }

        console.log(jsonData);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_cbsPort}/api/cbs/userecbook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    setSubmitComp(true);
                }
                else {
                    setSubmitERR(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูลผู้ใช้');
            });
    };

    return (
        <>
            <CBSDenyDialg openDialg={denyDialg} onCloseDialg={() => {
                setDenyDialg(false);
                onCloseDialg();
            }}
                data={data} />
            <SubmtINC openDialg={submitINC} onCloseDialg={() => setSubmitINC(false)} />
            <SubmtERR openDialg={submitERR} onCloseDialg={() => setSubmitERR(false)} />
            <SubmtComp openDialg={submitComp} onCloseDialg={() => {
                setSubmitComp(false);
                onCloseDialg();
            }} />

            <Dialog
                open={openDialg}
                onClose={onCloseDialg}
            >
                <DialogTitle>
                    บันทึกการใช้รถคำขอเลขที่ {data?.id}
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={{ xs: 2 }} columnSpacing={{ xs: 2 }}>
                        <Grid item md={12}>
                            <Stack direction="row" >
                                <Typography variant="subtitle1" sx={{ mr: 1 }}>แผนก:</Typography>{data?.dept_name}
                            </Stack>
                            <Stack direction="row" >
                                <Typography variant="subtitle1" sx={{ mr: 1 }}>สถานที่:</Typography>{data?.place}
                            </Stack>
                            <Stack direction="row" >
                                <Typography variant="subtitle1" sx={{ mr: 1 }}>ประเภทรถ:</Typography>{data?.car_type_name}
                            </Stack>
                            <Stack direction="row" >
                                <Typography variant="subtitle1" sx={{ mr: 1 }}>รุ่นทะเบียนรถ:</Typography>{`${data?.car_reg_no} ${data?.car_name}`}
                            </Stack>
                            <Stack direction="row" >
                                <Typography variant="subtitle1" sx={{ mr: 1 }}>ผู้ขับรถ:</Typography>{data?.drv_name}
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={2} sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, borderColor: 'grey.500' }}>
                                <Typography variant='subtitle1' textAlign={'center'} >รถออก</Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
                                    <DatePicker
                                        fullWidth
                                        onAccept={() => {
                                            setOpenDepTm(true);
                                        }}
                                        maxDate={arrDate}
                                        label="วันที่รถออก"
                                        format="dd/MM/yyyy"
                                        value={depDate ?? ''}
                                        onChange={(newValue) => setDepDate(newValue)}
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
                                    onChange={(event) => { setDepMi(event.target.value) }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={2} sx={{ border: '1px dashed grey', borderRadius: 2, p: 2, borderColor: 'grey.500' }}>
                                <Typography variant='subtitle1' textAlign={'center'} >รถเข้า</Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={thLocale}>
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
                                        format="dd/MM/yyyy"
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
                                    onChange={(event) => { setArrMi(event.target.value) }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' textAlign={'center'} >รวมระยะทาง {arrMi && depMi ? arrMi - depMi : 0} กิโลเมตร</Typography>
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
    )
}

export default CBSUseRecDialg