/* eslint-disable react-hooks/rules-of-hooks */
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import InputMask from "react-input-mask";
// @mui
import { Container, Stack, Typography, TextField, Card, Divider, Button, Box, styled } from '@mui/material';

const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
        borderColor: 'green'
    },
    '& input:invalid + fieldset': {
        borderColor: 'red'
    },
});

const headSname = `${localStorage.getItem('sname')} Center`;

export default function dmisnewcase() {

    const navigate = useNavigate();

    const [caseTypeId, setCaseTypeId] = useState('');
    const [caseTypeName, setCaseTypeName] = useState('');
    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState('');
    const [departmentName, setDepartmentName] = useState('');
    const [informerId, setInformerId] = useState([]);
    const [informerName, setInformerName] = useState('');

    useEffect(() => {

        const controller = new AbortController();
        // eslint-disable-next-line prefer-destructuring
        const signal = controller.signal;
        const token = jwtDecode(localStorage.getItem('token'));


        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getpersonnel/${token.personnel_id}`, { signal })
            .then((response) => response.json())
            .then((data) => {
                setInformerId(data.personnel_id);
                setInformerName(`${data.personnel_firstname} ${data.personnel_lastname}`);
                setDepartmentId(data.department_id);
                setDepartmentName(data.department_name);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("cancelled")
                }
                else {
                    console.error('Error:', error);
                }
            })

            .then(

                fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_psnDataDistPort}/api/getdepartments`, { signal })
                    .then((response) => response.json())
                    .then((data) => {
                        setDepartments(data.filter(dt => dt.department_isactive));
                    })
                    .catch((error) => {
                        if (error.name === "AbortError") {
                            console.log("cancelled")
                        }
                        else {
                            console.error('Error:', error);
                        }
                    })

            )

        return () => {
            controller.abort();
        }

    }, []);

    const handleSubmit = () => {
        const jsonData = {
            level_id: caseTypeId,
            task_issue: document.getElementById('issue').value,
            task_serialnumber: document.getElementById('serialnumber').value,
            task_device_id: document.getElementById('deviceId').value,
            informer_id: informerId,
            informer_name: informerName,
            issue_department_id: departmentId,
            department_name: departmentName,
            phoneNumber: document.getElementById('phoneNumber').value,
        };

        if (caseTypeName === "" ||
            jsonData.level_id === "") {
            alert("กรุณาเลือกงานที่ต้องการแจ้งปัญหา");
            return;
        }
        if (jsonData.task_device_id !== "" && jsonData.task_device_id.length !== 18) {
            alert("กรุณาใส่รหัสทรัพย์สินให้ถูกต้อง");
            return;
        }
        if (jsonData.task_issue === "") {
            alert("กรุณาระบุรายละเอียดของปัญหา");
            return;
        }
        if (jsonData.issue_department_id === "") {
            alert("กรุณาแผนกที่พบปัญหา");
            return;
        }

        // console.log(`level_id: ${jsonData.level_id}`);
        // console.log(`task_issue: ${jsonData.task_issue}`);
        // console.log(`task_serialnumber: ${jsonData.task_serialnumber}`);
        // console.log(`task_device_id: ${jsonData.task_device_id}`);
        // console.log(`informer_id: ${jsonData.informer_id}`);
        // console.log(`informer_name: ${jsonData.informer_name}`);
        // console.log(`issue_department_id: ${jsonData.issue_department_id}`);
        // console.log(`department_name: ${jsonData.department_name}`);
        // console.log(`phoneNumber: ${jsonData.phoneNumber}`);

        fetch(`http://${process.env.REACT_APP_host}:${process.env.REACT_APP_dmisPort}/api/dmis/addtask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'ok') {
                    navigate('/dmis', { replace: true });
                }
                else {
                    alert('ไม่สามารถทำการแจ้งปัญหาได้');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('เกิดข้อผิดพลาดในการแจ้งปัญหา');
            });

    }

    return (
        <>
            <Helmet>
                <title> ระบบแจ้งปัญหาออนไลน์ | {headSname} </title>
            </Helmet>

            <Container>

                <Typography variant="h4" sx={{ mb: 5 }}>
                    แจ้งปัญหาออนไลน์
                </Typography>
                <Card>
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        {/* กรุณาเลือกงานที่ต้องการแจ้งซ่อม */}
                        <Autocomplete
                            value={caseTypeName}
                            onChange={(event, newValue) => {
                                setCaseTypeName(newValue);
                                // console.log(`caseTypeName = ${caseTypeName}`)
                                if (newValue.label === 'งาน IT') {
                                    setCaseTypeId("DMIS_IT");
                                }
                                else if (newValue.label === 'งานซ่อมบำรุงทั่วไป') {
                                    setCaseTypeId("DMIS_MT");
                                }
                                else if (newValue.label === 'งานซ่อมบำรุงเครื่องมือแพทย์') {
                                    setCaseTypeId("DMIS_MER");
                                }
                                else {
                                    setCaseTypeId("");
                                }
                            }}
                            id="controllable-states-case-type-id"
                            options={[
                                { label: 'งาน IT' },
                                { label: 'งานซ่อมบำรุงทั่วไป' },
                                { label: 'งานซ่อมบำรุงเครื่องมือแพทย์' },]}
                            fullWidth
                            required
                            renderInput={(params) => <TextField required {...params} label="กรุณาเลือกงานที่ต้องการแจ้งปัญหา" />}
                            sx={{
                                "& .MuiAutocomplete-inputRoot": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: caseTypeName ? 'green' : 'red'
                                    }
                                }
                            }}
                        />
                        <TextField id="phoneNumber" name="phoneNumber" label="เบอร์โทรติดต่อ" />
                    </Stack>
                    <Divider />
                    <Stack spacing={2} sx={{ width: 'auto', p: 2 }}>
                        <Typography variant='h5'>รายละเอียด</Typography>
                        <InputMask
                            mask="99-99-999-999-9999"
                            disabled={false}
                            maskChar=""
                        >
                            {() => <TextField id="deviceId" name="deviceId" label="รหัสทรัพย์สิน" placeholder='xx-xx-xxx-xxx-xxxx' />}
                        </InputMask>
                        <ValidationTextField
                            required
                            id="issue"
                            name="issue"
                            label="รายละเอียดของปัญหา (ระบุยี่ห้อ, รุ่นของเครื่อง)"
                            inputProps={{ maxLength: 140 }}
                        />
                        <TextField id="serialnumber" name="serialnumber" label="Serial Number" />
                        <Autocomplete
                            value={departmentName}
                            onChange={(event, newValue) => {
                                setDepartmentName(newValue);
                                if (newValue !== null) {
                                    setDepartmentId(departments.find(o => o.department_name === newValue).department_id);
                                }
                                else {
                                    setDepartmentId("");
                                }
                            }}
                            id="controllable-states-departments-id"
                            options={Object.values(departments).map((option) => option.department_name)}
                            fullWidth
                            required
                            renderInput={(params) => <TextField required {...params} label="แผนกที่พบปัญหา" />}
                            sx={{
                                "& .MuiAutocomplete-inputRoot": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: departmentName ? 'green' : 'red'
                                    }
                                }
                            }}
                        />

                    </Stack>
                    <Box textAlign='center' sx={{ mb: 1}}>
                        <Button variant="contained" onClick={handleSubmit} align='center'>
                            ส่งเรื่องแจ้งปัญหา
                        </Button>
                    </Box>
                </Card>
            </Container>
        </>
    );
}